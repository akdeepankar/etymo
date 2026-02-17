import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const { word, apiKey } = await req.json();

    if (!word) {
        console.error("Word is required");
        return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    if (apiKey) {
        try {
            const openai = new OpenAI({ apiKey: apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an expert etymologist. Provide the etymology of the word in JSON format with fields: root (object with word, language, meaning, year: number, location: { lat: number, lng: number }), path (array of objects with word, language, meaning, year: number, location: { lat: number, lng: number }), and current (object with word, language, meaning, year: number, location: { lat: number, lng: number }). approximate the location based on the language origin region. approximate the year (negative for BC)." },
                    { role: "user", content: `Trace the etymology of "${word}".` }
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
            // Fallback to mock if API fails
        }
    }

    // Fallback/Mock Data
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Returning mock etymology data");

    return NextResponse.json({
        root: { word: "dhghem", language: "Proto-Indo-European", meaning: "earth", year: -3000, location: { lat: 48.0, lng: 35.0 } }, // Pontic-Caspian steppe
        path: [
            { word: "humanus", language: "Latin", meaning: "human", year: 100, location: { lat: 41.9, lng: 12.5 } }, // Rome
            { word: "humain", language: "Old French", meaning: "human", year: 1200, location: { lat: 48.8, lng: 2.3 } } // Paris
        ],
        current: { word: word, language: "English", meaning: "A member of the species Homo sapiens", year: 2024, location: { lat: 51.5, lng: -0.1 } } // London
    });
}
