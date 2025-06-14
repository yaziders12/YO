import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, Treemap } from 'recharts';
import { Upload } from 'lucide-react';

const COLORS = ['#118AB2', '#EF476F', '#FFD166', '#06D6A0', '#9D4EDD', '#FF6B35', '#8D99AE'];

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, name, value }) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: '#1E293B',
          strokeWidth: 2,
        }}
      />
      <AnimatePresence>
      {width * height > 2000 && (
          <motion.text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {name} ({(value).toFixed(1)}%)
          </motion.text>
      )}
      </AnimatePresence>
    </g>
  );
};


export default function PortfolioInput() {
    const [portfolioText, setPortfolioText] = useState('AAPL, 25\nGOOG, 20\nMSFT, 15\nNVDA, 10\nTSLA, 10\nAMZN, 10\nXLE, 5\nKBE, 5');
    const [portfolioData, setPortfolioData] = useState(null);

    const handleAnalyze = () => {
        const lines = portfolioText.split('\n').filter(line => line.trim() !== '');
        const data = lines.map(line => {
            const [ticker, weight] = line.split(',');
            return { name: ticker.trim().toUpperCase(), value: parseFloat(weight.trim()) };
        }).filter(item => item.name && !isNaN(item.value));
        setPortfolioData(data);
    };
    
    return (
        <div className="glassy-card p-4 rounded-xl mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Portfolio Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-3">
                    <p className="text-sm text-slate-400">Paste your portfolio (ticker, weight %), one per line.</p>
                    <Textarea
                        value={portfolioText}
                        onChange={(e) => setPortfolioText(e.target.value)}
                        placeholder="e.g., AAPL, 25..."
                        className="h-48 bg-slate-900 border-slate-700 font-mono text-sm"
                    />
                    <Button onClick={handleAnalyze} className="w-full bg-[#2979FF] hover:bg-[#4C8DFF]">
                        <Upload className="w-4 h-4 mr-2" />
                        Analyze & Visualize
                    </Button>
                </div>
                <div className="md:col-span-2 min-h-[250px] bg-slate-900/50 rounded-lg p-2">
                    {portfolioData && (
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={portfolioData}
                                dataKey="value"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#8884d8"
                                content={<CustomizedContent colors={COLORS} />}
                            />
                        </ResponsiveContainer>
                    )}
                    {!portfolioData && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                           <p>Visualization will appear here after analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}