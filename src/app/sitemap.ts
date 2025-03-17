import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://valvod.gg',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://valvod.gg/search',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://valvod.gg/terms',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: 'https://valvod.gg/privacy-policy',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: 'https://valvod.gg/auth/login',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://valvod.gg/auth/signup',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://valvod.gg/auth/forgot-password',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://valvod.gg/auth/reset-password',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        {
            url: 'https://valvod.gg/library',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}
