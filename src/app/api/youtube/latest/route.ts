import { NextResponse, type NextRequest } from 'next/server';
import redis from '@src/lib/redis';
import { getRedisVods } from '../cache';
import { VOD, VODWithTags } from '../types';
import { createClient } from '@src/lib/supabase';
import { getTags } from '@src/lib/valorant';

const VOD_LATEST_CACHE_KEY = 'youtube:latest';
const VOD_LATEST_CACHE_EXP = 12 * 60 * 60; // 12 hours
const VOD_RETURN_LIMIT = 50;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1', 10);
  const offset = (page - 1) * VOD_RETURN_LIMIT;
  const redis_page_key = `${VOD_LATEST_CACHE_KEY}:${page}`;
  try {
    const cachedVods = await getRedisVods(redis_page_key);
    if (cachedVods.length > 0) {
      return NextResponse.json({ vods: cachedVods, nextPageNum: page + 1, isLastPage: cachedVods.length < VOD_RETURN_LIMIT });
    }
    const { data, error } = await supabase.from('vods')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + VOD_RETURN_LIMIT - 1);
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
    await redis.set(redis_page_key, JSON.stringify(vodsWithTags), { EX: VOD_LATEST_CACHE_EXP });
    return NextResponse.json({ vods: vodsWithTags, nextPageNum: page + 1, isLastPage: data.length < VOD_RETURN_LIMIT });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
