
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const SECTORS = [
  { id: 'all', name: 'All Sectors', color: '#2979FF' },
  { id: 'TechAI', name: 'Tech & AI', color: '#118AB2' },
  { id: 'Healthcare', name: 'Healthcare', color: '#9D4EDD' },
  { id: 'Energy', name: 'Energy', color: '#EF476F' },
  { id: 'Financials', name: 'Financials', color: '#FFD166' },
  { id: 'Consumer', name: 'Consumer', color: '#06D6A0' },
  { id: 'Industrials', name: 'Industrials', color: '#8D99AE'},
  { id: 'Materials', name: 'Materials', color: '#FF6B35'}
];

export default function SectorFilter({ selectedSectors, onSectorChange }) {
  const isAllSelected = selectedSectors.includes('all');
  
  const handleSectorToggle = (sectorId) => {
    if (sectorId === 'all') {
      onSectorChange(['all']);
    } else {
      const newSelection = selectedSectors.includes(sectorId)
        ? selectedSectors.filter(id => id !== sectorId && id !== 'all')
        : [...selectedSectors.filter(id => id !== 'all'), sectorId];
      
      onSectorChange(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const clearAll = () => onSectorChange(['all']);

  return (
    <div className="w-full mb-6">
      <div className="glassy-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Focus Areas</h3>
          {!isAllSelected && (
            <Button onClick={clearAll} variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {SECTORS.map(sector => {
            const isSelected = selectedSectors.includes(sector.id) || (isAllSelected && sector.id === 'all');
            
            return (
              <motion.div
                key={sector.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 transition-all ${
                    isSelected 
                      ? `bg-opacity-20 border-2 text-white` 
                      : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                  style={isSelected ? { 
                    backgroundColor: sector.color + '40', 
                    borderColor: sector.color,
                    color: sector.color 
                  } : {}}
                  onClick={() => handleSectorToggle(sector.id)}
                >
                  {sector.name}
                </Badge>
              </motion.div>
            );
          })}
        </div>
        
        {!isAllSelected && (
          <p className="text-xs text-slate-500 mt-2">
            Showing content for {selectedSectors.length} selected sector{selectedSectors.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
