
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip as ChartTooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react'; // Import Loader2 for loading indicator

export default function PerformanceSearchTab({ onSearch, result, isLoading }) {
    const [ticker, setTicker] = useState('NDX');
    const handleSubmit = (e) => { e.preventDefault(); onSearch(ticker.toUpperCase()); };

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={ticker}
                    onChange={e => setTicker(e.target.value)}
                    placeholder="e.g., NDX"
                    className="bg-slate-900 border-slate-700"
                    disabled={isLoading} // Disable input during loading
                />
                <Button type="submit" disabled={isLoading} className="bg-[#2979FF] hover:bg-[#4C8DFF]">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" /> // Show spinner when loading
                    ) : (
                        <Search className="w-4 h-4"/> // Show search icon when not loading
                    )}
                </Button>
            </form>

            {isLoading && (
                <div className="text-center text-sm text-slate-400">
                    Searching for {ticker.toUpperCase()}...
                </div>
            )}

            {!result && !isLoading && (
                <div className="text-center text-sm text-slate-400">
                    Enter a ticker (e.g., NDX, SPY) to search for its performance data.
                </div>
            )}

            {result && (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div><p className="text-xs text-slate-400">Last Price</p><p className="font-bold text-lg">${result.price}</p></div>
                        <div><p className="text-xs text-slate-400">% from 52W High</p><p className="font-bold text-lg text-orange-400">-{result.fromHigh}%</p></div>
                    </div>
                    <div className="w-full h-32">
                        <ResponsiveContainer>
                            <LineChart data={result.chartData}>
                                <ChartTooltip
                                    contentStyle={{backgroundColor: '#0F1116', border: '1px solid #334155'}}
                                    labelStyle={{ color: '#E2E8F0' }} // Make tooltip label visible
                                    itemStyle={{ color: '#CBD5E1' }} // Make tooltip item value visible
                                />
                                <Line type="monotone" dataKey="price" stroke="#2979FF" strokeWidth={2} dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
