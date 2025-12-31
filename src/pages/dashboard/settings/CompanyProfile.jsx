import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveCompanyProfile } from "../../../store/companySlice";

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.company);
  const { authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);

  /* ---------------- Load data from Redux ---------------- */

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      toast.error("All fields are required");
      return;
    }

    await dispatch(
      saveCompanyProfile({
        uid: authUser.uid,
        data: formData,
      })
    );

    toast.success("Company details updated successfully");
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile || {
      name: "",
      address: "",
      phone: "",
      email: "",
    });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-6">
        Company Profile
      </h2>

      <div className="space-y-5">
        <Input
          label="Company Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editing}
        />

        <Textarea
          label="Company Address"
          name="address"
          value={formData.address}
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

        <Input
          label="Email ID"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      <div className="flex gap-3 mt-8">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Edit Details
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

/* ---------------- Reusable Components ---------------- */

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

function Textarea({ label, disabled, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
