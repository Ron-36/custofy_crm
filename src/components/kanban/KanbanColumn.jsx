import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ status, leads, onDelete }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="w-[280px] bg-gray-100 rounded-xl p-3 min-h-[70vh] flex-shrink-0"
    >
      <h3 className="font-semibold mb-3">{status}</h3>

      <div className="space-y-3">
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
