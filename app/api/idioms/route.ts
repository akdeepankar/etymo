import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const { word, language, apiKey } = await req.json();

    if (!word || !language) {
        return NextResponse.json({ error: 'Word and Language are required' }, { status: 400 });
    }

    if (apiKey) {
        try {
            const openai = new OpenAI({ apiKey: apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cultural linguist.
                        
                        Task: Provide a famous **local** idiom, proverb, or saying in the specified language that relates to the word provided.
                        
                        Input:
                        Word: "${word}"
                        Language: "${language}"

                        Output Format: JSON object:
                        {
                            "native_idiom": string (The idiom in its original script/language),
                            "romanized": string (If non-Latin script, provide romanized text, else null),
                            "literal_meaning": string (Literal translation into English),
                            "meaning": string (The figurative meaning or cultural context in English),
                            "origin_story": string (Brief sentence about its origin or usage)
                        }

                        Constraint: If no direct idiom exists for "${word}", find a very closely related concept or a general proverb from that culture involving a similar theme. prioritizing cultural richness.
                        `
                    },
                    { role: "user", content: `Find a cultural idiom for "${word}" in ${language}.` }
                ],
                model: "gpt-4o",
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return NextResponse.json(JSON.parse(content));
            }
        } catch (error) {
            console.error("OpenAI API error:", error);
        }
    }

    // Fallback Mock
    return NextResponse.json({
        native_idiom: `Mock Idiom for ${word}`,
        romanized: "Mokkus Idiomus",
        literal_meaning: "Start of a mock journey",
        meaning: "Every journey begins with a single step, even a mock one.",
        origin_story: "Ancient developer proverb."
    });
}
