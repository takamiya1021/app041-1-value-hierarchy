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
                systemPrompt = `
Analyze the following user data (values and insights) and generate a "Value Map".
Identify connections between different value groups.
Return ONLY a valid JSON object with the following structure:
{
  "nodes": [
    { "id": "group_id", "label": "Group Name", "color": "color_code", "size": number (based on importance/count) }
  ],
  "links": [
    { "source": "group_id_1", "target": "group_id_2", "reason": "Short explanation of connection" }
  ]
}
Do not include markdown formatting or code blocks. Just the raw JSON.
Current User Data:
${userDataString}
`;
                userPrompt = 'Generate value map JSON.';
                break;

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
