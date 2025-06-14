
import React from 'react';
import { motion } from 'framer-motion';
import SectorBucket from './SectorBucket';

const NewsBucketGroup = ({ title, newsItems, sectorColors, glowingSectors }) => {
    if (newsItems.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="sticky top-0 bg-[#0F1116]/80 backdrop-blur-sm z-10 py-2">
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400 border-b-2 border-[#2979FF]/50 pb-1">{title}</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 mt-2 -mx-4 px-4">
                {newsItems.map(([sector, data]) => (
                    <SectorBucket
                        key={sector}
                        sector={sector}
                        color={sectorColors[sector] || '#8D99AE'}
                        news={data.news}
                        summary={data.summary}
                        isGlowing={glowingSectors.includes(sector)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function NewsDigestContainer({ newsData, sectorColors, glowingSectors }) {
    const groupedNews = Object.entries(newsData).reduce((acc, [sector, data]) => {
        const bucket = data.bucket || 'Sector Trends';
        if (!acc[bucket]) {
            acc[bucket] = [];
        }
        acc[bucket].push([sector, data]);
        return acc;
    }, {});

    return (
        <div className="w-full">
            <NewsBucketGroup 
                title="Macro" 
                newsItems={groupedNews['Macro'] || []} 
                sectorColors={sectorColors} 
                glowingSectors={glowingSectors}
            />
            <div className="mt-6">
                <h2 className="text-xl font-bold text-white mb-3">Today's News</h2>
                 <NewsBucketGroup 
                    title="Sector Trends" 
                    newsItems={groupedNews['Sector Trends'] || []} 
                    sectorColors={sectorColors} 
                    glowingSectors={glowingSectors}
                />
                 <NewsBucketGroup 
                    title="Company Highlights" 
                    newsItems={groupedNews['Company Highlights'] || []} 
                    sectorColors={sectorColors} 
                    glowingSectors={glowingSectors}
                />
            </div>
        </div>
    );
}
