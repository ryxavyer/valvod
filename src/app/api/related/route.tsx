import { NextResponse, type NextRequest } from 'next/server';
import { getTags } from '@src/lib/valorant';
import { VOD, VODWithTags } from '../youtube/types';
import { createClient } from '@src/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  const tags = getTags(title);
  // only use agent and map tags
  const searchTerms = tags.filter(tag => tag.type === 'agent' || tag.type === 'map').map(tag => tag.name.toLowerCase());
  try {
    const { data, error, count } = await supabase.from('vods')
      .select('*', { count: 'exact' })
      .ilikeAnyOf('metadata->>title', searchTerms.map(term => `%${term}%`))
      .order('published_at', { ascending: false })
      .limit(10);
    if (error) {
      throw error;
    }
    if (data.length <= 0) {
      return NextResponse.json({ vods: [] });
    }
    const vods: VOD[] = data.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    let vodsWithTags: VODWithTags[] = [];
    for (const vod of vods) {
      vodsWithTags.push({ ...vod, tags: getTags(vod.metadata.title) });
    }
    return NextResponse.json({ vods: vodsWithTags });
  } catch (error) {
    return NextResponse.json({ vods: [], error: error }, { status: 500 });
  }
}
