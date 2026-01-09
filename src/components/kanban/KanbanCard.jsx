import { useDraggable } from "@dnd-kit/core";

export default function KanbanCard({ lead, onDelete }) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className="bg-white p-3 rounded-lg shadow select-none touch-none"
    >
      <h4 className="font-medium">{lead.name}</h4>
      <p className="text-sm text-gray-500">{lead.company}</p>
      <p className="font-semibold">₹{lead.value}</p>

      {lead.status === "Closed" && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(lead.id)}
          className="text-xs text-red-600 mt-2 bg-red-200 px-2 rounded"
        >
          Delete
        </button>
      )}
    </div>
  );
}
