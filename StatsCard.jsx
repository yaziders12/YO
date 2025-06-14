
import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <Card className="glassy-card overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 ${color} rounded-full opacity-10`} />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-slate-400">{title}</p>
                        <p className="text-xl md:text-2xl font-bold mt-1 text-white">
                            {value}
                        </p>
                    </div>
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
                        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                    </div>
                </div>
            </div>
        </Card>
    </motion.div>
  );
}
