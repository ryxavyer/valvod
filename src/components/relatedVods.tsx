'use client';
import { type VODWithTags } from '@src/app/api/youtube/types';
import React, { useEffect, useState } from 'react';
import { useToast } from "@src/hooks/use-toast";
import VOD from './vod';

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
                <VOD key={video.id} video={video}/>
            ))}
            {(loading) && Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={`skeleton-${i}`} />)}
        </div>
    );
}

export default RelatedVODs;
