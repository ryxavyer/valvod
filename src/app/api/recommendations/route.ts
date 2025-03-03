import { createClient } from "@src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    try {
        const { data, error } = await supabase
            .from('recommendations')
            .select('*')
            .eq('user_id', userResponse.data.user.id)
            .single();
        if (error) {
            if (error.details.includes('result contains 0 rows')) {
                return NextResponse.json({ recommender: { agent: null, role: null } });
            }
            throw error
        }
        return NextResponse.json({ recommender: { agent: data.agent, role: data.role } });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    const { agent, role } = await request.json();
    try {
        const { data, error } = await supabase
            .from('recommendations')
            .upsert({
                user_id: userResponse.data.user.id,
                agent: agent,
                role: role,
                updated_at: new Date().toISOString()
            });
        if (error) {
            throw error
        }
        return NextResponse.json({ data });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
