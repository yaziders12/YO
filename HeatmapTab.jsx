
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function HeatmapTab({ scores }) {
    return (
        <div>
             <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-300">Calculated Sector Sentiment</h3>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-slate-400 hover:text-[#2979FF] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="glassy-card border-slate-700 max-w-xs">
                            <p>Represents the calculated sentiment score from -2 (Bearish) to +2 (Bullish) based on your active scenario placements.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {scores.map(({ name, score }) => {
                    const green = Math.round(Math.max(0, score) / 2 * 200);
                    const red = Math.round(Math.max(0, -score) / 2 * 200);
                    const color = `rgb(${red}, ${green}, 80)`;
                    return (
                        <motion.div key={name} animate={{ backgroundColor: color }} transition={{ duration: 0.5 }} className="p-2 rounded-lg text-center">
                            <p className="text-sm font-semibold text-white">{name}</p>
                            <p className={`font-bold ${score > 0 ? 'text-green-300' : 'text-red-300'}`}>{score.toFixed(2)}</p>
                        </motion.div>
                    );
                })}
                <div className="col-span-2 mt-2 text-xs text-slate-400 flex items-center justify-between">
                    <span className="text-red-400">Bearish (-2)</span>
                    <div className="flex-grow h-1 mx-2 rounded-full bg-gradient-to-r from-red-500 via-slate-600 to-green-500"></div>
                    <span className="text-green-400">Bullish (+2)</span>
                </div>
            </div>
        </div>
    );
}
