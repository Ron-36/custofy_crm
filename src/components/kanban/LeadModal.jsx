import { useState } from "react";

export default function LeadModal({ isOpen, onClose, onSave }) {
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
      id: Date.now().toString(),
      status: "Lead",
    });

    setForm({ name: "", company: "", value: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
          type="number"
          className="w-full border p-2 rounded mb-4"
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
