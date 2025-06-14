import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ScenarioCard({ scenario, isDragging }) {
  const { title, modelProb, rationale } = scenario;
  return (
    <motion.div
      layout
      className={`glassy-card p-3 rounded-xl cursor-grab ${isDragging ? 'opacity-60 ring-2 ring-[#2979FF]' : 'hover:ring-1 hover:ring-slate-700'}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-100 text-sm leading-tight w-5/6">{title}</h4>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
                <button className="text-slate-500 hover:text-[#2979FF]">
                    <Info className="w-4 h-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent className="glassy-card border-slate-700 max-w-xs text-slate-300">
              <p>{rationale || "No rationale provided."}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-2">
        <Badge variant="secondary" className="bg-slate-800/80 text-[#90b8ff] border border-slate-700">
          Model: {modelProb}%
        </Badge>
      </div>
    </motion.div>
  );
}