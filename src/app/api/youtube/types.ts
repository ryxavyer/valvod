import { Tags } from "@src/lib/valorant";

// db vods
export interface VOD {
    id: string;
    channel_id: string;
    published_at: string;
    metadata:  {
        title: string;
        description: string;
        thumbnail: string;
    }
}

// server parses tags for client during /api/youtube/latest request
export interface VODWithTags extends VOD {
    tags: Tags[];
}
