import React from 'react';
import Navigation from '@src/components/navigation';
import VODList from '../components/vodlist';
import { createClient } from '@src/lib/supabase';
import AgentCarousel from '@src/components/agentCarousel';
import { getTags } from '@src/lib/valorant';
import type { VODWithTags } from '@src/app/api/youtube/types';

export const metadata = {
    title: "VALVOD | #1 Site for VALORANT VOD Review",
    description: "The latest VALORANT VODs from the top players in the world."
}

async function getInitialVods(): Promise<{ vods: VODWithTags[], nextPageNum: number, isLastPage: boolean }> {
    const supabase = await createClient();
    const VOD_RETURN_LIMIT = 50;

    try {
        const { data, error } = await supabase.from('vods')
            .select('*')
            .order('published_at', { ascending: false })
            .range(0, VOD_RETURN_LIMIT - 1);

        if (error || !data || data.length === 0) {
            return { vods: [], nextPageNum: 2, isLastPage: true };
        }

        // Process tags in parallel for better performance
        const vodsWithTags: VODWithTags[] = data.map(vod => ({
            ...vod,
            tags: getTags(vod.metadata.title)
        }));

        return {
            vods: vodsWithTags,
            nextPageNum: 2,
            isLastPage: data.length < VOD_RETURN_LIMIT
        };
    } catch (error) {
        console.error('Error fetching initial VODs:', error);
        return { vods: [], nextPageNum: 2, isLastPage: true };
    }
}

const Index = async () => {
    const supabase = await createClient()

    // Fetch user and initial VODs in parallel
    const [userData, initialData] = await Promise.all([
        supabase.auth.getUser(),
        getInitialVods()
    ]);

    return (
        <div className='flex flex-col'>
            <Navigation user={userData.data.user}/>
            <div className='mt-[110px]'></div>
            <AgentCarousel/>
            <VODList
                initialVods={initialData.vods}
                initialPage={initialData.nextPageNum}
                initialIsLastPage={initialData.isLastPage}
            />
        </div>
    );
}

export default Index;