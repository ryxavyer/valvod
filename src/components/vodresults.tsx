'use client';
import { type VODWithTags } from '@src/app/api/youtube/types';
import React from 'react';
import VOD from './vod';

interface VODResultsProps {
    initialVideos: VODWithTags[];
    query: string;
}

const VODResults = ({ initialVideos, query }: VODResultsProps) => {
    return (
        <div
            className='mt-[110px] grid w-full p-2 gap-4 overflow-y-auto px-6 md:px-10'
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}
        >
            {initialVideos.map((video) => (
                <VOD key={video.id} video={video}/>
            ))}
            {!initialVideos.length && <div className='flex w-full items-center justify-center'>Sorry, we couldn't find any VODs. Try another search.</div>}
        </div>
    );
}

export default VODResults;
