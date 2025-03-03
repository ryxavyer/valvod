import { createClient } from '@src/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const url = new URL(request.url);
    const videoId = url.searchParams.get('videoId');
    try {
        const { data, error } = await supabase.from('tags').select().eq('user_id', userResponse.data.user.id).eq('vod_id', videoId)
        if (error) {
            throw error
        }
        return NextResponse.json({ tags: data });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { videoId, tag } = await request.json()
    try {
        const { data, error } = await supabase
            .from('tags')
            .insert([{ user_id: userResponse.data.user.id, vod_id: videoId, type: tag.type, time: tag.time, description: tag.description }])
            .select()
        if (error) {
            throw error
        }
        return NextResponse.json({ tag: data[0], status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { id, description } = await request.json()
    try {
        const { data, error } = await supabase.from('tags')
            .update([{ description: description }])
            .eq('id', id)
        if (error) {
            throw error
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { tagId } = await request.json()
    try {
        const { data, error } = await supabase.from('tags').delete().eq('id', tagId)
        if (error) {
            throw error
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
