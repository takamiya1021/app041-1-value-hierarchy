import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserData } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data, prompt, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json(
                { message: 'API key is required' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let systemPrompt = '';
        let userPrompt = '';

        const userDataString = JSON.stringify(data, null, 2);

        switch (type) {
            case 'chat':
                systemPrompt = `
You are a Socratic Reflector, a wise and empathetic partner for self-analysis.
Your goal is to help the user deepen their understanding of their own values through thoughtful questions.
Do not lecture or give advice. Instead, ask open-ended questions that encourage reflection.
Be concise, warm, and supportive.
Current User Data (Values and Insights):
${userDataString}
`;
                userPrompt = prompt || 'こんにちは。私の価値観について一緒に考えてください。';
                break;

            case 'map':
                // Use gemini-3-pro-image-preview for visual value map
                const mapModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
                const mapPrompt = `Based on the following user's values and insights, create a "Value Map" visualization.
Draw a mind-map style diagram with circles representing value groups.
IMPORTANT: Inside each circle, write the Group Name in JAPANESE (日本語).
Connect related groups with lines.
Use colors specified in the data if possible, or use a harmonious color palette.
Make it look professional, clean, and artistic.

Current User Data:
${userDataString}

Create a high-quality image of this value map with legible Japanese text.`;

                const mapResult = await mapModel.generateContent(mapPrompt);
                const mapResponse = mapResult.response;

                const mapPart = mapResponse.candidates?.[0]?.content?.parts?.[0];
                if (mapPart && 'inlineData' in mapPart && mapPart.inlineData?.data) {
                    const base64Image = mapPart.inlineData.data;
                    return NextResponse.json({ result: base64Image, isImage: true });
                } else {
                    throw new Error('No image generated');
                }

            case 'future':
                systemPrompt = `
You are a "Future Self Projection" engine.
Based on the user's current values and insights, write a short, inspiring story (about 300-400 characters in Japanese) describing their life 10 years from now.
Focus on how living by these values has positively impacted their life, career, and relationships.
Be specific but imaginative.
Current User Data:
${userDataString}
`;
                userPrompt = 'Generate future self story.';
                break;

            case 'future-image':
                // Use gemini-3-pro-image-preview for visual future representation
                const imageModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
                const imagePrompt = `Based on the following user's values and insights, create a beautiful visual representation of their life 10 years from now.
Show a scene that embodies living by these values - include elements that represent career success, relationships, personal growth, and fulfillment.
Make it inspiring, hopeful, and specific to their values.

Current User Data:
${userDataString}

Create a detailed, vibrant illustration showing their future life.`;

                const imageResult = await imageModel.generateContent(imagePrompt);
                const imageResponse = imageResult.response;

                // Get the generated image data
                const imagePart = imageResponse.candidates?.[0]?.content?.parts?.[0];
                if (imagePart && 'inlineData' in imagePart && imagePart.inlineData?.data) {
                    const base64Image = imagePart.inlineData.data;
                    return NextResponse.json({ result: base64Image, isImage: true });
                } else {
                    throw new Error('No image generated');
                }

            default:
                return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });
        }

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = result.response;
        let text = response.text();

        // Clean up JSON for map type if needed
        if (type === 'map') {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
