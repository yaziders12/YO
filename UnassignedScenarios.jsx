import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import ScenarioCard from "./ScenarioCard";
import { Package } from "lucide-react";

export default function UnassignedScenarios({ scenarios }) {
  const unassignedScenarios = scenarios.filter(s => !s.risk_level || !s.time_horizon);

  if (unassignedScenarios.length === 0) return null;

  return (
    <Card className="glass-effect border-slate-600/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Available Scenarios</h3>
      </div>
      
      <Droppable droppableId="unassigned">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-20 rounded-xl border-2 border-dashed p-3 transition-all duration-200
              ${snapshot.isDraggingOver 
                ? 'border-amber-500/50 bg-amber-500/5' 
                : 'border-slate-600/30'
              }
            `}
          >
            <div className="grid gap-3">
              {unassignedScenarios.map((scenario, index) => (
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
    </Card>
  );
}