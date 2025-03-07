'use client';
import AnnotationControls, { AnnotationControlsSkeleton } from '@src/components/annotationControls';
import AnnotationTimeline, { AnnotationTimelineSkeleton } from '@src/components/annotationTimeline';
import RelatedVODs from '@src/components/relatedVods';
import SignupModal from '@src/components/signupModal';
import { Toggle } from '@src/components/ui/toggle';
import {
    TooltipProvider,
} from "@src/components/ui/tooltip";
import { useToast } from '@src/hooks/use-toast';
import { Tag, TAG_BUFFER_SEC, TagType } from '@src/lib/tag';
import { User } from '@supabase/supabase-js';
import { Star } from 'lucide-react';
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

export default function VOD({ user }: VODProps) {
    const { videoId } = useParams();
    const { toast } = useToast();
    const router = useRouter();
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const favoriteStarRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(true);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagId, setActiveTagId] = useState<number | null>(null);

    const fetchFavoriteStatus = async () => {
        const { favorited, error } = await (await fetch(`/api/favorites?videoId=${videoId}`)).json();
        if (error) {
            toast({
                title: "Uh oh, we couldn't get favorite status",
                description: "Please try again later.",
                variant: "destructive"
            })
            return;
        }
        if (favorited) {
            favoriteStarRef.current.dataset.state = "on";
        } else {
            favoriteStarRef.current.dataset.state = "off";
        }
    }

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
                            fetchFavoriteStatus();
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

    const toggleFavorite = async () => {
        // state value here is the pre-click value
        if (favoriteStarRef.current.dataset.state === 'off') {
            // add to favorites
            const res = await fetch(`/api/favorites/`, {
                method: 'POST',
                body: JSON.stringify({ videoId }),
            });
            if (!res.ok) {
                favoriteStarRef.current.dataset.state = "off";
                toast({
                    title: "Uh oh, we couldn't update favorite status",
                    description: "Please try again later.",
                    variant: "destructive"
                })
            }
        } else {
            // remove from favorites
            const res = await fetch(`/api/favorites/`, {
                method: 'DELETE',
                body: JSON.stringify({ videoId }),
            });
            if (!res.ok) {
                favoriteStarRef.current.dataset.state = "on";
                toast({
                    title: "Uh oh, we couldn't update favorite status",
                    description: "Please try again later.",
                    variant: "destructive"
                })
            }
        }
    }

    const TitleSkeleton = () => (
        <div className='w-full flex flex-row justify-between items-center py-2'>
            <div className="w-[80%] h-10 bg-muted animate-pulse rounded-lg" />
            <div className='w-[70px] min-w-[75px] h-10 bg-muted animate-pulse rounded-lg'/>
        </div>
    );

    const AnnotationUISkeleton = () => (
        <div className='w-full flex flex-col items-center'>
            <div className='w-full pb-2'>
                <AnnotationTimelineSkeleton/>
            </div>
        </div>
    );

    return (
        <div className='w-full h-full pt-[100px] xl:h-screen'>
            <TooltipProvider>
                <div className={`flex flex-col w-full h-full justify-center space-x-0 space-y-4 items-start px-6 md:px-10 xl:flex-row xl:${user ? 'space-x-[100px]' : 'space-x-[25px]'} xl:space-y-0`}>
                    <div className='flex flex-col justify-center items-center w-full xl:w-[calc(100vw-20%)] max-w-[1175px] xl:aspect-video'>
                        {loading 
                        ? <TitleSkeleton/>
                        :
                            <div className='w-full py-2 flex flex-row items-center justify-between'>
                                <h1 className='w-[90%] text-xl font-semibold truncate'>{videoTitle}</h1>
                                {user
                                ?
                                    <Toggle
                                        ref={favoriteStarRef}
                                        onClick={toggleFavorite}
                                        size="default"
                                        variant="outline" 
                                        className='group w-[70px] border-secondary hover:bg-transparent hover:text-muted-foreground data-toggled:bg-transparent data-toggled:text-accent-foreground'
                                        title='Add to Favorites'
                                        aria-label='Add to Favorites'>
                                        <Star className='h-6 w-6 group-data-toggled:fill-accent'/>
                                    </Toggle>
                                :
                                    <SignupModal
                                        trigger={
                                            <Toggle
                                                ref={favoriteStarRef}
                                                size="default"
                                                variant="outline" 
                                                className='group w-[70px] border-secondary hover:bg-transparent hover:text-muted-foreground data-toggled:bg-transparent data-toggled:text-accent-foreground'
                                                title='Add to Favorites'
                                                aria-label='Add to Favorites'>
                                                <Star className='h-6 w-6 group-data-toggled:fill-accent'/>
                                            </Toggle>
                                        }
                                    />
                                }
                            </div>
                        }
                        <div className='flex flex-row w-full h-full'>
                            <div className='w-full aspect-video'>
                                <div ref={playerContainerRef} className="w-full h-full bg-muted"></div>
                            </div>
                            {loading
                                ? <AnnotationControlsSkeleton/>
                                : <>{user && <AnnotationControls addTag={addTag} />}</>
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
