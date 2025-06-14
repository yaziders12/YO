
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, DollarSign } from 'lucide-react';

const MOCK_EVENTS = [
  { event: "CPI Report", epoch: Date.now() + (7 * 24 * 60 * 60 * 1000), bucket: "Macro" },
  { event: "FOMC Meeting", epoch: Date.now() + (62 * 24 * 60 * 60 * 1000), bucket: "Macro" },
  { event: "Jobs Report", epoch: Date.now() + (14 * 24 * 60 * 60 * 1000), bucket: "Macro" },
  { event: "AAPL Q2 Earnings", epoch: Date.now() + (18 * 24 * 60 * 60 * 1000), bucket: "Company" },
  { event: "NVDA GTC Conf.", epoch: Date.now() + (25 * 24 * 60 * 60 * 1000), bucket: "Company" },
  { event: "Oil Inventories", epoch: Date.now() + (2 * 24 * 60 * 60 * 1000), bucket: "Commodity" }
];

const BUCKETS = {
  "Macro": { icon: DollarSign, color: "text-amber-400" },
  "Company": { icon: Building, color: "text-sky-400" },
  "Commodity": { icon: Calendar, color: "text-lime-400" }
};

function EventTimer({ event, targetEpoch, onExpired }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetEpoch - now;
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeout(() => onExpired(), 5000); // Hide after 5 seconds
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEpoch, onExpired]);

  return (
    <motion.div
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-500 ${
        isExpired 
          ? 'bg-red-500/20 text-red-300 animate-pulse' 
          : 'bg-slate-800/60 text-white border border-slate-700/50'
      }`}
      animate={isExpired ? { backgroundColor: 'rgba(239, 68, 68, 0.2)' } : {}}
    >
      <span className="text-slate-400">{event} in </span>
      <span className="text-cobalt-300 font-bold">{timeLeft}</span>
    </motion.div>
  );
}

export default function EventTimerBar() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  
  const handleEventExpired = (expiredEventName) => {
    setEvents(prev => prev.filter(e => e.event !== expiredEventName));
  };

  const groupedEvents = events.reduce((acc, event) => {
    acc[event.bucket] = [...(acc[event.bucket] || []), event];
    return acc;
  }, {});

  return (
    <div className="w-full glassy-card rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Upcoming Market Catalysts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(groupedEvents).map(([bucketName, bucketEvents]) => {
                const BucketIcon = BUCKETS[bucketName]?.icon || Calendar; // Default to Calendar if bucket not found
                return (
                    <div key={bucketName} className="bg-slate-900/50 p-3 rounded-lg">
                        <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${BUCKETS[bucketName]?.color}`}>
                            <BucketIcon className="w-4 h-4" />
                            {bucketName} Events
                        </h4>
                        <div className="space-y-2">
                             {bucketEvents.map((eventData) => (
                                <EventTimer 
                                    key={eventData.event}
                                    event={eventData.event}
                                    targetEpoch={eventData.epoch}
                                    onExpired={() => handleEventExpired(eventData.event)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
