import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NewsCard({ headline, summary, source, link }) {
    return (
        <motion.div 
            className="p-3 rounded-lg flex-shrink-0 w-64 bg-slate-900/60 border border-slate-700/50"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 flex-1">{headline}</h4>
                {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-[#2979FF]">
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
            <p className="text-xs text-slate-400 line-clamp-3">{summary}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-2">{source}</p>
        </motion.div>
    );
}

export default function SectorBucket({ sector, color, news, isGlowing, summary }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="flex-shrink-0 w-80">
            <motion.div 
                className="rounded-xl overflow-hidden glassy-card"
                animate={{ boxShadow: isGlowing ? `0 0 20px ${color}40` : 'none' }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
                <div 
                    className="px-4 py-3 font-bold text-white text-sm flex items-center justify-between"
                    style={{ backgroundColor: color }}
                >
                    <span>{sector}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-white hover:bg-white/20 p-1 h-6 w-6"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </div>
                
                <div className="p-4">
                    {/* Summary bullets */}
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-300 mb-2">Key Highlights</h4>
                        <ul className="text-xs text-slate-400 space-y-1">
                            {summary.map((point, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-[#2979FF] mr-2">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Full stories */}
                    <motion.div 
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : '120px' }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3">
                            {news.map((item, index) => (
                                <NewsCard key={index} {...item} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}