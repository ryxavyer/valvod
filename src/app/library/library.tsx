'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@src/hooks/use-toast';
import { AGENTS, agentToRole, ROLES } from '@src/lib/valorant';
import { VODWithTags } from '../api/youtube/types';
import { LoaderCircle } from 'lucide-react';
import SelectCombobox from '@src/components/ui/select-combobox';
import { Button } from '@src/components/ui/button';
import VOD from '@src/components/vod';


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
    const [recommenderChanged, setRecommenderChanged] = useState(false);
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
        } else {
            setRecommenderChanged(false);
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
        setRecommenderChanged(true);
    }

    const handleRoleSelect = (role: string) => {
        setRecommenderRole(role);
        setRecommenderChanged(true);
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
                        <form className='w-[350px] flex flex-col space-y-2 md:w-[650px] md:flex-row md:space-x-4 md:space-y-0'>
                            <div className='flex flex-col w-[250px]'>
                                <label className='text-neutral-500'>I currently main</label>
                                <SelectCombobox options={AGENTS} optionName='agent' selectValue={recommenderAgent} setSelectValue={handleAgentSelect} className='w-full'/>
                            </div>
                            <div className='flex flex-col w-[250px]'>
                                <label className='text-neutral-500'>I want to learn</label>
                                <SelectCombobox options={ROLES} optionName='role' selectValue={recommenderRole} setSelectValue={handleRoleSelect} className='w-full'/>
                            </div>
                            <div className='flex flex-row items-end space-x-2 md:mt-6'>
                                <Button
                                    variant='default'
                                    className='w-[100px]'
                                    disabled={recommenderSaving || !recommenderChanged}
                                    onClick={saveSettingsMemo}
                                >
                                    Save
                                </Button>
                                <LoaderCircle className={`w-6 h-6 animate-spin ${recommenderSaving ? 'block' : 'hidden'}`}/>
                            </div>
                        </form>
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
                        <div className='w-full h-full bg-neutral-900 rounded-xl rounded-tl-none overflow-y-auto'>
                            <div className='grid w-full h-full p-4 gap-4 grid-cols-[repeat(auto-fit,_minmax(300px,1fr))]'>
                                {activeTab === TABS.FAVORITES
                                ?
                                    <>
                                    {favorites.length > 0
                                    ?
                                        favorites.map((video, index) => (
                                            <VOD key={video.id} video={video}/>
                                        ))
                                    :
                                        <div className='w-full'>Favorite a VOD to see it here!</div>
                                    }
                                    </>
                                : 
                                    <>
                                    {annotated.length > 0
                                    ?
                                        annotated.map((video, index) => (
                                            <VOD key={video.id} video={video}/>
                                        ))
                                    :
                                        <div className='w-full'>Create tags on a VOD to see it here!</div>
                                    }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
