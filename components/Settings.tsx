'use client';

import { Settings as SettingsIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const [openaiKey, setOpenaiKey] = useState('');
    const [lingoKey, setLingoKey] = useState('');
    const [mapboxKey, setMapboxKey] = useState('');

    useEffect(() => {
        const storedOpenAI = localStorage.getItem('openai_api_key');
        const storedLingo = localStorage.getItem('lingo_dev_api_key');
        const storedMapbox = localStorage.getItem('mapbox_access_token');
        if (storedOpenAI) setOpenaiKey(storedOpenAI);
        if (storedLingo) setLingoKey(storedLingo);
        if (storedMapbox) setMapboxKey(storedMapbox);
    }, []);

    const saveKeys = () => {
        localStorage.setItem('openai_api_key', openaiKey);
        localStorage.setItem('lingo_dev_api_key', lingoKey);
        localStorage.setItem('mapbox_access_token', mapboxKey);
        setIsOpen(false);
        // Ideally, trigger a re-fetch or context update here
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 p-2 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all z-50"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Mapbox Access Token</label>
                                <input
                                    type="password"
                                    value={mapboxKey}
                                    onChange={(e) => setMapboxKey(e.target.value)}
                                    placeholder="pk.eyJ..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">OpenAI API Key</label>
                                <input
                                    type="password"
                                    value={openaiKey}
                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Lingo.dev API Key</label>
                                <input
                                    type="password"
                                    value={lingoKey}
                                    onChange={(e) => setLingoKey(e.target.value)}
                                    placeholder="lingo-..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <button
                                onClick={saveKeys}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors mt-4"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
