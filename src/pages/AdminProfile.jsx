import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function AdminProfile() {
  const { authUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState(profile);

  /* ---------------- LOAD PROFILE ---------------- */

  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", authUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            name: data.name || "",
            email: data.email || authUser.email,
            phone: data.phone || "",
          });
          setFormData({
            name: data.name || "",
            email: data.email || authUser.email,
            phone: data.phone || "",
          });
        } else {
          // First time login → create profile
          const newProfile = {
            name: authUser.displayName || "",
            email: authUser.email,
            phone: "",
            createdAt: serverTimestamp(),
          };

          await setDoc(ref, newProfile);

          setProfile(newProfile);
          setFormData(newProfile);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("All fields are required");
      return;
    }

    try {
      const ref = doc(db, "users", authUser.uid);

      await setDoc(
        ref,
        {
          ...formData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setProfile(formData);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading profile...
      </div>
    );
  }

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
          disabled
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
