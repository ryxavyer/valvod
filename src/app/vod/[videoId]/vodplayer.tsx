'use client';
import AnnotationControls, { AnnotationControlsSkeleton } from '@src/components/annotationControls';
import AnnotationTimeline, { AnnotationTimelineSkeleton } from '@src/components/annotationTimeline';
import RelatedVODs from '@src/components/relatedVods';
import {
    TooltipProvider,
} from "@src/components/ui/tooltip";
import { useToast } from '@src/hooks/use-toast';
import { Tag, TAG_BUFFER_SEC, TagType } from '@src/lib/tag';
import { User } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface VODProps {
    user: User | null;
}

export default function VODPlayer({ user }: VODProps) {
    const { videoId } = useParams();
    const { toast } = useToast();
    const router = useRouter();
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagId, setActiveTagId] = useState<number | null>(null);

    const fetchTags = async () => {
        const { tags, error } = await (await fetch(`/api/tags?videoId=${videoId}`)).json();
        if (error) {
            toast({
                title: "Uh oh, we couldn't get tags",
                description: "Please try again later.",
                variant: "destructive"
            })
            return;
        }
        setTags(tags);
    }

    useEffect(() => {
        if (!videoId) {
            router.push('/');
        }
        if (playerContainerRef.current) {
            playerRef.current = new window.YT.Player(playerContainerRef.current, {
                height: 'full',
                width: 'full',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    mute: 1, // needed for autoplay
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                },
                events: {
                    onReady: (event: any) => {
                        const data = event.target.getVideoData();
                        document.title = data.title;
                        setVideoTitle(data.title);
                        setVideoDuration(event.target.getDuration());
                        setLoading(false);
                        if (user) {
                            fetchTags();
                        }
                    },
                },
            });
        }
    }, [videoId, router]);

    const addTag = async (type: TagType) => {
        if (playerRef.current) {
            const annotationTime = Math.max(playerRef.current.getCurrentTime() - TAG_BUFFER_SEC, 0);
            setTags((prev) => [...prev, { id: -1, time: annotationTime, type, description: '' }]);
            const res = await fetch(`/api/tags/`, {
                method: 'POST',
                body: JSON.stringify({ videoId, tag: { time: annotationTime, type, description: '' } }),
            });
            if (!res.ok) {
                toast({
                    title: "Uh oh, we couldn't add your tag",
                    description: "Please try again later.",
                    variant: "destructive"
                })
                // rollback the tag
                setTags((prev) => prev.filter((tag) => tag.id !== -1));
                return;
            }
            // if success, update the tag with the returned id
            const { tag } = await res.json();
            setTags((prev) => prev.map((t) => t.id === -1 ? { ...tag } : t));
        }
    };

    const handleMarkerClick = (tag: Tag) => {
        if (playerRef.current) {
            playerRef.current.seekTo(tag.time, true);
        }
        setActiveTagId(tag.id);
    };

    const AnnotationUISkeleton = () => (
        <div className='w-full flex flex-col items-center'>
            <div className='w-full pb-2'>
                <AnnotationTimelineSkeleton/>
            </div>
        </div>
    );

    return (
        <div className='w-full h-full pt-[120px] xl:h-screen'>
            <TooltipProvider>
                <div className={`flex flex-col w-full h-full justify-center space-x-0 space-y-4 items-start px-6 md:px-10 xl:flex-row xl:space-x-[100px] xl:space-y-0`}>
                    <div className='flex flex-col justify-center items-center w-full xl:w-[calc(100vw-20%)] max-w-[1175px] xl:aspect-video'>
                        <div className='flex flex-row w-full h-full'>
                            <div className='w-full aspect-video'>
                                <div ref={playerContainerRef} className="w-full h-full bg-muted"></div>
                            </div>
                            {loading
                                ? <AnnotationControlsSkeleton/>
                                : <AnnotationControls user={user} addTag={addTag} />
                            }
                        </div>
                        {loading
                        ? <AnnotationUISkeleton/>
                        :
                            <div className='w-full'>
                                {videoDuration > 0 && (
                                    <AnnotationTimeline
                                        tags={tags}
                                        setTags={setTags}
                                        activeTagId={activeTagId}
                                        videoDuration={videoDuration}
                                        onMarkerClick={handleMarkerClick}
                                    />
                                )}
                            </div>
                        }
                    </div>
                    <div className='w-full h-full xl:w-auto'>
                        <RelatedVODs title={videoTitle}/>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
}
