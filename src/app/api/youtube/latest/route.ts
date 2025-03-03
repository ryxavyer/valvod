import { NextResponse, type NextRequest } from 'next/server';
import redis from '@src/lib/redis';
import { getRedisVods } from '../cache';
import { VOD, VODWithTags } from '../types';
import { createClient } from '@src/lib/supabase';
import { getTags } from '@src/lib/valorant';

const VOD_LATEST_CACHE_KEY = 'youtube:latest';
const VOD_LATEST_CACHE_EXP = 12 * 60 * 60; // 12 hours

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  try {
    const cachedVods = await getRedisVods(VOD_LATEST_CACHE_KEY);
    if (cachedVods.length > 0) {
      return NextResponse.json({ vods: cachedVods });
    }
    // return "recent" vods - videos published in the 3 months
    const { data, error } = await supabase.from('vods').select().gte('published_at', new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString());
    if (error) {
      throw error;
    }
    if (data.length <= 0) {
      throw new Error("No VODs found");
    }
    const vods: VOD[] = data.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    let vodsWithTags: VODWithTags[] = [];
    for (const vod of vods) {
      vodsWithTags.push({ ...vod, tags: getTags(vod.metadata.title) });
    }
    await redis.set(VOD_LATEST_CACHE_KEY, JSON.stringify(vodsWithTags), { EX: VOD_LATEST_CACHE_EXP });
    return NextResponse.json({ vods: vodsWithTags });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
