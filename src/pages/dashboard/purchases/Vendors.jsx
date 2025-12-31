import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Vendors() {
  const { authUser } = useSelector((state) => state.auth);

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  /* ---------------- LOAD VENDORS ---------------- */

  useEffect(() => {
    if (!authUser) return;

    const fetchVendors = async () => {
      try {
        const q = query(
          collection(db, "vendors"),
          where("ownerId", "==", authUser.uid)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVendors(list);
      } catch (error) {
        toast.error("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [authUser]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      if (editingVendor) {
        const ref = doc(db, "vendors", editingVendor.id);
        await updateDoc(ref, {
          ...formData,
          updatedAt: serverTimestamp(),
        });

        setVendors((prev) =>
          prev.map((v) =>
            v.id === editingVendor.id ? { ...v, ...formData } : v
          )
        );

        toast.success("Vendor updated");
      } else {
        const docRef = await addDoc(collection(db, "vendors"), {
          ...formData,
          ownerId: authUser.uid,
          createdAt: serverTimestamp(),
        });

        setVendors((prev) => [
          ...prev,
          { id: docRef.id, ...formData },
        ]);

        toast.success("Vendor added");
      }

      closeForm();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      phone: vendor.phone,
      email: vendor.email || "",
      address: vendor.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deleteDoc(doc(db, "vendors", id));
      setVendors((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vendor deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVendor(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
    });
  };

  /* ---------------- SEARCH ---------------- */

  const filteredVendors = vendors.filter((v) =>
    `${v.name} ${v.phone} ${v.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Vendors
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor..."
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Vendor
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredVendors.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">No vendors found</p>
            <p className="text-sm mt-1">Add a vendor to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b text-left text-gray-600">
                <th className="py-2">Vendor Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-b">
                  <td className="py-2 font-medium">{vendor.name}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.email || "-"}</td>
                  <td>{vendor.address || "-"}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingVendor ? "Edit Vendor" : "Add Vendor"}
              </h3>
              <button onClick={closeForm}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Vendor Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Email ID" name="email" value={formData.email} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeForm} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                {editingVendor ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
