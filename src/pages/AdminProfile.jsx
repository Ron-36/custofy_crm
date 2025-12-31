import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@custofy.com",
    phone: "9876543210",
  });

  const [formData, setFormData] = useState(profile);
  const [editing, setEditing] = useState(false);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("All fields are required");
      return;
    }

    setProfile(formData);
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] p-6 max-w-3xl">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Profile
        </h2>
        <p className="text-sm text-gray-500">
          Manage your personal information
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-5">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editing}
        />

        <Input
          label="Email ID"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editing}
        />

        <Input
          label="Contact Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-8">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------ Reusable Input ------------------ */

function Input({ label, disabled, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
