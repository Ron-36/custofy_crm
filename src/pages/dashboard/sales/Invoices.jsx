import { useEffect, useState } from "react";
import { Plus, X, Trash2, Pencil, MinusCircle, PlusCircle } from "lucide-react";
import jsPDF from "jspdf";
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
  const { profile: companyProfile } = useSelector((state) => state.company);

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  /* ---------------- FILTER ---------------- */
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || inv.status === statusFilter;

    return matchSearch && matchStatus;
  });

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

  const editInvoice = (invoice) => {
    if (invoice.status === "Saved") {
      toast.info("Saved invoices cannot be edited");
      return;
    }

    setEditingInvoice(invoice);
    setInvoiceData({
      customer: invoice.customer,
      invoiceNo: invoice.invoiceNo,
      date: invoice.date,
      items: invoice.items,
    });
    setShowForm(true);
  };

  const deleteInvoice = async (invoice) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await deleteDoc(doc(db, "invoices", invoice.id));
      setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
      toast.success("Invoice deleted");
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  /* ---------------- SAVE INVOICE ---------------- */
  const saveInvoice = async (status) => {
    if (!invoiceData.customer) {
      toast.error("Please select customer");
      return;
    }

    try {
      if (status === "Saved") {
        for (const row of invoiceData.items) {
          const selectedItem = items.find((i) => i.name === row.item);
          if (!selectedItem) continue;

          const availableQty = await checkAvailableStock(
            authUser.uid,
            selectedItem.id
          );

          if (row.qty > availableQty) {
            toast.error(`Insufficient stock for ${selectedItem.name}`);
            return;
          }
        }
      }

      const payload = {
        ...invoiceData,
        status,
        total: totalAmount,
        ownerId: authUser.uid,
        updatedAt: serverTimestamp(),
      };

      let invoiceId;

      if (editingInvoice) {
        await updateDoc(doc(db, "invoices", editingInvoice.id), payload);
        invoiceId = editingInvoice.id;
        setInvoices((prev) =>
          prev.map((i) =>
            i.id === invoiceId ? { ...payload, id: invoiceId } : i
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

      toast.success("Invoice saved");
      setShowForm(false);
    } catch {
      toast.error("Failed to save invoice");
    }
  };

  /* ---------------- PDF EXPORT ---------------- */
  const exportInvoicePDF = (inv) => {
    if (inv.status !== "Saved") {
      toast.error("Draft invoices cannot be downloaded");
      return;
    }

    if (!companyProfile) {
      toast.error("Company profile not found");
      return;
    }

    const doc = new jsPDF();
    doc.text("INVOICE", 105, 10, { align: "center" });
    doc.setFontSize(14);
    doc.text(companyProfile.name, 14, 15);
    doc.setFontSize(10);
    doc.text(companyProfile.address, 14, 22);
    doc.text(`Phone: ${companyProfile.phone}`, 14, 28);
    doc.text(`Email: ${companyProfile.email}`, 14, 34);

    doc.line(14, 38, 195, 38);

    doc.setFontSize(16);
    

    doc.setFontSize(11);
    doc.text(`Invoice No: ${inv.invoiceNo}`, 14, 60);
    doc.text(`Date: ${inv.date}`, 14, 68);
    doc.text(`Bill To: ${inv.customer}`, 14, 76);

    let y = 90;
    inv.items.forEach((i) => {
      doc.text(
        `${i.item}  |  Qty: ${i.qty}  |  Rate: ${i.rate}  |  Amount: ${
          i.qty * i.rate
        }`,
        14,
        y
      );
      y += 8;
    });

    y += 10;
    doc.text(`Total: ₹${inv.total}`, 14, y);

    y += 15;
    doc.setFontSize(9);
    doc.text(
      "This is a digitally generated invoice. Signature not required.",
      105,
      y,
      { align: "center" }
    );

    doc.save(`${inv.invoiceNo}.pdf`);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <button
          onClick={openNewInvoice}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-6 flex gap-3">
        <input
          placeholder="Search invoice or customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg w-40"
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Saved">Saved</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto px-6">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-3 py-2 text-left">Invoice</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Status</th>
              <th className="text-left">Total</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-indigo-50">
                <td className="px-3 py-2">{inv.invoiceNo}</td>
                <td>{inv.customer}</td>
                <td><span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${
        inv.status === "Draft"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
  >
    {inv.status}
  </span></td>
                <td>₹{inv.total}</td>
                <td className="text-right space-x-2">
                  <button onClick={() => exportInvoicePDF(inv)}>📄</button>
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
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingInvoice ? "Edit Invoice" : "New Invoice"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                value={invoiceData.customer}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, customer: e.target.value })
                }
                className="border p-2 rounded-lg"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                value={invoiceData.invoiceNo}
                disabled
                className="border p-2 rounded-lg bg-gray-100"
              />

              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, date: e.target.value })
                }
                className="border p-2 rounded-lg"
              />
            </div>

            {/* ITEMS */}
            <table className="w-full mb-6 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2">
                      <select
                        value={row.item}
                        onChange={(e) =>
                          setInvoiceData((prev) => {
                            const updated = [...prev.items];
                            updated[i].item = e.target.value;
                            return { ...prev, items: updated };
                          })
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

                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e) =>
                          setInvoiceData((prev) => {
                            const updated = [...prev.items];
                            updated[i].qty = Number(e.target.value);
                            return { ...prev, items: updated };
                          })
                        }
                        className="border p-2 rounded w-20"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          setInvoiceData((prev) => {
                            const updated = [...prev.items];
                            updated[i].rate = Number(e.target.value);
                            return { ...prev, items: updated };
                          })
                        }
                        className="border p-2 rounded w-24"
                      />
                    </td>

                    <td className="p-2 font-semibold">₹{row.qty * row.rate}</td>

                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            items: [
                              ...prev.items,
                              { item: "", qty: 1, rate: 0 },
                            ],
                          }))
                        }
                      >
                        <PlusCircle />
                      </button>

                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() =>
                            setInvoiceData((prev) => ({
                              ...prev,
                              items: prev.items.filter((_, idx) => idx !== i),
                            }))
                          }
                        >
                          <MinusCircle />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => saveInvoice("Draft")}
                className="border px-4 py-2 rounded-lg"
              >
                Draft
              </button>
              <button
                onClick={() => saveInvoice("Saved")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
