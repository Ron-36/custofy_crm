import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { KANBAN_COLUMNS } from "../../utils/kanban_columns";
import { initialLeads } from "../../utils/initialLeads";

export default function KanbanBoard() {
  const [leads, setLeads] = useState(initialLeads);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,     // 👈 required for mobile
        tolerance: 5
      }
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === active.id
          ? { ...lead, status: over.id }
          : lead
      )
    );
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max p-2">
          {KANBAN_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={leads.filter((l) => l.status === status)}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
