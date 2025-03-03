import { NextResponse, type NextRequest } from 'next/server';
import { getSearchResults } from '@src/lib/valorant';
import { VODWithTags } from '../youtube/types';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchString = url.searchParams.get('q');
  try {
    // fetch from youtube
    const res = await fetch(`${request.nextUrl.origin}/api/youtube/latest`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch VODs');
    }
    const vods: VODWithTags[] = data.vods;
    return NextResponse.json({ vods: getSearchResults(vods, searchString) });
  } catch (error) {
    return NextResponse.json({ vods: [], error: error }, { status: 500 });
  }
}
