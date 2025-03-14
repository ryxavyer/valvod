import { NextResponse, type NextRequest } from 'next/server';
import { getRelatedResults } from '@src/lib/valorant';
import { VODWithTags } from '../youtube/types';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  try {
    // fetch from latest
    const res = await fetch(`${request.nextUrl.origin}/api/youtube/latest`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch VODs');
    }
    // filter out the current VOD
    data.vods = data.vods.filter((vod: VODWithTags) => vod.metadata.title !== title);
    const vods: VODWithTags[] = data.vods;
    return NextResponse.json({ vods: getRelatedResults(vods, title) });
  } catch (error) {
    return NextResponse.json({ vods: [], error: error }, { status: 500 });
  }
}
