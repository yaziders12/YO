
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ChevronUp, ChevronDown, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Custom SVG Circular Gauge Component
const SvgCircularGauge = ({ percentage, color, trailColor, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        stroke={trailColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-white font-bold text-xl"
        fill="#ffffff"
      >
        {`${(percentage * 10 / 100).toFixed(1)}%`}
      </text>
    </svg>
  );
};


const HEDGE_SUGGESTIONS = {
  high_semis: "Consider SOXS calls to hedge semiconductor exposure",
  high_banks: "Consider SPX puts to hedge financial sector risk",
  high_reits: "Consider SPX puts to hedge real estate exposure", 
  high_energy: "Consider NRGD puts to hedge energy sector risk",
  generic: "Consider adding 10% cash buffer to reduce portfolio risk"
};

function getVarColor(varPercent) {
  if (varPercent < 5) return { color: '#10b981', background: '#065f46' }; // green
  if (varPercent < 8) return { color: '#f59e0b', background: '#92400e' }; // amber
  return { color: '#ef4444', background: '#991b1b' }; // red
}

function generateHedgeSuggestions(etfBasket, varPercent) {
  if (varPercent < 5) return [];
  
  const suggestions = [];
  const highWeightThreshold = 20;
  
  // Check for concentrated positions
  etfBasket.forEach(({ etf, weight }) => {
    if (weight > highWeightThreshold) {
      if (etf.includes('SOX')) {
        suggestions.push({ text: HEDGE_SUGGESTIONS.high_semis, allocation: "5%" });
      } else if (etf.includes('KBE') || etf.includes('VNQ')) {
        suggestions.push({ text: HEDGE_SUGGESTIONS.high_banks, allocation: "8%" });
      } else if (etf.includes('XLE') || etf.includes('NRG')) {
        suggestions.push({ text: HEDGE_SUGGESTIONS.high_energy, allocation: "6%" });
      }
    }
  });
  
  if (suggestions.length === 0) {
    suggestions.push({ text: HEDGE_SUGGESTIONS.generic, allocation: "10%" });
  }
  
  return suggestions;
}

export default function VarPanel({ etfBasket, varPercent = 4.2 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const varColors = getVarColor(varPercent);
  const hedgeSuggestions = generateHedgeSuggestions(etfBasket, varPercent);
  const showHedgeBanner = varPercent >= 5;

  const handleCopyHedgeSuggestions = () => {
    const csv = "Hedge Suggestion,Allocation\n" + 
                hedgeSuggestions.map(s => `"${s.text}",${s.allocation}`).join('\n');
    navigator.clipboard.writeText(csv);
    toast.success("Hedge suggestions copied to clipboard!");
  };

  return (
    <motion.div 
      className="w-full bg-slate-900/80 backdrop-blur rounded-xl shadow-lg/20 border border-slate-700/50"
      layout
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-semibold text-white">VaR (1-Day)</h3>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* VaR Gauge */}
              <div className="flex items-center justify-center">
                <div className="w-[120px] h-[120px]">
                   <SvgCircularGauge
                    percentage={Math.min(varPercent, 10) * 10} // Scale to 0-100 for gauge
                    color={varColors.color}
                    trailColor={varColors.background}
                    size={120}
                  />
                </div>
              </div>
              <p className="text-center text-sm text-slate-300">
                Portfolio VaR: <span className="font-bold" style={{ color: varColors.color }}>{varPercent.toFixed(1)}%</span>
              </p>

              {/* Hedge Banner */}
              {showHedgeBanner && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${
                    varPercent >= 8 
                      ? 'bg-red-500/20 border-red-500/30' 
                      : 'bg-amber-500/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-white">Hedge Ideas:</span>
                  </div>
                  <div className="space-y-1 ml-6">
                    {hedgeSuggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-slate-300 flex justify-between">
                        <span>• {suggestion.text}</span>
                        <span className="text-cobalt-300 font-mono">{suggestion.allocation}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <Button 
                      onClick={handleCopyHedgeSuggestions}
                      variant="outline" 
                      size="sm"
                      className="glassy-card border-slate-600 hover:border-cobalt-400 text-xs"
                    >
                      <Clipboard className="w-3 h-3 mr-1" />
                      Copy CSV
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
