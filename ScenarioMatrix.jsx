import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ScenarioCard from "./ScenarioCard";

const timeHorizons = [
  { id: "0-5d", label: "0-5 Days", description: "Immediate" },
  { id: "1-12w", label: "1-12 Weeks", description: "Short Term" },
  { id: "3-12m", label: "3-12 Months", description: "Medium Term" },
  { id: "1-5y", label: "1-5 Years", description: "Long Term" }
];

const riskLevels = [
  { id: "risk-on", label: "Risk-ON", color: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "neutral", label: "Neutral", color: "bg-slate-500/10 border-slate-500/30" },
  { id: "risk-off", label: "Risk-OFF", color: "bg-red-500/10 border-red-500/30" }
];

export default function ScenarioMatrix({ scenarios, onScenariosChange }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const [destRisk, destTime] = destination.droppableId.split("-");
    
    const updatedScenarios = scenarios.map(scenario => {
      if (scenario.id === result.draggableId) {
        return {
          ...scenario,
          risk_level: destRisk,
          time_horizon: destTime
        };
      }
      return scenario;
    });

    onScenariosChange(updatedScenarios);
  };

  const getScenariosForCell = (riskLevel, timeHorizon) => {
    return scenarios.filter(s => s.risk_level === riskLevel && s.time_horizon === timeHorizon);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="glass-effect rounded-2xl p-6 border border-slate-600/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Scenario Matrix</h2>
          <p className="text-slate-400 text-sm">
            Drag scenarios across time horizons and risk levels to analyze portfolio impact
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Header Row */}
          <div className=""></div>
          {timeHorizons.map(horizon => (
            <div key={horizon.id} className="text-center">
              <h3 className="text-white font-semibold text-sm mb-1">{horizon.label}</h3>
              <p className="text-slate-400 text-xs">{horizon.description}</p>
            </div>
          ))}

          {/* Risk Level Rows */}
          {riskLevels.map(risk => (
            <React.Fragment key={risk.id}>
              {/* Risk Level Label */}
              <div className={`
                rounded-xl p-4 border ${risk.color} 
                flex items-center justify-center
              `}>
                <h3 className="text-white font-semibold text-sm text-center leading-tight">
                  {risk.label}
                </h3>
              </div>

              {/* Time Horizon Cells */}
              {timeHorizons.map(horizon => (
                <Droppable 
                  key={`${risk.id}-${horizon.id}`} 
                  droppableId={`${risk.id}-${horizon.id}`}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        min-h-32 p-3 rounded-xl border-2 border-dashed transition-all duration-200
                        ${snapshot.isDraggingOver 
                          ? 'border-amber-500/50 bg-amber-500/5' 
                          : 'border-slate-600/30 hover:border-slate-500/50'
                        }
                      `}
                    >
                      <div className="space-y-2">
                        {getScenariosForCell(risk.id, horizon.id).map((scenario, index) => (
                          <Draggable
                            key={scenario.id}
                            draggableId={scenario.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ScenarioCard 
                                  scenario={scenario} 
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
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
      </div>
    </DragDropContext>
  );
}