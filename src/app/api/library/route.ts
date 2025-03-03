import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@src/lib/supabase';
import { getTags } from '@src/lib/valorant';
import { VODWithTags } from '../youtube/types';

export interface VOD_USERFAVORITE {
    id: string;
    channel_id: string;
    published_at: string;
    metadata:  {
        title: string;
        description: string;
        thumbnail: string;
    }
    userfavorite: {
        user_id: string;
        vod_id: string;
        created_at: string;
    }
}

export interface VOD_TAGS {
    id: string;
    channel_id: string;
    published_at: string;
    metadata:  {
        title: string;
        description: string;
        thumbnail: string;
    }
    tags: {
        user_id: string;
        vod_id: string;
        created_at: string;
    }
}


export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    try {
        const favorites = await supabase
            .from('vods')
            .select(`
                *,
                userfavorite!inner(user_id, vod_id, created_at)
            `)
            .eq('userfavorite.user_id', userResponse.data.user.id);
        if (favorites.error) {
            throw favorites.error
        }
        const annotated = await supabase
            .from('vods')
            .select(`
                *,
                tags!inner(user_id, vod_id, created_at)
            `)
            .eq('tags.user_id', userResponse.data.user.id);
        if (annotated.error) {
            throw annotated.error
        }
        const favoritesData: VOD_USERFAVORITE[] = favorites.data;
        let favoritesWithTags: VODWithTags[] = [];
        for (const vod of favoritesData.sort((a, b) => new Date(b.userfavorite.created_at).getTime() - new Date(a.userfavorite.created_at).getTime())) {
            favoritesWithTags.push({ ...vod, tags: getTags(vod.metadata.title) });
        }
        const annotatedData: VOD_TAGS[] = annotated.data;
        let annotatedWithTags: VODWithTags[] = [];
        for (const vod of annotatedData.sort((a, b) => new Date(b.tags.created_at).getTime() - new Date(a.tags.created_at).getTime())) {
            annotatedWithTags.push({ ...vod, tags: getTags(vod.metadata.title) });
        }
        return NextResponse.json({ favorites: favoritesWithTags, annotated: annotatedWithTags });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
