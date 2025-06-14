
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import ScenarioCard from './ScenarioCard';
import { Mic, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge"; // Added for BinaryScenario component

const timeHorizons = ["0-5d", "1-12w", "3-12m", "1-5y"];
const riskRows = ["risk-on", "neutral", "risk-off"];
const gridLabels = {
    "0-5d": "0-5 Days", "1-12w": "1-12 Weeks", "3-12m": "3-12 Months", "1-5y": "1-5 Years",
    "risk-on": "Risk-ON", "neutral": "Neutral", "risk-off": "Risk-OFF"
};
const riskColors = {
    "risk-on": "border-green-500/40", "neutral": "border-slate-500/40", "risk-off": "border-red-500/40"
};

const BinaryScenario = ({ scenario, choice, onChange }) => (
    <div className="glassy-card p-3 rounded-xl flex items-center justify-between w-full md:w-auto md:flex-1">
        <div className="flex-1 mr-4">
            <h4 className="font-semibold text-slate-100 text-sm leading-tight">{scenario.title}</h4>
             <Badge variant="secondary" className="mt-2 bg-slate-800/80 text-[#90b8ff] border border-slate-700">
                Model: {scenario.modelProb}%
            </Badge>
        </div>
        <div className="flex items-center gap-1">
            <Button
                variant={choice === 'yes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(scenario.id, choice === 'yes' ? null : 'yes')}
                className={`
                    transition-colors
                    ${choice === 'yes' 
                        ? 'bg-green-600 hover:bg-green-500 text-white border-green-500' 
                        : 'border-slate-600 hover:bg-slate-700/50'
                    }
                `}
            >
                Yes
            </Button>
            <Button
                variant={choice === 'no' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(scenario.id, choice === 'no' ? null : 'no')}
                className={`
                    transition-colors
                    ${choice === 'no' 
                        ? 'bg-red-600 hover:bg-red-500 text-white border-red-500' 
                        : 'border-slate-600 hover:bg-slate-700/50'
                    }
                `}
            >
                No
            </Button>
        </div>
    </div>
);


export default function ScenarioGrid({ scenarios, handleVoiceCommand, binaryChoices, onBinaryChoiceChange }) {
  const getScenariosForCell = (horizon, risk) => scenarios.filter(s => s.horizon === horizon && s.riskRow === risk && !s.isBinary);
  const getUnassignedScenarios = () => scenarios.filter(s => s.horizon === 'unassigned' && !s.isBinary);
  const getBinaryScenarios = () => scenarios.filter(s => s.isBinary);

  return (
    <div className="w-full h-full p-4 flex flex-col relative glassy-card rounded-xl">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Scenario Grid</h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-slate-400 hover:text-[#2979FF] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="glassy-card border-slate-700">
                            <p className="text-sm">Drag scenarios to time horizons and risk levels to analyze portfolio impact</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Button onClick={handleVoiceCommand} variant="outline" size="icon" className="glassy-card border-slate-700 hover:border-[#2979FF] hover:text-[#2979FF]">
                <Mic className="h-4 w-4" />
            </Button>
        </div>
        
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] grid-rows-[30px_1fr_1fr_1fr] gap-2 flex-grow">
            <div></div>
            {timeHorizons.map(h => <div key={h} className="text-center text-sm font-semibold text-slate-400">{gridLabels[h]}</div>)}

            {riskRows.map(risk => (
                <React.Fragment key={risk}>
                    <div className={`flex items-center justify-center text-sm font-bold text-slate-300 rounded-lg border-2 ${riskColors[risk]}`}>{gridLabels[risk]}</div>
                    {timeHorizons.map(horizon => (
                        <Droppable key={`${horizon}-${risk}`} droppableId={`${horizon}|${risk}`}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className={`p-2 rounded-xl transition-colors border-2 border-dashed ${snapshot.isDraggingOver ? 'border-[#2979FF] bg-slate-800/50' : 'border-slate-700/50'}`}>
                                    <div className="space-y-2">
                                        {getScenariosForCell(horizon, risk).map((s, i) => (
                                            <Draggable key={s.id} draggableId={s.id} index={i}>
                                                {(p, snap) => <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}><ScenarioCard scenario={s} isDragging={snap.isDragging} /></div>}
                                            </Draggable>
                                        ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </React.Fragment>
            ))}
        </div>

        {/* Unassigned Scenarios */}
        <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Available Scenarios</h3>
            <Droppable droppableId="unassigned|unassigned" direction="horizontal">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={`p-2 rounded-xl border-2 border-dashed min-h-[80px] ${snapshot.isDraggingOver ? 'border-[#2979FF] bg-slate-800/50' : 'border-slate-700/50'}`}>
                        <div className="flex gap-2 flex-wrap">
                        {getUnassignedScenarios().map((s, i) => (
                                <Draggable key={s.id} draggableId={s.id} index={i}>
                                    {(p, snap) => <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="w-48"><ScenarioCard scenario={s} isDragging={snap.isDragging} /></div>}
                                </Draggable>
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>

        {/* Binary Scenarios Row */}
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-400">Binary Outcomes</h3>
            </div>
             <div className="flex flex-col md:flex-row gap-2 flex-wrap">
                {getBinaryScenarios().map(s => (
                    <BinaryScenario 
                        key={s.id} 
                        scenario={s} 
                        choice={binaryChoices[s.id]}
                        onChange={onBinaryChoiceChange}
                    />
                ))}
            </div>
        </div>
    </div>
  );
}
