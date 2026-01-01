import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  Pencil,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useSelector } from "react-redux";
import { updateInventory } from "../../../utils/updateInventory";
import { checkAvailableStock } from "../../../utils/checkStock";

export default function Invoices() {
  const { authUser } = useSelector((state) => state.auth);

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [invoiceData, setInvoiceData] = useState({
    customer: "",
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ item: "", qty: 1, rate: 0 }],
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!authUser) return;

    const fetchAll = async () => {
      const custSnap = await getDocs(
        query(collection(db, "customers"), where("ownerId", "==", authUser.uid))
      );
      setCustomers(custSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const itemSnap = await getDocs(
        query(collection(db, "items"), where("ownerId", "==", authUser.uid))
      );
      setItems(itemSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const invSnap = await getDocs(
        query(collection(db, "invoices"), where("ownerId", "==", authUser.uid))
      );
      setInvoices(invSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchAll();
  }, [authUser]);

  /* ---------------- UTILITIES ---------------- */

  const generateInvoiceNo = () =>
    `INV-${String(invoices.length + 1).padStart(4, "0")}`;

  const calculateAmount = (qty, rate) => qty * rate;

  const totalAmount = invoiceData.items.reduce(
    (sum, i) => sum + calculateAmount(i.qty, i.rate),
    0
  );

  /* ---------------- HANDLERS ---------------- */

  const openNewInvoice = () => {
    setEditingInvoice(null);
    setInvoiceData({
      customer: "",
      invoiceNo: generateInvoiceNo(),
      date: new Date().toISOString().split("T")[0],
      items: [{ item: "", qty: 1, rate: 0 }],
    });
    setShowForm(true);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceData.items];
    updated[index][field] =
      field === "qty" || field === "rate" ? Number(value) : value;
    setInvoiceData({ ...invoiceData, items: updated });
  };

  const addItemRow = () => {
    if (invoiceData.items.length >= 5) {
      toast.error("You can add maximum 5 items");
      return;
    }
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { item: "", qty: 1, rate: 0 }],
    });
  };

  const removeItemRow = (index) => {
    if (invoiceData.items.length === 1) return;
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, i) => i !== index),
    });
  };

  /* ---------------- SAVE INVOICE ---------------- */

  const saveInvoice = async (status) => {
    if (!invoiceData.customer) {
      toast.error("Please select customer");
      return;
    }

    try {
      /* 🔒 STOCK CHECK — ONLY FOR SAVED INVOICE */
      if (status === "Saved") {
        for (const row of invoiceData.items) {
          const selectedItem = items.find((i) => i.name === row.item);
          if (!selectedItem) continue;

          const availableQty = await checkAvailableStock(
            authUser.uid,
            selectedItem.id
          );

          if (row.qty > availableQty) {
            toast.error(
              `Insufficient stock for ${selectedItem.name}. Available: ${availableQty}`
            );
            return; // ⛔ STOP EVERYTHING
          }
        }
      }

      let invoiceId;

      const payload = {
        ...invoiceData,
        status,
        total: totalAmount,
        ownerId: authUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingInvoice) {
        await updateDoc(doc(db, "invoices", editingInvoice.id), payload);
        invoiceId = editingInvoice.id;

        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId ? { ...payload, id: invoiceId } : inv
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "invoices"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        invoiceId = docRef.id;

        setInvoices((prev) => [...prev, { ...payload, id: invoiceId }]);
      }

      /* 🔻 DECREASE INVENTORY */
      if (status === "Saved") {
        for (const row of invoiceData.items) {
          const selectedItem = items.find((i) => i.name === row.item);
          if (!selectedItem) continue;

          await updateInventory({
            ownerId: authUser.uid,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            unit: selectedItem.unit || "pcs",
            change: -Number(row.qty),
            reason: "Sales Invoice",
            refId: invoiceId,
          });
        }
      }

      toast.success(
        status === "Draft"
          ? "Invoice saved as Draft"
          : "Invoice saved & inventory updated"
      );

      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save invoice");
    }
  };

  /* ---------------- DELETE INVOICE ---------------- */

  const deleteInvoice = async (invoice) => {
    if (!confirm("Delete this invoice?")) return;

    try {
      if (invoice.status === "Saved") {
        for (const row of invoice.items) {
          const selectedItem = items.find((i) => i.name === row.item);
          if (!selectedItem) continue;

          await updateInventory({
            ownerId: authUser.uid,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            unit: selectedItem.unit || "pcs",
            change: Number(row.qty), // ➕ RESTORE
            reason: "Invoice Deleted (Stock Reversal)",
            refId: invoice.id,
          });
        }
      }

      await deleteDoc(doc(db, "invoices", invoice.id));

      setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invoice");
    }
  };


  /* ---------------- UI ---------------- */
    return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <button
          onClick={openNewInvoice}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-6">
        {invoices.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            You don’t have any invoices till now
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.customer}</td>
                  <td>{inv.date}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        inv.status === "Draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>₹{inv.total}</td>
                  <td className="text-right space-x-2">
                    {inv.status === "Draft" && (
                      <button onClick={() => editInvoice(inv)}>
                        <Pencil size={16} />
                      </button>
                    )}
                    <button onClick={() => deleteInvoice(inv)}>
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Invoice</h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <select
                value={invoiceData.customer}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, customer: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input disabled value={invoiceData.invoiceNo} className="border p-2 rounded" />
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, date: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>

            {/* ITEMS */}
            <table className="w-full mb-4">
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
                {invoiceData.items.map((row, i) => (
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
                        min="1"
                        required
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
                        disabled={invoiceData.items.length === 1}
                        onClick={() => removeItemRow(i)}
                      >
                        <MinusCircle />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button onClick={() => saveInvoice("Draft")} className="border px-4 py-2 rounded">
                Draft
              </button>
              <button onClick={() => saveInvoice("Saved")} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
