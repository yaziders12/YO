import React from 'react';
import { motion } from 'framer-motion';

export default function NewsCard({ headline, summary, source }) {
    return (
        <motion.div 
            className="p-3 rounded-lg flex-shrink-0 w-56 h-full flex flex-col justify-between bg-slate-900/60 border border-slate-700/50"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
        >
            <div>
                <h4 className="text-sm font-semibold text-slate-200 line-clamp-2">{headline}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{summary}</p>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase mt-2">{source}</p>
        </motion.div>
    );
}