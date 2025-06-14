import React from 'react';
import NewsCard from './NewsCard';
import { AnimatePresence } from "framer-motion";

const topicConfig = {
    "Monetary Policy": { icon: "🏛️", color: "text-blue-400" },
    "Geopolitics": { icon: "🌍", color: "text-orange-400" },
    "Commodities": { icon: "⚡", color: "text-yellow-400" },
    "Tech & AI": { icon: "🤖", color: "text-purple-400" }
};

export default function NewsDashboard({ newsItems }) {
  const newsByTopic = newsItems.reduce((acc, item) => {
    (acc[item.topic] = acc[item.topic] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="w-full">
        <h2 className="text-xl font-bold text-white mb-4">Market News Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Object.entries(topicConfig).map(([topic, config]) => (
                <div key={topic} className="glassy-card rounded-xl p-3 h-48 flex flex-col">
                    <h3 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${config.color}`}>
                        <span>{config.icon}</span> {topic}
                    </h3>
                    <div className="flex-grow overflow-hidden">
                        <div className="flex gap-3 overflow-x-auto h-full pb-2">
                           <AnimatePresence>
                                {(newsByTopic[topic] || []).map(item => <NewsCard key={item.id} item={item} />)}
                           </AnimatePresence>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}