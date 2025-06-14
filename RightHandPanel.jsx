
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Minimize2, Search, BarChart2, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Placeholder Tab Components
const HeatmapTab = () => <div className="p-4 text-center">Heatmap will be here</div>;
const EtfBasketTab = () => <div className="p-4 text-center">ETF Basket will be here</div>;
const PerformanceSearchTab = () => <div className="p-4 text-center">Performance Search will be here</div>;
const CopilotChat = ({ onToggle, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div 
                initial={{ opacity: 0, y: 50, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 50, height: 0 }}
                className="absolute bottom-0 left-0 right-0 glassy-card rounded-t-xl overflow-hidden"
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white">Copilot Chat</h4>
                        <Button variant="ghost" size="icon" onClick={onToggle}><Minimize2 className="w-4 h-4" /></Button>
                    </div>
                    <div className="h-48 bg-slate-900/50 rounded p-2 text-sm">
                        <p className="text-slate-400">Ask about a scenario...</p>
                    </div>
                    <input className="w-full mt-2 p-2 rounded bg-slate-900 border border-slate-700" placeholder="Type your question..." />
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function RightHandPanel({ sectorScores, etfBasket, onCopyCsv, onSearch, searchResult, isLoadingSearch }) {
    const [isChatOpen, setChatOpen] = useState(false);

    // Actual tabs will be implemented in the main Dashboard page to pass props
    return (
        <div className="w-full h-full glassy-card rounded-xl p-4 flex flex-col relative">
            <Tabs defaultValue="heat" className="flex flex-col flex-grow">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700">
                    <TabsTrigger value="heat"><BarChart2 className="w-4 h-4 mr-2"/>Heat-Map</TabsTrigger>
                    <TabsTrigger value="basket"><Table className="w-4 h-4 mr-2"/>ETF Basket</TabsTrigger>
                    <TabsTrigger value="search"><Search className="w-4 h-4 mr-2"/>Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="heat" className="flex-grow mt-4">
                    {/* Placeholder content. Actual implementation will be passed as children or via props. */}
                    <HeatmapTab />
                </TabsContent>
                <TabsContent value="basket" className="flex-grow mt-4">
                    <EtfBasketTab />
                </TabsContent>
                <TabsContent value="search" className="flex-grow mt-4">
                    <PerformanceSearchTab />
                </TabsContent>
            </Tabs>
            
            {!isChatOpen && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Button 
                        onClick={() => setChatOpen(true)}
                        className="absolute bottom-4 right-4 bg-gradient-to-tr from-[#2979FF] to-[#4C8DFF] text-white rounded-full shadow-lg"
                    >
                        <MessageSquare className="w-5 h-5 mr-2" /> Copilot
                    </Button>
                </motion.div>
            )}

            <CopilotChat isVisible={isChatOpen} onToggle={() => setChatOpen(false)} />
        </div>
    );
};
