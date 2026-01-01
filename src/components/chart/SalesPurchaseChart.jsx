import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { useSelector } from "react-redux";

export default function SalesPurchaseChart() {
  const { authUser } = useSelector((state) => state.auth);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchData = async () => {
      const salesMap = {};
      const purchaseMap = {};

      /* ---------------- SALES (INVOICES) ---------------- */
      const invoiceSnap = await getDocs(
        query(
          collection(db, "invoices"),
          where("ownerId", "==", authUser.uid),
          where("status", "==", "Saved")
        )
      );

      invoiceSnap.docs.forEach((doc) => {
        const inv = doc.data();
        if (!inv.createdAt) return;

        let date;
        if (inv.createdAt?.toDate) {
          date = inv.createdAt.toDate();
        } else {
          date = new Date(inv.createdAt);
        }

        if (isNaN(date)) return;

        const month = date.toLocaleString("default", { month: "short" });
        salesMap[month] = (salesMap[month] || 0) + inv.total;
      });

      /* ---------------- PURCHASE (BILLS) ---------------- */
      const billSnap = await getDocs(
        query(
          collection(db, "bills"),
          where("ownerId", "==", authUser.uid)
        )
      );

      billSnap.docs.forEach((doc) => {
        const bill = doc.data();
        if (!bill.createdAt) return;

        let date;
        if (bill.createdAt?.toDate) {
          date = bill.createdAt.toDate();
        } else {
          date = new Date(bill.createdAt);
        }

        if (isNaN(date)) return;

        const month = date.toLocaleString("default", { month: "short" });
        purchaseMap[month] = (purchaseMap[month] || 0) + bill.total;
      });

      /* ---------------- MERGE DATA ---------------- */
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      const finalData = months.map((month) => ({
        month,
        sales: salesMap[month] || 0,
        purchase: purchaseMap[month] || 0,
      }));

      setChartData(finalData);
    };

    fetchData();
  }, [authUser?.uid]);

  return (
    <div className="bg-white rounded-xl shadow p-6 h-[350px]">
      <h3 className="text-lg font-semibold mb-4">
        Sales vs Purchase
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />

          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
          />

          <Legend />

          {/* Sales */}
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          {/* Purchase */}
          <Line
            type="monotone"
            dataKey="purchase"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
