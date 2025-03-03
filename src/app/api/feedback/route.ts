import { createClient } from '@src/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    // get type and message from request body
    const { type, message } = await request.json()
    // save the feedback to the database
    try {
        const { data, error } = await supabase.from('feedback').insert([{ type, message }])
        if (error) {
            throw error
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
