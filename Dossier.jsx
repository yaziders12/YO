
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Printer, Calendar, TrendingUp, Users, GitCompare } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const MOCK_DOSSIER_DATA = {
    'AAPL': {
        name: "Apple Inc.",
        headlines: [
            { source: 'Bloomberg', text: 'Apple in talks with OpenAI to power iOS 18 AI features.' },
            { source: 'WSJ', text: 'Vision Pro demand reportedly cooling after initial launch hype.' },
            { source: 'The Verge', text: 'New M4 chips debut with significant Neural Engine enhancements.' },
        ],
        earnings: [
            { year: 'FY21', eps: 5.61 }, { year: 'FY22', eps: 6.11 }, { year: 'FY23', eps: 6.42 }, { year: 'FY24E', eps: 6.58 },
        ],
        optionSkew: [
            { delta: '-50 (Put)', iv: 32.1 }, { delta: '-25 (Put)', iv: 28.5 }, { delta: 'ATM', iv: 25.0 }, { delta: '+25 (Call)', iv: 24.1 }, { delta: '+50 (Call)', iv: 23.5 },
        ],
        insiderTrades: [
            { date: '2024-03-15', insider: 'Tim Cook', action: 'Sell', shares: 50000, value: '$8.5M' },
            { date: '2024-02-01', insider: 'Luca Maestri', action: 'Sell', shares: 10000, value: '$1.8M' },
        ],
        peerMultiples: [
            { ticker: 'AAPL', pe: 28.5, ps: 7.2 },
            { ticker: 'MSFT', pe: 35.1, ps: 13.5 },
            { ticker: 'GOOGL', pe: 25.8, ps: 6.1 },
        ],
    }
};

const DossierCard = ({ icon, title, children }) => (
    <div className="glassy-card rounded-xl p-4">
        <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
            {React.createElement(icon, { className: "w-5 h-5 text-blue-400" })}
            {title}
        </h3>
        {children}
    </div>
);

export default function DossierPage() {
    const [ticker, setTicker] = useState('AAPL');
    const [dossierData, setDossierData] = useState(MOCK_DOSSIER_DATA['AAPL']);
    
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTicker = ticker.toUpperCase();
        if (MOCK_DOSSIER_DATA[searchTicker]) {
            setDossierData(MOCK_DOSSIER_DATA[searchTicker]);
            toast.success(`Loaded dossier for ${searchTicker}`);
        } else {
            toast.error(`No dossier data found for ticker: ${searchTicker}`);
        }
    };
    
    return (
        <div className="space-y-6">
            <Toaster richColors position="bottom-right" theme="dark"/>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-white">Deep-Dive Dossier</h1>
                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <Input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Search ticker..." className="w-full sm:w-48" />
                    <Button type="submit"><Search className="w-4 h-4" /></Button>
                </form>
            </div>
            
            {dossierData ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Dossier: {dossierData.name} ({ticker.toUpperCase()})</h2>
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DossierCard icon={Calendar} title="Latest Headlines">
                            <ul className="space-y-2 text-sm">
                                {dossierData.headlines.map((item, i) => (
                                    <li key={i}><span className="font-semibold text-slate-400">{item.source}:</span> {item.text}</li>
                                ))}
                            </ul>
                        </DossierCard>

                        <DossierCard icon={TrendingUp} title="Earnings Trend (EPS)">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={dossierData.earnings}>
                                    <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                                    <YAxis tick={{ fill: '#94a3b8' }}/>
                                    <Tooltip cursor={{fill: 'rgba(100, 116, 139, 0.2)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }}/>
                                    <Bar dataKey="eps" fill="#2979FF" />
                                </BarChart>
                            </ResponsiveContainer>
                        </DossierCard>

                        <DossierCard icon={GitCompare} title="25Δ Option Skew (IV)">
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dossierData.optionSkew}>
                                    <XAxis dataKey="delta" tick={{ fill: '#94a3b8' }}/>
                                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#94a3b8' }}/>
                                    <Tooltip cursor={{fill: 'rgba(100, 116, 139, 0.2)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }}/>
                                    <Line type="monotone" dataKey="iv" stroke="#EF476F" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </DossierCard>
                        
                        <DossierCard icon={Users} title="Insider Trades">
                            <Table>
                                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Insider</TableHead><TableHead>Action</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {dossierData.insiderTrades.map((trade, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{trade.date}</TableCell>
                                            <TableCell>{trade.insider}</TableCell>
                                            <TableCell className={trade.action === 'Sell' ? 'text-red-400' : 'text-green-400'}>{trade.action}</TableCell>
                                            <TableCell>{trade.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DossierCard>

                        <DossierCard icon={Users} title="Peer Multiples">
                             <Table>
                                <TableHeader><TableRow><TableHead>Ticker</TableHead><TableHead>P/E</TableHead><TableHead>P/S</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {dossierData.peerMultiples.map((peer, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-bold">{peer.ticker}</TableCell>
                                            <TableCell>{peer.pe}</TableCell>
                                            <TableCell>{peer.ps}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DossierCard>
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="glassy-card rounded-xl px-4">
                            <AccordionTrigger>View Raw JSON Data</AccordionTrigger>
                            <AccordionContent>
                                <pre className="text-xs bg-slate-900 p-4 rounded-lg overflow-x-auto">
                                    {JSON.stringify(dossierData, null, 2)}
                                </pre>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500">
                    <p>Search for a ticker (e.g., AAPL) to load its dossier.</p>
                </div>
            )}
        </div>
    );
}
