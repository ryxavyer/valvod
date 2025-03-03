import { createClient } from '@src/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const url = new URL(request.url);
    const videoId = url.searchParams.get('videoId');
    try {
        const { data, error } = await supabase.from('userfavorite').select().eq('user_id', userResponse.data.user.id).eq('vod_id', videoId)
        if (error) {
            throw error
        }
        return NextResponse.json({ favorited: data.length > 0 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { videoId } = await request.json()
    try {
        const { data, error } = await supabase.from('userfavorite').insert([{ user_id: userResponse.data.user.id, vod_id: videoId }])
        if (error) {
            throw error
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { videoId } = await request.json()
    try {
        const { data, error } = await supabase.from('userfavorite').delete().eq('user_id', userResponse.data.user.id).eq('vod_id', videoId)
        if (error) {
            throw error
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
