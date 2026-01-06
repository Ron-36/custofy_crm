import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, Search } from "lucide-react";
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
import { db } from "../../utils/firebaseConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Items() {
  const { authUser } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
  });

  /* ---------------- LOAD ITEMS ---------------- */

  useEffect(() => {
    if (!authUser) return;

    const fetchItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          where("ownerId", "==", authUser.uid)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(list);
      } catch {
        toast.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [authUser]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({ name: "", unit: "" });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, unit: item.unit });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.unit) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingItem) {
        const ref = doc(db, "items", editingItem.id);
        await updateDoc(ref, {
          ...formData,
          updatedAt: serverTimestamp(),
        });

        setItems((prev) =>
          prev.map((i) =>
            i.id === editingItem.id ? { ...i, ...formData } : i
          )
        );

        toast.success("Item updated successfully");
      } else {
        const docRef = await addDoc(collection(db, "items"), {
          ...formData,
          ownerId: authUser.uid,
          createdAt: serverTimestamp(),
        });

        setItems((prev) => [...prev, { id: docRef.id, ...formData }]);
        toast.success("Item added successfully");
      }

      closeForm();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, "items", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: "", unit: "" });
  };

  /* ---------------- SEARCH ---------------- */

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.unit}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Items</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Add an item to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Item Name</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t text-sm hover:bg-indigo-50
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="p-2 rounded-md text-indigo-600 hover:bg-indigo-100"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-md text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? "Edit Item" : "Add Item"}
              </h3>
              <button onClick={closeForm}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeForm}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                {editingItem ? "Update" : "Add"}
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
