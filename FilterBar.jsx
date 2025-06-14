import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

// --- GEOGRAPHY FILTER ---
const GeoFilter = ({ selectedGeo, onGeoChange }) => (
    <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Geography</h4>
        <div className="flex gap-2">
            <Button variant={selectedGeo === 'US' ? 'default' : 'outline'} onClick={() => onGeoChange('US')} className={selectedGeo === 'US' ? 'bg-[#2979FF]' : 'border-slate-600'}>US</Button>
            <Button variant={selectedGeo === 'Global' ? 'default' : 'outline'} onClick={() => onGeoChange('Global')} className={selectedGeo === 'Global' ? 'bg-[#2979FF]' : 'border-slate-600'}>Global</Button>
        </div>
    </div>
);

// --- SECTOR FILTER ---
const SECTORS = [
  { id: 'all', name: 'All Sectors' }, { id: 'TechAI', name: 'Tech & AI' }, { id: 'Healthcare', name: 'Healthcare' }, 
  { id: 'Energy', name: 'Energy' }, { id: 'Financials', name: 'Financials' }, { id: 'Consumer', name: 'Consumer' }, 
  { id: 'Industrials', name: 'Industrials'}, { id: 'Materials', name: 'Materials'}
];

const SectorFilter = ({ selectedSectors, onSectorChange }) => {
    const isAllSelected = selectedSectors.includes('all');
    const handleSectorToggle = (sectorId) => {
        if (sectorId === 'all') onSectorChange(['all']);
        else {
            const newSelection = selectedSectors.includes(sectorId) ? selectedSectors.filter(id => id !== sectorId && id !== 'all') : [...selectedSectors.filter(id => id !== 'all'), sectorId];
            onSectorChange(newSelection.length === 0 ? ['all'] : newSelection);
        }
    };
    return (
        <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Sectors</h4>
            <div className="flex flex-wrap gap-2">
                {SECTORS.map(sector => (
                    <Badge key={sector.id} variant={selectedSectors.includes(sector.id) ? 'default' : 'outline'} onClick={() => handleSectorToggle(sector.id)} className={`cursor-pointer transition-colors ${selectedSectors.includes(sector.id) ? 'bg-[#2979FF]' : 'border-slate-600'}`}>{sector.name}</Badge>
                ))}
            </div>
        </div>
    );
};

// --- COMPANY FILTER ---
const CompanyFilter = ({ selectedCompanies, onCompanyChange, companyList }) => {
    const [open, setOpen] = React.useState(false);
    
    const handleSelect = (currentValue) => {
        const newSelection = selectedCompanies.includes(currentValue)
            ? selectedCompanies.filter(c => c !== currentValue)
            : [...selectedCompanies, currentValue];
        onCompanyChange(newSelection);
        setOpen(false);
    };

    return (
        <div className="flex-grow">
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Companies</h4>
            <div className="flex flex-wrap items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between border-slate-600">
                            Select companies...
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 glassy-card border-slate-700">
                        <Command>
                            <CommandInput placeholder="Search company..." />
                            <CommandEmpty>No company found.</CommandEmpty>
                            <CommandGroup>
                                {companyList.map((company) => (
                                    <CommandItem key={company.ticker} onSelect={() => handleSelect(company.ticker)}>
                                        <Check className={cn("mr-2 h-4 w-4", selectedCompanies.includes(company.ticker) ? "opacity-100" : "opacity-0")} />
                                        {company.name} ({company.ticker})
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1">
                    {selectedCompanies.map(company => (
                        <motion.div key={company} initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}}>
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                            {company}
                            <button onClick={() => handleSelect(company)} className="ml-1 rounded-full hover:bg-slate-600 p-0.5"><X className="h-3 w-3"/></button>
                        </Badge>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN FILTER BAR ---
export default function FilterBar({ filters, onFilterChange, companyList }) {
    return (
        <div className="w-full glassy-card rounded-xl p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GeoFilter selectedGeo={filters.geo} onGeoChange={(geo) => onFilterChange('geo', geo)} />
                <div className="md:col-span-2">
                    <SectorFilter selectedSectors={filters.sectors} onSectorChange={(sectors) => onFilterChange('sectors', sectors)} />
                </div>
            </div>
            <div className="border-t border-slate-700/60 my-2"></div>
            <CompanyFilter selectedCompanies={filters.companies} onCompanyChange={(companies) => onFilterChange('companies', companies)} companyList={companyList} />
        </div>
    );
}