import React,{useState} from "react";
export default function LeadModal({
  isOpen,
  onClose,
  onSave,
  defaultStatus,
  lead
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState(
    lead || {
      name: "",
      company: "",
      value: "",
      status: defaultStatus
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">
          {lead ? "Edit Lead" : "Add Lead"}
        </h3>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Lead name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="value"
            placeholder="Deal value"
            type="number"
            value={form.value}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
