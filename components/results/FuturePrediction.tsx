'use client';

import { motion } from 'framer-motion';

interface FuturePredictionProps {
    data: any; // Type this properly later
}

// Dummy data structure expected:
// {
//   year: 2050,
//   word: "Hyu-man",
//   phonetic: "/çuː.mən/",
//   context: "Social Media Acceleration",
//   definition: "A verified biological entity, distinct from AI agents.",
//   example: "Are you a hyu-man or a bot?",
//   post: "@neo_sarah: checking my #hyuman status at the checkpoint 🧬"
// }

export default function FuturePrediction({ data }: FuturePredictionProps) {
    if (!data) return null;

    return (
        <div className="fixed top-1/2 right-10 -translate-y-1/2 w-80 text-right">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white text-left"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-mono uppercase text-teal-400 tracking-widest">Future Projection</h3>
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded font-mono">{data.year}</span>
                </div>

                <div className="mb-6">
                    <div className="text-4xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-400">
                        {data.word}
                    </div>
                    <div className="text-sm font-mono text-white/50 mt-1">{data.phonetic}</div>
                </div>

                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-white/40 text-xs uppercase mb-1">Evolved Definition</div>
                        <div className="text-white/90 leading-relaxed">
                            {data.definition}
                        </div>
                    </div>

                    <div>
                        <div className="text-white/40 text-xs uppercase mb-1">Context: {data.context}</div>
                        <div className="p-3 bg-white/5 rounded-lg italic text-white/70 border-l-2 border-teal-500/50">
                            "{data.example}"
                        </div>
                    </div>

                    <div>
                        <div className="text-white/40 text-xs uppercase mb-1">Social Feed</div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-200 font-mono text-xs border border-blue-500/20">
                            {data.post}
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
