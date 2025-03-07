import React from 'react';
import Navigation from '@src/components/navigation';
import VOD from './vod';
import { createClient } from '@src/lib/supabase';

export const metadata = {
    title: "Watch VOD | VALVOD",
    description: "Watch a VALORANT VOD and take notes for later.",
}

export default async function Watch() {
    const supabase = await createClient()
    // page is not private so no need for error handling
    const { data, error } = await supabase.auth.getUser()
    return (
        <div>
            <Navigation user={data.user}/>
            <VOD user={data.user}/>
        </div>
    );
}
