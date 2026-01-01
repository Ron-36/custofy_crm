import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { useSelector } from "react-redux";

/* ---------------- HELPERS ---------------- */

// Convert Firestore timestamp → Month name
const getMonthName = (date) => {
  return date.toLocaleString("default", { month: "short" });
};

export default function MonthlyRevenueChart() {
  const { authUser } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  /* ---------------- FETCH & CALCULATE ---------------- */

  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchRevenue = async () => {
      const q = query(
        collection(db, "invoices"),
        where("ownerId", "==", authUser.uid),
        where("status", "==", "Saved")
      );

      const snap = await getDocs(q);

      /*
        revenueMap = {
          Jan: 45000,
          Feb: 62000
        }
      */
      const revenueMap = {};

      snap.docs.forEach((doc) => {
        const invoice = doc.data();
        if (!invoice.createdAt) return;

        let date;

        if (invoice.createdAt?.toDate) {
          date = invoice.createdAt.toDate();
        } else {
          date = new Date(invoice.createdAt);
        }

        if (isNaN(date)) return;

        const month = date.toLocaleString("default", { month: "short" });

        revenueMap[month] = (revenueMap[month] || 0) + invoice.total;
      });

      // Convert object → array for Recharts
      const chartData = Object.keys(revenueMap).map((month) => ({
        month,
        revenue: revenueMap[month],
      }));

      setData(chartData);
    };

    fetchRevenue();
  }, [authUser?.uid]);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-xl shadow p-4 h-[350px]">
      <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />

          <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
