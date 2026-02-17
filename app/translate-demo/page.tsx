'use client';

import { useState } from 'react';
import { translateText } from '@/app/actions/translate';

export default function TranslateDemo() {
    const [input, setInput] = useState('Hello world!');
    const [targetLang, setTargetLang] = useState('es');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        setLoading(true);
        try {
            const result = await translateText(input, targetLang);
            setOutput(result);
        } catch (error) {
            console.error(error);
            setOutput('Error translating text');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Lingo.dev Translation Demo</h1>

                <div className="space-y-2">
                    <label className="text-sm font-mono text-white/50">Input Text</label>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-2 rounded text-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-mono text-white/50">Target Language Code</label>
                    <input
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-2 rounded text-white"
                        placeholder="es, fr, de, etc."
                    />
                </div>

                <button
                    onClick={handleTranslate}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? 'Translating...' : 'Translate'}
                </button>

                {output && (
                    <div className="mt-8 p-4 bg-white/10 rounded border border-white/20">
                        <label className="text-xs font-mono text-white/40 block mb-2">Translation Result</label>
                        <p className="text-lg">{output}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
