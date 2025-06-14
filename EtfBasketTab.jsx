import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Clipboard } from 'lucide-react';

export default function EtfBasketTab({ basket, onCopy }) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
                <Table>
                    <TableHeader><TableRow><TableHead>ETF</TableHead><TableHead>Weight</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {basket.map(({ etf, weight }) => (
                            <TableRow key={etf}><TableCell>{etf}</TableCell><TableCell>{weight.toFixed(1)}%</TableCell></TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex-shrink-0 pt-2 text-right">
                <Button onClick={onCopy} variant="outline" size="sm" className="glassy-card border-slate-700 hover:border-[#2979FF]"><Clipboard className="w-4 h-4 mr-2"/>Copy Basket</Button>
            </div>
        </div>
    );
}