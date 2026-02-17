'use client';

import { Search, Loader2, Settings } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionPanelProps {
    onSearch: (term: string) => void;
    onOpenSettings: () => void;
    isCompact?: boolean;
    isLoading?: boolean;
}

export default function ActionPanel({ onSearch, onOpenSettings, isCompact = false, isLoading = false }: ActionPanelProps) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            onSearch(term);
        }
    };

    return (
        <motion.div
            layout
            className={`fixed z-50 w-full flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isCompact ? 'top-0 pt-4 px-6 bg-black/60 backdrop-blur-xl border-b border-white/10 pb-4 flex-row justify-between' : 'top-1/2 -translate-y-[60%] left-0 px-4'
                }`}
        >
            {/* Branding */}
            <motion.div layout className={`flex items-center ${isCompact ? 'mr-6' : 'mb-10 flex-col'}`}>
                <motion.h1
                    layout
                    className={`font-serif font-bold text-white tracking-tighter ${isCompact ? 'text-2xl' : 'text-8xl drop-shadow-2xl mb-4'
                        }`}
                    initial={false}
                    animate={{ scale: isCompact ? 1 : 1.1 }}
                >
                    EvoLingo
                </motion.h1>
                {!isCompact && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.8, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-xl font-light tracking-wide"
                    >
                        Explore the origins of language
                    </motion.p>
                )}
            </motion.div>

            {/* Search Bar Container */}
            <motion.form
                layout
                onSubmit={handleSubmit}
                className={`relative group ${isCompact ? 'w-full max-w-sm' : 'w-full max-w-xl'}`}
            >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isCompact ? 'text-white/50' : 'text-white/50 group-focus-within:text-blue-400'}`} />
                </div>

                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={isCompact ? "Search..." : "Enter a word (e.g. 'Robot', 'Tea', 'Galaxy')..."}
                    className={`w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-lg shadow-black/20 ${isCompact ? 'rounded-full py-2 pl-10 pr-10 text-sm' : 'rounded-xl py-4 pl-12 pr-12 text-lg backdrop-blur-xl bg-black/40'
                        }`}
                />

                {/* Loading / Submit Button */}
                <div className="absolute inset-y-0 right-3 flex items-center">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : (
                        <button
                            type="submit"
                            className={`p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all ${!term && 'opacity-0 pointer-events-none'}`}
                        >
                            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-[10px] font-mono">↵</div>
                        </button>
                    )}
                </div>
            </motion.form>

            <div className={`flex items-center ${isCompact ? 'ml-6' : 'absolute top-0 right-0 p-6'}`}>
                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
