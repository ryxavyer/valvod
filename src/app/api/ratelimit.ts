import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@src/lib/redis';

const API_CALLS_PER_MINUTE = 60;
const API_LIMIT_BASE_KEY = "apilimit";


function generateFingerprint(req: NextApiRequest) {
    // Try using the forwarded IP first, fallback to the socket's remote address
    const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return `${ip}-${userAgent}`;
}


export async function isRateLimited(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<boolean> {
    const fingerprint = generateFingerprint(req);
    const rateLimitKey = `${API_LIMIT_BASE_KEY}:${fingerprint}`;
    const currentCalls = await redis.incr(rateLimitKey);
    if (currentCalls === 1) {
        // Set expiration to 60 seconds on the first increment
        await redis.expire(rateLimitKey, 60);
    }
    if (currentCalls > API_CALLS_PER_MINUTE) {
        return true;
    }
    return false;
}
