'use client';
import { type VODWithTags } from '@src/app/api/youtube/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from "@src/hooks/use-toast";
import VOD from './vod';

const VODList = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<VODWithTags[]>([]);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchVods = useCallback(async () => {
        if (isLastPage) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/youtube/latest/?page=${page}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch VODs');
            }
            setVideos(prev => [...prev, ...data.vods]);
            setPage(data.nextPageNum);
            setIsLastPage(data.isLastPage);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Uh oh, we're having trouble fetching VODs",
                description: "Please try again later.",
                variant: "destructive",
            })
        }
    }, [isLastPage, page, toast]);

    useEffect(() => {
        fetchVods();
    }, []);

    useEffect(() => {
        if (!sentinelRef.current) return;
        const obs = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isLastPage && !loading) {
                    fetchVods();
                }
            },
            { root: null, rootMargin: '200px', threshold: 0 }
        );
        obs.observe(sentinelRef.current);
        return () => { obs.disconnect(); };
    }, [fetchVods, isLastPage, loading]);

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
            className='mt-[110px] grid w-full p-2 gap-4 overflow-y-auto px-6 md:px-10'
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {videos.map((video, index) => (
                <VOD key={video.id} video={video}/>
            ))}
            {loading && Array.from({ length: 20 }).map((_, i) => <VideoSkeleton key={`skeleton-${i}`} />)}
            {/* sentinel observer triggers next page load */}
            <div ref={sentinelRef} />
        </div>
    );
}

export default VODList;
