import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeBanner() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glassy-card p-4 rounded-xl mb-6"
        >
            <h1 className="text-xl font-bold text-white">Welcome back,</h1>
            <p className="text-slate-400">Here is your tailored market snapshot for today. Let's navigate the opportunities.</p>
        </motion.div>
    );
}