import React from 'react';
import Navigation from '@src/components/navigation';
import { createClient } from '@src/lib/supabase';
import { redirect } from 'next/navigation';
import VODResults from '@src/components/vodresults';

interface SearchResultsProps {
    params: Promise <{params:string}>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// don't cache this page since query is dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SearchResults = async ({ params, searchParams }: SearchResultsProps) => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    const query = await searchParams["q"];
    if (!query) {
        redirect('/')
    }
    return (
        // key is needed to force re-render when query changes
        <div key={query as string} className='flex lg:flex-row'>
            <Navigation user={data.user}/>
            <VODResults/>
        </div>
    );
}

export default SearchResults;
