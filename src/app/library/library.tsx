'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@src/hooks/use-toast';
import Link from 'next/link';
import { dateToTimeAgo } from '@src/lib/utils';
import { AGENTS, agentToRole, ROLES, roleTagToJSX, TagType } from '@src/lib/valorant';
import { VODWithTags } from '../api/youtube/types';
import { LoaderCircle } from 'lucide-react';
import SelectCombobox from '@src/components/ui/select-combobox';
import { Button } from '@src/components/ui/button';


enum TABS {
    FAVORITES = 'favorites',
    TAGGED = 'tagged',
}

interface LibraryProps {
    user: User | null;
}

export default function Library({ user }: LibraryProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<VODWithTags[]>([]);
    const [annotated, setAnnotated] = useState<VODWithTags[]>([]);
    const [activeTab, setActiveTab] = useState(TABS.FAVORITES);
    const [recommenderSaving, setRecommenderSaving] = useState(false);
    const [recommenderAgent, setRecommenderAgent] = useState(null);
    const [recommenderRole, setRecommenderRole] = useState(null);

    const fetchLibrary = async () => {
        const { recommender, rError } = await (await fetch("/api/recommendations")).json();
        if (rError) {
            toast({
                title: "Uh oh, we couldn't get your settings",
                description: "Please try again later.",
                variant: "destructive"
            })
            return;
        }
        setRecommenderAgent(recommender.agent);
        setRecommenderRole(recommender.role);
        const { favorites, annotated, lError } = await (await fetch("/api/library")).json();
        if (lError) {
            toast({
                title: "Uh oh, we couldn't get your library",
                description: "Please try again later.",
                variant: "destructive"
            })
            return;
        }
        setFavorites(favorites);
        setAnnotated(annotated);
        setLoading(false);
    }

    const saveSettingsMemo = useCallback(async () => {
        setRecommenderSaving(true);
        const res = await fetch('/api/recommendations', {
            method: 'POST',
            body: JSON.stringify({ agent: recommenderAgent, role: recommenderRole}),
        });
        if (!res.ok) {
            toast({
                title: "Uh oh, we couldn't save those settings",
                description: "Please try again later.",
                variant: "destructive"
            })
        }
        setRecommenderSaving(false);
    }, [recommenderAgent, recommenderRole]);

    const handleAgentSelect = (agent: string) => {
        setRecommenderAgent(agent);
        if (agent) {
            const role = agentToRole(agent);
            if (role !== "unknown") {
                setRecommenderRole(role);
            } else {
                setRecommenderRole(null);
            }
        }
    }

    const handleRoleSelect = (role: string) => {
        setRecommenderRole(role);
    }

    useEffect(() => {
        fetchLibrary();
    }, [])

    const recommendationSkeleton = (
        <div className="bg-muted animate-pulse w-full h-40 rounded-md"></div>
    );

    const videosSkeleton = (
        <div className="bg-muted animate-pulse h-80 w-full rounded-md"></div>
    );

    return (
        <div className='mt-[110px] flex flex-col space-y-4 w-full px-6 md:px-10'>
            {loading
            ?
                <>
                {recommendationSkeleton}
                {videosSkeleton}
                </>
            :
                <>
                    <div className="bg-neutral-900 px-4 py-2 rounded-md flex flex-col space-y-4">
                        <div className='flex flex-col space-y-1'>
                            <h2 className='text-lg font-bold'>Recommendation Preferences</h2>
                            <p className='text-sm text-neutral-300'>Tell us more about how you play so we can show you the most useful VODs.</p>
                        </div>
                        <div className='flex flex-row items-center space-x-4'>
                            <form className='w-[650px] flex flex-row space-x-2'>
                                <div className='flex flex-col w-[250px]'>
                                    <label className='text-neutral-500'>I currently main</label>
                                    <SelectCombobox options={AGENTS} optionName='agent' selectValue={recommenderAgent} setSelectValue={handleAgentSelect} className='w-full'/>
                                </div>
                                <div className='flex flex-col w-[250px]'>
                                    <label className='text-neutral-500'>I want to learn</label>
                                    <SelectCombobox options={ROLES} optionName='role' selectValue={recommenderRole} setSelectValue={handleRoleSelect} className='w-full'/>
                                </div>
                                <div className='flex flex-row items-center space-x-2 mt-6'>
                                    <Button
                                        variant='default'
                                        className='w-[100px]'
                                        disabled={recommenderSaving}
                                        onClick={saveSettingsMemo}
                                    >
                                        Save
                                    </Button>
                                    <LoaderCircle className={`w-6 h-6 animate-spin ${recommenderSaving ? 'block' : 'hidden'}`}/>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start">
                        <div className='flex flex-row space-x-2'>
                            <div className="bg-neutral-900 px-4 py-1 rounded-t-lg cursor-pointer" role='button' onClick={() => setActiveTab(TABS.FAVORITES)}>
                                <h2 className={`text-lg font-bold ${activeTab === TABS.FAVORITES ? 'text-white' : 'text-neutral-500'}`}>Favorites</h2>
                            </div>
                            <div className="bg-neutral-900 px-4 py-1 rounded-t-lg cursor-pointer" role='button' onClick={() => setActiveTab(TABS.TAGGED)}>
                                <h2 className={`text-lg font-bold ${activeTab === TABS.TAGGED ? 'text-white' : 'text-neutral-500'}`}>Tagged</h2>
                            </div>
                        </div>
                        <div className='grid w-full p-4 gap-4 justify-start overflow-y-auto bg-neutral-900 rounded-xl rounded-tl-none' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                            {activeTab === TABS.FAVORITES
                            ?
                                <>
                                {favorites.map((video, index) => (
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
                                                    {video.tags.map((tag) =>
                                                        <>{tag.type != TagType.ROLE
                                                            ?
                                                            <div key={`${video.id}_tag_${tag}`} className='bg-white bg-opacity-5 rounded-md px-1 py-0.5 mr-1'>
                                                                <span className='text-[10px] text-neutral-500'>{tag.name.toUpperCase()}</span>
                                                            </div>
                                                            :
                                                            <div key={`${video.id}_tag_${tag}`} className='bg-white bg-opacity-5 rounded-md px-1 py-1 mr-1'>
                                                                {roleTagToJSX(tag, 'h-3 w-3 shrink-0 opacity-100 fill-neutral-500')}
                                                            </div>
                                                        }</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                </>
                            : 
                                <>
                                {annotated.map((video, index) => (
                                    <Link 
                                        key={video.id || index}
                                        href={`/vod/${video.id}`} 
                                        className='flex flex-col transition-transform max-w-3xl hover:scale-[102%]'>
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
                                                    {video.tags.map((tag) =>
                                                        <>{tag.type != TagType.ROLE
                                                            ?
                                                            <div key={`${video.id}_tag_${tag}`} className='bg-white bg-opacity-5 rounded-md px-1 py-0.5 mr-1'>
                                                                <span className='text-[10px] text-neutral-500'>{tag.name.toUpperCase()}</span>
                                                            </div>
                                                            :
                                                            <div key={`${video.id}_tag_${tag}`} className='bg-white bg-opacity-5 rounded-md px-1 py-1 mr-1'>
                                                                {roleTagToJSX(tag, 'h-3 w-3 shrink-0 opacity-100 fill-neutral-500')}
                                                            </div>
                                                        }</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
