import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { useSelector } from "react-redux";
import { updateInventory } from "../../utils/updateInventory";

export default function Inventory() {
  const { authUser } = useSelector((state) => state.auth);

  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    item: "",
    reason: "",
    quantity: "",
  });

  /* ---------------- FETCH ---------------- */

  const fetchInventory = async () => {
    const q = query(
      collection(db, "inventory"),
      where("ownerId", "==", authUser.uid)
    );
    const snap = await getDocs(q);
    setInventory(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  const fetchItems = async () => {
    const q = query(
      collection(db, "items"),
      where("ownerId", "==", authUser.uid)
    );
    const snap = await getDocs(q);
    setItems(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  useEffect(() => {
    if (!authUser?.uid) return;
    fetchInventory();
    fetchItems();
  }, [authUser?.uid]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!authUser?.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (!formData.item || !formData.quantity) {
      toast.error("Select item and quantity");
      return;
    }

    const selectedItem = items.find((i) => i.name === formData.item);
    if (!selectedItem) {
      toast.error("Item not found");
      return;
    }

    try {
      await updateInventory({
        ownerId: authUser.uid,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        unit: selectedItem.unit,
        change: Number(formData.quantity),
        reason: formData.reason || "Manual Adjustment",
      });

      toast.success("Inventory adjusted");
      setShowForm(false);
      setFormData({ date: "", item: "", reason: "", quantity: "" });
      fetchInventory();
    } catch (err) {
      console.error("Inventory update failed:", err);
      toast.error("Inventory update failed. Check permissions.");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Inventory</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} />
          Adjust Inventory
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        {inventory.length === 0 ? (
          <div className="text-gray-500 text-center">
            No inventory available
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((i, idx) => (
                  <tr
                    key={idx}
                    className={`border-t hover:bg-indigo-50`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {i.itemName}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        i.quantity >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {i.quantity}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {i.unit}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Adjust Inventory</h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <select
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.name} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Use + or -"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              name="reason"
              placeholder="Reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
