'use client';
import { type VODWithTags } from '@src/app/api/youtube/types';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { dateToTimeAgo } from '@src/lib/utils';
import { useToast } from "@src/hooks/use-toast";
import { TagType, roleTagToJSX } from '@src/lib/valorant';

interface RelatedVODsProps {
    title: string;
}

const RelatedVODs = ({ title }: RelatedVODsProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<VODWithTags[]>([]);

    const fetchVods = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/related/?title=${title}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch VODs');
            }
            setVideos(prev => [...prev, ...data.vods]);
        } catch (error) {
            toast({
                title: "Uh oh, we're having trouble fetching related VODs",
                description: "Please try again later.",
                variant: "destructive",
            })
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!title) return;
        fetchVods();
    }, [title]);

    const VideoSkeleton = () => (
        <div className='flex flex-col items-center animate-pulse'>
          <div className='w-full aspect-video bg-muted rounded-xl mb-2'></div>
          <div className="w-full">
            <div className='h-4 bg-muted rounded w-full mb-2'></div>
            <div className='flex flex-row justify-between space-x-1 w-full'>
                <div className='h-3 bg-muted rounded w-1/6'></div>
                <div className='flex flex-row justify-end space-x-1 w-full'>
                    <div className='h-3 bg-muted rounded w-1/6'></div>
                    <div className='h-3 bg-muted rounded w-1/6'></div>
                </div>
            </div>
          </div>
        </div>
    );

    return (
        <div 
            className='grid w-full h-full p-2 gap-4 overflow-y-auto grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,_minmax(300px,1fr))] xl:grid-cols-[repeat(1,_minmax(200px,300px))] xl:auto-rows-min'
        >
            {videos.map((video, index) => (
                <Link 
                    key={video.id || index}
                    href={`/vod/${video.id}`} 
                    className='flex flex-col items-center transition-transform max-w-3xl hover:scale-[102%]'>
                    <div
                        className='w-full aspect-video rounded-xl overflow-hidden'
                    >
                        <img
                            src={video.metadata.thumbnail}
                            alt={video.metadata.title}
                            className='object-cover w-full h-full'
                        />
                    </div>
                    <div className="w-full mt-2 text-start">
                        <h3 className="text-md font-semibold truncate lg:text-sm">{video.metadata.title.toUpperCase()}</h3>
                        <div className='flex flex-row items-center justify-between mt-1'>
                            <span className='text-xs text-neutral-500'>{dateToTimeAgo(video.published_at)}</span>
                            <div className="flex flex-row items-start text-xs text-neutral-500">
                                {video.tags.map((tag, index) =>
                                    <div key={`${video.id}_tag_${index}`}>
                                        {tag.type != TagType.ROLE
                                            ?
                                            <div key={`${video.id}_tag_${tag.name}`} className='hidden bg-white bg-opacity-5 rounded-md px-1 py-0.5 mr-1 md:block'>
                                                <span className='text-[10px] text-neutral-500'>{tag.name.toUpperCase()}</span>
                                            </div>
                                            :
                                            <div key={`${video.id}_tag_${tag.name}`} className='bg-white bg-opacity-5 rounded-md px-1 py-1 mr-1'>
                                                {roleTagToJSX(tag, 'h-3 w-3 shrink-0 opacity-100 fill-neutral-500')}
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {(loading) && Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={`skeleton-${i}`} />)}
        </div>
    );
}

export default RelatedVODs;
