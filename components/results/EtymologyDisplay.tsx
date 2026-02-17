'use client';

import { motion } from 'framer-motion';

interface EtymologyDisplayProps {
    data: any; // Type this properly later
}

// Dummy data structure expected:
// {
//   root: { word: "dhghem", language: "Proto-Indo-European", meaning: "earth" },
//   path: [
//     { word: "humanus", language: "Latin", meaning: "human" },
//     { word: "humain", language: "Old French", meaning: "human" }
//   ],
//   current: { word: "Human", language: "English", meaning: "A member of the species Homo sapiens" }
// }

export default function EtymologyDisplay({ data }: EtymologyDisplayProps) {
    if (!data) return null;

    return (
        <div className="fixed top-1/2 left-10 -translate-y-1/2 w-80 max-h-[60vh] overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white"
            >
                <h3 className="text-sm font-mono uppercase text-white/50 mb-4 tracking-widest">Historical Roots</h3>

                <div className="relative border-l-2 border-white/20 ml-3 pl-6 py-2 space-y-8">
                    {/* Root */}
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-black box-content" />
                        <div className="text-xl font-bold font-serif">{data.root.word}</div>
                        <div className="text-sm text-blue-300">{data.root.language}</div>
                        <div className="text-xs text-white/60 italic mt-1">"{data.root.meaning}"</div>
                    </div>

                    {/* Path */}
                    {data.path.map((step: any, index: number) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[29px] top-2 w-2 h-2 rounded-full bg-white/30" />
                            <div className="text-lg font-serif">{step.word}</div>
                            <div className="text-xs text-white/50">{step.language}</div>
                        </div>
                    ))}

                    {/* Current */}
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-black box-content" />
                        <div className="text-2xl font-bold font-serif">{data.current.word}</div>
                        <div className="text-sm text-white/80">{data.current.language}</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
