

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, LayoutDashboard, Bell, FileText, Users, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: LayoutDashboard },
  { name: 'Alerts', href: createPageUrl('Alerts'), icon: Bell },
  { name: 'Dossier', href: createPageUrl('Dossier'), icon: FileText },
  { name: 'Leaders', href: createPageUrl('Leaders'), icon: Users },
  { name: 'Settings', href: createPageUrl('Settings'), icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavLinks = ({ className }) => (
    <nav className={className}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-700/50 text-white'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
      <style>{`
        :root {
          --background: 222 47% 11%; /* bg-slate-900 */
          --foreground: 210 40% 98%;
          --card: 222 47% 14%; /* Slightly lighter card */
          --card-foreground: 210 40% 98%;
          --popover: 222 47% 11%;
          --popover-foreground: 210 40% 98%;
          --primary: 213 94% 57%;
          --primary-foreground: 210 40% 98%;
          --border: 217 33% 25%; /* Lighter border */
          --input: 217 33% 20%;
          --ring: 213 94% 57%;
          --radius: 0.75rem;
        }
        .glassy-card {
          background: rgba(30, 41, 59, 0.5); /* bg-slate-800/50 */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(51, 65, 85, 0.7); /* border-slate-700 */
        }
      `}</style>
      
      <header className="sticky top-0 z-50 w-full glassy-card">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2979FF] to-[#4C8DFF] rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <h1 className="text-xl font-bold gradient-text tracking-tight leading-tight">
                      CavuTrade Markets
                    </h1>
                    <p className="text-xs text-slate-400 font-normal tracking-wide">
                      Real-time pulse, one hub—shape every trade
                    </p>
                  </div>
                </Link>
              </div>
              <NavLinks className="hidden md:flex items-center space-x-4" />
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden"
            >
              <NavLinks className="px-2 pt-2 pb-3 space-y-1 sm:px-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

