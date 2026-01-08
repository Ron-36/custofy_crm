import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ status, leads }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="
        w-[280px] flex-shrink-0
        bg-gray-100 rounded-xl p-3
        min-h-[70vh]
      "
    >
      <h3 className="font-semibold mb-3">{status}</h3>

      <div className="space-y-3">
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
