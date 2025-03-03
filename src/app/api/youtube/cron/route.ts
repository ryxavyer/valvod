import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import redis from '@src/lib/redis';
import { VOD } from '../types';

enum CoreAPIErrors {
  QUOTA_EXCEEDED = "quotaExceeded",
  FORBIDDEN = "forbidden",
}

interface SearchResponse {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        maxres: { url?: string },
        standard: { url?: string },
        high: { url: string },
      };
      publishedAt: string;
      tags: string[];
    };
  }[];
  nextPageToken: string;
}

interface SearchErrorResponse {
  error: {
    code: number;
    message: string;
    errors: [{ domain: string; reason: string; message: string }];
  }
}

const CHANNELS = {
  // channel id: number of videos to fetch (&publishedAfter likely limits this)
  "UCOR8JcMRg_cFKx0etV5zXBQ": 200, // Valorant DAILY
  "UCjZTend97TmoVDf31M-Tacg": 200, // Valorant Pro Vods
  "UCXZEHi1TfIp75O402VZG9xg": 200, // VALORANT VODS (looks like all pro games)
}

function getHighestQualityThumbnail(thumbnails: SearchResponse["items"][0]["snippet"]["thumbnails"]): string {
  if (thumbnails.maxres?.url) {
    return thumbnails.maxres.url;
  }
  if (thumbnails.standard?.url) {
    return thumbnails.standard.url;
  }
  return thumbnails.high.url;
}

const LASTRUN_KEY = "youtube:cron:lastrun";
const LASTRUN_EXP = 60 * 60 * 24; // 24 hours (2x the interval)

export async function GET(request: NextRequest) {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
    const lastRunTimestamp = await redis.get(LASTRUN_KEY);
    try {
        let channelErrors = [];
        const videoPromises: Promise<VOD[]>[] = Object.keys(CHANNELS).map(async (channelId) => {
            let endpoint = `https://www.googleapis.com/youtube/v3/search?` +
                            `key=${API_KEY}&channelId=${channelId}&part=snippet` +
                            `&order=date&type=video&maxResults=${CHANNELS[channelId]}`;
            if (lastRunTimestamp) {
                endpoint += `&publishedAfter=${lastRunTimestamp}`;
            }
            const res = await fetch(endpoint);
            if (!res.ok) {
                const data: SearchErrorResponse = await res.json();
                // core api errors
                if (data.error.code === 403) {
                    if (data.error.errors[0].reason === CoreAPIErrors.QUOTA_EXCEEDED) {
                        console.error("API key has exceeded quota");
                        throw new Error("API key has exceeded quota");
                    }
                    if (data.error.errors[0].reason === CoreAPIErrors.FORBIDDEN) {
                        console.error("API key is forbidden from accessing the YouTube Data API");
                        throw new Error("API key is forbidden from accessing the YouTube Data API");
                    }
                }
                // channel specific error? maybe the channel was deleted
                console.warn(`Failed to fetch videos for channel - ${channelId}`);
                channelErrors.push(`Failed to fetch videos for channel - ${channelId}`);
                return [];
            }
            const data: SearchResponse = await res.json();
            return data.items.map(item => ({
                id: item.id.videoId,
                channel_id: channelId,
                published_at: item.snippet.publishedAt,
                metadata: {
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: getHighestQualityThumbnail(item.snippet.thumbnails),
                }
            } as VOD));
        });
        if (channelErrors.length === Object.keys(CHANNELS).length) {
            console.error("Unable to fetch videos from any channel");
            throw new Error("Unable to fetch videos from any channel");
        }
        let vods = (await Promise.all(videoPromises)).flat().sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        // save to db
        const { error } = await supabase.from("vods").upsert(vods, { onConflict: "id", ignoreDuplicates: true });
        if (error) {
            throw error;
        }
        // update lastrun
        await redis.set(LASTRUN_KEY, new Date().toISOString(), { EX: LASTRUN_EXP });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
