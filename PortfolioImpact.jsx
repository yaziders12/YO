
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';

const SectorHeatmap = ({ data }) => {
    const getColor = (value) => {
        if (value > 1) return '#22c55e'; // green
        if (value > 0) return '#a3e635'; // lime
        if (value === 0) return '#64748b'; // slate
        if (value < -1) return '#ef4444'; // red
        return '#f97316'; // orange
    };

    return (
        <div className="w-full h-52">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[-2, 2]} hide />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', color: '#e2e8f0' }} cursor={{fill: 'rgba(100, 116, 139, 0.2)'}}/>
                    <Bar dataKey="score" barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const EtfBasket = ({ data, onCopy }) => (
    <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto max-h-56">
            <Table>
                <TableHeader>
                    <TableRow className="sticky top-0 glassy-card">
                        <TableHead>ETF</TableHead>
                        <TableHead>Allocation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <motion.tr 
                            key={item.etf} 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-slate-300"
                        >
                            <TableCell className="font-medium">{item.etf}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="w-12 text-right">{item.weight.toFixed(1)}%</span>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <motion.div
                                            className="bg-cobalt-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.weight}%` }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div className="flex-shrink-0 pt-4 text-right">
            <Button onClick={onCopy} variant="outline" className="glassy-card border-slate-700 hover:border-cobalt-400 hover:text-cobalt-300">
                <Clipboard className="mr-2 h-4 w-4" /> Copy Basket
            </Button>
        </div>
    </div>
);

export default function PortfolioImpact({ sectorScores, etfBasket, onCopyCsv }) {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = 'Build Scenario Lens v0.9';
  }, []);

  return (
    <div className="w-full glassy-card rounded-xl p-4">
      <h2 className="text-lg font-bold text-white mb-2">Impact & Allocation</h2>
      <Tabs defaultValue="heat">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700">
          <TabsTrigger value="heat">Sector Heat</TabsTrigger>
          <TabsTrigger value="basket">ETF Basket</TabsTrigger>
        </TabsList>
        <TabsContent value="heat" className="mt-4">
          <SectorHeatmap data={sectorScores} />
        </TabsContent>
        <TabsContent value="basket" className="mt-4">
          <EtfBasket data={etfBasket} onCopy={onCopyCsv} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
