import { UserData } from './types';

export type AIRequestType = 'chat' | 'map' | 'future';

export interface AIRequestBody {
    type: AIRequestType;
    data: UserData;
    prompt?: string; // For chat
    apiKey: string;
}

export async function generateAIResponse(body: AIRequestBody) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'AI request failed');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
    }
}
