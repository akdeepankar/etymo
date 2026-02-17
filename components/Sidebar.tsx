'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarProps {
    data: any;
    onClose?: () => void;
}

export default function Sidebar({ data, onClose }: SidebarProps) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed left-0 top-0 h-full w-96 bg-black/60 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col"
        >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white font-serif">Word Details</h2>
                {onClose && (
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Current Word Info */}
                <div>
                    <div className="text-xs font-mono uppercase text-blue-400 mb-2 tracking-widest">Current</div>
                    <div className="text-4xl font-bold text-white font-serif mb-1">{data.current.word}</div>
                    <div className="text-sm text-white/60 mb-2">{data.current.language}</div>
                    <div className="text-base text-white/80 italic">"{data.current.meaning}"</div>
                </div>

                <div className="border-t border-white/10" />

                {/* Evolution Path */}
                <div>
                    <h3 className="text-xs font-mono uppercase text-white/50 mb-6 tracking-widest">Evolutionary Path</h3>
                    <div className="relative border-l-2 border-white/10 ml-3 pl-8 py-2 space-y-10">
                        {/* Root */}
                        <div className="relative group">
                            <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-black box-content group-hover:scale-110 transition-transform" />
                            <div className="text-xl font-bold text-white font-serif">{data.root.word}</div>
                            <div className="text-xs text-blue-400 font-medium mb-1">{data.root.language}</div>
                            <div className="text-sm text-white/60 italic">"{data.root.meaning}"</div>
                        </div>

                        {/* Middle Steps */}
                        {data.path.map((step: any, index: number) => (
                            <div key={index} className="relative group">
                                <div className="absolute -left-[39px] top-2 w-2 h-2 rounded-full bg-white/30 group-hover:bg-white transition-colors" />
                                <div className="text-lg font-medium text-white/90 font-serif">{step.word}</div>
                                <div className="text-xs text-white/40 mb-1">{step.language}</div>
                                <div className="text-sm text-white/50 italic">"{step.meaning}"</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
