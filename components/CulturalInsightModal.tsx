'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, BookOpen, Globe2, Loader2 } from 'lucide-react';

interface CulturalInsightModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    data: {
        word: string;
        language: string;
        native_idiom: string;
        romanized?: string;
        literal_meaning?: string;
        meaning: string;
        origin_story: string;
    } | null;
}

export default function CulturalInsightModal({ isOpen, onClose, isLoading, data }: CulturalInsightModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-2 flex justify-between items-start">
                            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                                <Globe2 className="w-4 h-4" />
                                <span>Cultural Insight</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60 hover:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-2">
                            {isLoading ? (
                                <div className="h-40 flex flex-col items-center justify-center gap-3 text-white/50">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    <span className="text-sm">Unearthing ancient wisdom...</span>
                                </div>
                            ) : data ? (
                                <div className="space-y-6">
                                    {/* Introduction */}
                                    <div>
                                        <h2 className="text-2xl font-serif text-white mb-1">
                                            {data.word} <span className="text-white/40 text-lg">in {data.language}</span>
                                        </h2>
                                    </div>

                                    {/* The Idiom */}
                                    <div className="relative p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />

                                        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                                            "{data.native_idiom}"
                                        </h3>
                                        {data.romanized && (
                                            <p className="text-white/60 italic font-serif text-lg mb-2">
                                                {data.romanized}
                                            </p>
                                        )}
                                        {data.literal_meaning && (
                                            <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mt-4">
                                                Literal: {data.literal_meaning}
                                            </p>
                                        )}
                                    </div>

                                    {/* Meaning & Origin */}
                                    <div className="grid gap-4">
                                        <div className="flex gap-3">
                                            <BookOpen className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-yellow-500 font-bold text-sm uppercase mb-1">Meaning</h4>
                                                <p className="text-white/90 leading-relaxed text-sm">
                                                    {data.meaning}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-purple-400 font-bold text-xs border border-purple-400/50 rounded-full">?</div>
                                            <div>
                                                <h4 className="text-purple-400 font-bold text-sm uppercase mb-1">Origin</h4>
                                                <p className="text-white/80 leading-relaxed text-sm italic">
                                                    {data.origin_story}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-white/50">
                                    No cultural data found for this location.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
