'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface ActionPanelProps {
    onSearch: (term: string) => void;
}

export default function ActionPanel({ onSearch }: ActionPanelProps) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            onSearch(term);
        }
    };

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-10">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Enter a word (e.g. 'Robot', 'Tea', 'Galaxy')..."
                    className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-lg shadow-black/20"
                />
            </form>
        </div>
    );
}
