import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Minimize2, Send, Loader2 } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';

export default function AIAdvisor({ onToggle, isVisible }) {
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: 'Hello! I\'m your AI Advisor. Ask me about market scenarios, portfolio impacts, or any financial questions you have.' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await InvokeLLM({
                prompt: `You are an expert financial advisor and market analyst. The user is asking: "${userMessage}". 
                
                Provide a helpful, accurate, and concise response about financial markets, investment strategies, or economic scenarios. 
                If the question is about specific scenarios mentioned in the application (like Fed rate cuts, oil prices, tech regulation, etc.), 
                provide detailed insights about potential market impacts and portfolio considerations.
                
                Keep your response professional but conversational, and always include a disclaimer that this is for informational purposes only and not financial advice.`,
                add_context_from_internet: true
            });

            setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: '70%' }}
                    exit={{ opacity: 0, y: 50, height: 0 }}
                    className="absolute bottom-0 left-0 right-0 glassy-card rounded-t-xl overflow-hidden flex flex-col"
                >
                    <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                        <h4 className="font-bold text-white flex items-center gap-2">
                            <Brain className="text-[#2979FF] w-5 h-5" />
                            AI Advisor
                        </h4>
                        <Button variant="ghost" size="icon" onClick={onToggle}>
                            <Minimize2 className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div className="flex-grow p-3 overflow-y-auto space-y-3 text-sm">
                        {chatHistory.map((msg, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-lg max-w-[85%] ${
                                    msg.role === 'user' 
                                        ? 'bg-[#2979FF]/20 border border-[#2979FF]/30 ml-auto text-right' 
                                        : 'bg-slate-800/60 border border-slate-700/50'
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 max-w-[85%] flex items-center gap-2"
                            >
                                <Loader2 className="w-4 h-4 animate-spin text-[#2979FF]" />
                                <span className="text-slate-400">AI Advisor is thinking...</span>
                            </motion.div>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about market scenarios, portfolio impacts, or financial questions..."
                                className="flex-1 bg-slate-900/70 border-slate-700 focus:border-[#2979FF]"
                                disabled={isTyping}
                            />
                            <Button 
                                type="submit" 
                                disabled={!inputValue.trim() || isTyping}
                                className="bg-[#2979FF] hover:bg-[#4C8DFF] disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}