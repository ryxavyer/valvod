import React from 'react';
import Navigation from '@src/components/navigation';
import VODList from '../components/vodlist';
import { createClient } from '@src/lib/supabase';
import AgentCarousel from '@src/components/agentCarousel';

export const metadata = {
    title: "VALVOD | #1 Site for VALORANT VOD Review",
    description: "The latest VALORANT VODs from the top players in the world.",
}

const Index = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    return (
        <div className='flex flex-col'>
            <Navigation user={data.user}/>
            <div className='mt-[110px]'></div>
            <AgentCarousel/>
            <VODList/>
        </div>
    );
}

export default Index;
