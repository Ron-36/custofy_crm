import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import KanbanColumn from "./KanbanColumn";
import LeadModal from "./LeadModal";
import { KANBAN_COLUMNS } from "../../utils/constant";
import { useKanbanStorage } from "../../hooks/useKanbanStorage";

export default function KanbanBoard() {
  const [leads, setLeads] = useKanbanStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === active.id ? { ...l, status: over.id } : l
      )
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add New Lead
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max p-2">
            {KANBAN_COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                leads={leads.filter((l) => l.status === status)}
                onDelete={(id) =>
                  setLeads((prev) => prev.filter((l) => l.id !== id))
                }
              />
            ))}
          </div>
        </div>
      </DndContext>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(lead) => setLeads((prev) => [...prev, lead])}
      />
    </>
  );
}
