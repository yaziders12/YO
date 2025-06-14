import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Minimize2 } from 'lucide-react';

export default function CopilotChat({ onToggle, isVisible, askCopilot, chatHistory, isTyping }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: '60%' }}
                    exit={{ opacity: 0, y: 50, height: 0 }}
                    className="absolute bottom-0 left-0 right-0 glassy-card rounded-t-xl overflow-hidden flex flex-col"
                >
                    <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                        <h4 className="font-bold text-white flex items-center gap-2"><MessageSquare className="text-[#2979FF]"/>Copilot Chat</h4>
                        <Button variant="ghost" size="icon" onClick={onToggle}><Minimize2 className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex-grow p-3 overflow-y-auto space-y-3 text-sm">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-slate-700 ml-4' : 'bg-slate-800 mr-4'}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                         {isTyping && <div className="p-2 rounded-lg bg-slate-800 mr-4 animate-pulse">...</div>}
                    </div>
                    <form onSubmit={askCopilot} className="p-3 border-t border-slate-700">
                        <input name="prompt" className="w-full p-2 rounded bg-slate-900 border border-slate-700" placeholder="e.g., Explain the Oil Spike scenario" />
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}