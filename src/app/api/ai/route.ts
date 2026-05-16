import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompts: Record<string, string> = {
  expand: `You are a professional screenplay writer and film director's AI assistant. When given a brief scene description, expand it into a cinematic screenplay format including:
- Proper scene heading (INT/EXT, LOCATION, TIME)
- Atmospheric description
- Character actions
- Dialogue if appropriate
- Visual and emotional pacing notes
Write in professional screenplay format.`,

  dialogue: `You are an expert dialogue writer for cinema. When given dialogue or a conversation concept:
- Enhance the emotional depth and subtext
- Make conversations feel natural and cinematic
- Add parenthetical direction
- Include action beats between dialogue
- Create tension, emotion, or humor as appropriate
Write in professional screenplay dialogue format.`,

  director: `You are an experienced film director's creative consultant. When given a scene description, suggest:
- Camera angles and movements (with specific shot types)
- Lighting setup and mood
- Scene transitions
- Soundtrack/score mood suggestions
- Pacing and editing rhythm
- Emotional direction for actors
Format as clear, actionable director's notes.`,

  connector: `You are a story analyst. When given fragments of ideas, scenes, or concepts:
- Identify thematic connections between fragments
- Suggest potential genre or story type they could form
- Propose narrative structures that could unite them
- Offer creative combinations and unexpected connections
Be insightful and creative in finding hidden story potential.`,

  structure: `You are a story structure expert. When given a story concept:
- Break it into a clear three-act structure
- Identify key plot points and turning points
- Suggest character arcs
- Identify pacing issues and solutions
- Recommend ways to strengthen the climax and emotional resolution
Use established storytelling frameworks.`,
};

export async function POST(req: NextRequest) {
  try {
    const { mode, style, input } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key not configured. Add your key to .env.local' }, { status: 500 });
    }

    const systemPrompt = systemPrompts[mode] || systemPrompts.expand;
    const styleInstruction = style ? `\n\nApply a "${style}" cinematic style to your response. Do NOT reference any specific real-world directors by name.` : '';

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`${systemPrompt}${styleInstruction}\n\nUser input: ${input}`);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ output: text });
  } catch (error: any) {
    console.error('AI API error:', error);

    const msg: string = error?.message || '';

    // 429 — quota / rate limit (check both numeric status and message string)
    if (error?.status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota')) {
      const retryMatch = msg.match(/retry in ([\d.]+)s/i);
      const waitSecs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
      return NextResponse.json(
        { error: `AI quota exceeded (free-tier limit reached). Please wait ${waitSecs}s and try again, or enable billing at https://ai.google.dev` },
        { status: 429 },
      );
    }

    // 401 — bad API key
    if (msg.includes('API_KEY_INVALID') || error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key. Update GEMINI_API_KEY in your .env.local file.' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: msg || 'AI generation failed. Please try again.' },
      { status: error?.status || 500 },
    );
  }
}
