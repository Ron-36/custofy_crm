import { useDraggable } from "@dnd-kit/core";

export default function KanbanCard({ lead }) {
  const { setNodeRef, listeners, attributes, transform } =
    useDraggable({ id: lead.id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="
        bg-white p-3 rounded-lg shadow
        select-none touch-none
      "
    >
      <h4 className="font-medium">{lead.name}</h4>
      <p className="text-sm text-gray-500">{lead.company}</p>
      <p className="font-semibold">₹{lead.value}</p>
    </div>
  );
}
