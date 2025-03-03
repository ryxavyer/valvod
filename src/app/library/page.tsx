import React from 'react';
import Navigation from '@src/components/navigation';
import Library from './library';
import { createClient } from '@src/lib/supabase';

const Index = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    return (
        <div className='flex lg:flex-row'>
            <Navigation user={data.user}/>
            <Library user={data.user}/>
        </div>
    );
}

export default Index;
