import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip as ChartTooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PerformanceSearch({ onSearch, result, isLoading }) {
    const [ticker, setTicker] = useState('NDX');
    const handleSubmit = (e) => { e.preventDefault(); onSearch(ticker.toUpperCase()); };

    return (
         <div className="w-full glassy-card rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-4">Performance Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                        <Input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="e.g., NDX, SPY" className="bg-slate-900 border-slate-700"/>
                        <Button type="submit" disabled={isLoading} className="bg-[#2979FF] hover:bg-[#4C8DFF]">
                            <Search className="w-4 h-4"/>
                        </Button>
                    </form>
                    {result && (
                         <div className="space-y-4">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-slate-400">Last Price</p>
                                <p className="font-bold text-3xl text-white">${result.price}</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-slate-400">% from 52W High</p>
                                <p className="font-bold text-3xl text-orange-400">-{result.fromHigh}%</p>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="md:col-span-2 h-64">
                    {result && (
                        <ResponsiveContainer>
                            <LineChart data={result.chartData}>
                                <ChartTooltip contentStyle={{backgroundColor: '#0F1116', border: '1px solid #334155'}} labelStyle={{color: '#cbd5e1'}} itemStyle={{color: '#2979FF'}}/>
                                <Line type="monotone" dataKey="price" stroke="#2979FF" strokeWidth={2} dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}