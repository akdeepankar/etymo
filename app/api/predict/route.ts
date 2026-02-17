import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const { word, year, context, apiKey } = await req.json();

    if (!word || !year) {
        return NextResponse.json({ error: 'Word and year are required' }, { status: 400 });
    }

    if (apiKey) {
        try {
            const openai = new OpenAI({ apiKey: apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: `You are a linguistic futurist. Predict how the word "${word}" might evolve by the year ${year} given the context "${context || 'General Evolution'}". Return JSON with fields: year, word (evolved spelling), phonetic, context, definition, example, post (short social media style post).` },
                    { role: "user", content: `Predict the evolution of "${word}" in ${year}.` }
                ],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return NextResponse.json(JSON.parse(content));
            }
        } catch (error) {
            console.error("OpenAI API error:", error);
            // Fallback
        }
    }

    // Fallback/Mock Data
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Returning mock prediction data");

    return NextResponse.json({
        year: year,
        word: `${word}-X`,
        phonetic: `/ˈ${word} eks/`,
        context: context || "Technological Integration",
        definition: "A digitally enhanced version of the original concept.",
        example: `The ${word}-X is now standard in all sectors.`,
        post: `@future_user: Can't believe we used to use raw ${word}. #upgrade #2050`
    });
}
