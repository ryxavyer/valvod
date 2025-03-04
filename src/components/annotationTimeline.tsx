import { Tag, tagTypeToJSX } from '@src/lib/tag';
import { formatTime } from '@src/utils/time';
import React, { useRef } from 'react';

export interface AnnotationTimelineProps {
    tags: Tag[];
    activeTagId: number | null;
    videoDuration: number;
    onMarkerClick: (tag: Tag) => void;
}

export const AnnotationTimelineSkeleton = () => {
    return (
        <div className="w-full h-32 bg-muted animate-pulse rounded-sm" />
    );
};

export function AnnotationTimeline({ tags, activeTagId, videoDuration, onMarkerClick }: AnnotationTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const tickInterval = 60;
    const ticks: number[] = [];
    for (let t = 0; t <= videoDuration; t += tickInterval) {
        ticks.push(t);
    }
    // sort tags by tick to allow for overlapping tags
    // idea here is that exact positioning on timeline is not
    // more important than usability for multiple tags around the same time
    const tickTagMap = new Map<number, Tag[]>();
    ticks.forEach(tick => {
        if (!tickTagMap.has(tick)) {
            tickTagMap.set(tick, []);
        }
        const tagsAtTick = tags.filter(tag => tag.time >= tick && tag.time < tick + tickInterval);
        tickTagMap.set(tick, tagsAtTick);
    })

    return (
        <div
            ref={timelineRef}
            className="relative h-32 w-full bg-neutral-900 rounded-sm"
        >
                {ticks.map((tick, index) => {
                    const leftPercent = (tick / videoDuration) * 100;
                    return (
                        <div
                            key={index}
                            className="absolute h-6 w-[1px] bg-neutral-500"
                            style={{ left: `${leftPercent}%`, bottom: 0 }}
                            title={formatTime(tick)}
                        >
                        </div>
                    );
                })}
                {Array.from(tickTagMap.entries()).map(([tick, tags], index) => {
                    if (tags.length === 0) {
                        return null;
                    }
                    // place tags in the middle of the ticks (4 is hardcoded to match width of tags)
                    const leftPercent = ((tick + (tickInterval/4)) / videoDuration) * 100;
                    return (
                        <div
                            key={index}
                            className='absolute flex flex-col items-center justify-around h-3/4'
                            style={{
                                left: `${leftPercent}%`,
                                top: '12.5%',
                            }}
                        >
                            {tags.map(tag => {
                                return (
                                    <div
                                        key={tag.id}
                                        className={`rounded-sm cursor-pointer bg-transparent hover:scale-[120%]`}
                                        title={`${formatTime(tag.time)} - ${tag.type}`}
                                        aria-label={`${formatTime(tag.time)} - ${tag.type}`}
                                        onClick={() => onMarkerClick(tag)}
                                    >
                                        {tagTypeToJSX(tag.type, `h-4 w-4 shrink-0 opacity-100 ${activeTagId === tag.id ? 'stroke-accent' : ''}`)}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
        </div>
    );
}

export default AnnotationTimeline;
