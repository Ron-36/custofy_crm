import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { KANBAN_COLUMNS } from "../../utils/kanban_columns";
import { initialLeads } from "../../utils/initialLeads";

const STORAGE_KEY = "custofy_kanban_leads";

/* ===================== MODAL ===================== */

function LeadModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    value: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name) return;

    onSave({
      ...form,
      status: "Lead",
      id: Date.now().toString(),
    });

    setForm({ name: "", company: "", value: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">Add New Lead</h3>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Lead name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded mb-4"
          type="number"
          placeholder="Deal value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== CARD ===================== */

function KanbanCard({ lead, onDelete }) {
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
          onClick={() => onDelete(lead.id)}
          className="text-xs text-red-600 mt-2 px-2 bg-red-300 rounded-xl cursor-pointer"
        >
          Delete
        </button>
      )}
    </div>
  );
}

/* ===================== COLUMN ===================== */

function KanbanColumn({ status, leads, onDelete }) {
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

/* ===================== BOARD ===================== */

export default function KanbanBoard() {
  // 🔥 LOAD SAFELY HERE (NO useEffect)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialLeads;
    } catch {
      return initialLeads;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 SAVE ONLY WHEN LEADS CHANGE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

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
        <div className="overflow-x-auto w-full">
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
