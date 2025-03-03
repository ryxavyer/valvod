'use server';

const API_KEY = process.env.GOOGLE_API_KEY;

export const loadGoogleAPIClient = () => {
    gapi.client.setApiKey(API_KEY);
}