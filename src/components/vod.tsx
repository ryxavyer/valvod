import { VODWithTags } from '@src/app/api/youtube/types';
import { dateToTimeAgo } from '@src/lib/utils';
import { roleTagToJSX, TagType } from '@src/lib/valorant';
import Link from 'next/link';
import React from 'react';

interface VODProps {
    video: VODWithTags;
}

const VOD = ({ video }: VODProps) => {
    return (
        <Link 
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
                                    <div key={`${video.id}_tag_${tag.name}`} className='bg-white bg-opacity-5 rounded-md px-1 py-0.5 mr-1'>
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
    );
};

export default VOD;
