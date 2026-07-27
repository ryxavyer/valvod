import React from 'react';
import Navigation from '@src/components/navigation';
import { createClient } from '@src/lib/supabase';
import { redirect } from 'next/navigation';
import VODResults from '@src/components/vodresults';
import { getSearchResults, getTags } from '@src/lib/valorant';
import type { VODWithTags } from '@src/app/api/youtube/types';

interface SearchResultsProps {
    params: Promise <{params:string}>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// don't cache this page since query is dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSearchData(searchString: string): Promise<VODWithTags[]> {
    const supabase = await createClient();
    const searchTerms = searchString.replace(/[^a-zA-Z ]/g, "").toLowerCase().split(" ");

    try {
        const { data, error } = await supabase.from('vods')
            .select('*')
            .ilikeAnyOf('metadata->>title', searchTerms.map(term => `%${term}%`))
            .order('published_at', { ascending: false })
            .limit(100);

        if (error || !data || data.length === 0) {
            return [];
        }

        // Process tags for all VODs
        const vodsWithTags: VODWithTags[] = data.map(vod => ({
            ...vod,
            tags: getTags(vod.metadata.title)
        }));

        // Apply search ranking algorithm
        return getSearchResults(vodsWithTags, searchString);
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

const SearchResults = async ({ searchParams }: SearchResultsProps) => {
    const supabase = await createClient()
    const query = await searchParams["q"];
    if (!query) {
        redirect('/')
    }

    // Fetch user and search results in parallel
    const [userData, searchData] = await Promise.all([
        supabase.auth.getUser(),
        getSearchData(query as string)
    ]);

    return (
        // key is needed to force re-render when query changes
        <div key={query as string} className='flex lg:flex-row'>
            <Navigation user={userData.data.user}/>
            <VODResults initialVideos={searchData} query={query as string}/>
        </div>
    );
}

export default SearchResults;
