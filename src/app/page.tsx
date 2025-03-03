import React from 'react';
import Navigation from '@src/components/navigation';
import VODList from '../components/vodlist';
import { createClient } from '@src/lib/supabase';

const Index = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    return (
        <div className='flex lg:flex-row'>
            <Navigation user={data.user}/>
            <VODList/>
        </div>
    );
}

export default Index;
