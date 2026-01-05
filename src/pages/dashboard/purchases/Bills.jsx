import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  Pencil,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { toast } from "react-toastify";
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
import { updateInventory } from "../../../utils/updateInventory";

export default function Bills() {
  const { authUser } = useSelector((state) => state.auth);

  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  const [billData, setBillData] = useState({
    vendor: "",
    billNo: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ item: "", qty: 1, rate: 0 }],
  });

  /* ---------------- FETCH DATA ---------------- */

  const fetchBills = async () => {
    if (!authUser?.uid) return;
    const q = query(
      collection(db, "bills"),
      where("ownerId", "==", authUser.uid)
    );
    const snap = await getDocs(q);
    setBills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchVendors = async () => {
    if (!authUser?.uid) return;
    const q = query(
      collection(db, "vendors"),
      where("ownerId", "==", authUser.uid)
    );
    const snap = await getDocs(q);
    setVendors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchItems = async () => {
    if (!authUser?.uid) return;
    const q = query(
      collection(db, "items"),
      where("ownerId", "==", authUser.uid)
    );
    const snap = await getDocs(q);
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (!authUser?.uid) return;
    fetchBills();
    fetchVendors();
    fetchItems();
  }, [authUser?.uid]);

  /* ---------------- UTILITIES ---------------- */

  const calculateAmount = (qty, rate) => qty * rate;

  const totalAmount = billData.items.reduce(
    (sum, i) => sum + calculateAmount(i.qty, i.rate),
    0
  );

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredBills = bills.filter(
    (b) =>
      b.billNo.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- HANDLERS ---------------- */

  const openNewBill = () => {
    setEditingBill(null);
    setBillData({
      vendor: "",
      billNo: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ item: "", qty: 1, rate: 0 }],
    });
    setShowForm(true);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...billData.items];
    updated[index][field] =
      field === "qty" || field === "rate" ? Number(value) : value;
    setBillData({ ...billData, items: updated });
  };

  const addItemRow = () => {
    if (billData.items.length >= 5) {
      toast.error("Maximum 5 items allowed");
      return;
    }
    setBillData({
      ...billData,
      items: [...billData.items, { item: "", qty: 1, rate: 0 }],
    });
  };

  const removeItemRow = (index) => {
    if (billData.items.length === 1) return;
    setBillData({
      ...billData,
      items: billData.items.filter((_, i) => i !== index),
    });
  };

  const saveBill = async () => {
    if (!billData.vendor || !billData.billNo) {
      toast.error("Please fill vendor and bill number");
      return;
    }

    try {
      let billId;

      const payload = {
        ...billData,
        total: totalAmount,
        ownerId: authUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingBill) {
        await updateDoc(doc(db, "bills", editingBill.id), payload);
        billId = editingBill.id;
        toast.success("Bill updated");
      } else {
        const ref = await addDoc(collection(db, "bills"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        billId = ref.id;
        toast.success("Bill added");
      }

      // 🔥 INVENTORY UPDATE (INCREASE)
      for (const row of billData.items) {
        const selectedItem = items.find((i) => i.name === row.item);
        if (!selectedItem) continue;

        await updateInventory({
          ownerId: authUser.uid,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          unit: selectedItem.unit || "pcs",
          change: Number(row.qty),
          reason: "Purchase Bill",
          refId: billId,
        });
      }

      setShowForm(false);
      fetchBills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save bill");
    }
  };

  const editBill = (bill) => {
    setEditingBill(bill);
    setBillData(bill);
    setShowForm(true);
  };

  const deleteBill = async (id) => {
    if (!confirm("Delete this bill?")) return;
    await deleteDoc(doc(db, "bills", id));
    toast.success("Bill deleted");
    fetchBills();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Bills</h2>
        <button
          onClick={openNewBill}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} /> New Bill
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-6">
        <input
          placeholder="Search bill no or vendor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />
      </div>

      {/* TABLE (SAME AS INVOICE LAYOUT) */}
      <div className="flex-1 overflow-auto px-6">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50 hidden md:table-header-group">
            <tr>
              <th className="px-4 py-3 text-left">Bill No</th>
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b hover:bg-indigo-50 md:table-row block p-4 md:p-0"
              >
                <td className="px-4 py-2 block md:table-cell">
                  <span className="md:hidden font-semibold">Bill No: </span>
                  {bill.billNo}
                </td>

                <td className="px-4 py-2 block md:table-cell">
                  <span className="md:hidden font-semibold">Vendor: </span>
                  {bill.vendor}
                </td>

                <td className="px-4 py-2 block md:table-cell">
                  <span className="md:hidden font-semibold">Date: </span>
                  {bill.date}
                </td>

                <td className="px-4 py-2 block md:table-cell font-semibold">
                  ₹{bill.total}
                </td>

                <td className="px-4 py-2 block md:table-cell">
                  <div className="flex md:justify-end gap-3">
                    <button
                      onClick={() => editBill(bill)}
                      className="p-2 rounded hover:bg-indigo-100 text-indigo-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="p-2 rounded hover:bg-red-100 text-red-600"
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

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingBill ? "Edit Bill" : "New Bill"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                value={billData.vendor}
                onChange={(e) =>
                  setBillData({ ...billData, vendor: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Bill Number"
                value={billData.billNo}
                onChange={(e) =>
                  setBillData({ ...billData, billNo: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={billData.date}
                onChange={(e) =>
                  setBillData({ ...billData, date: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>

            {/* ITEMS */}
            <table className="w-full mb-4 text-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {billData.items.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        value={row.item}
                        onChange={(e) =>
                          handleItemChange(i, "item", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                      >
                        <option value="">Select</option>
                        {items.map((it) => (
                          <option key={it.id} value={it.name}>
                            {it.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          handleItemChange(i, "qty", e.target.value)
                        }
                        className="border p-2 rounded w-20"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleItemChange(i, "rate", e.target.value)
                        }
                        className="border p-2 rounded w-24"
                      />
                    </td>
                    <td>₹{calculateAmount(row.qty, row.rate)}</td>
                    <td className="flex gap-2">
                      <button onClick={addItemRow}>
                        <PlusCircle />
                      </button>
                      <button
                        disabled={billData.items.length === 1}
                        onClick={() => removeItemRow(i)}
                      >
                        <MinusCircle />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-3">
              <button
                onClick={saveBill}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
