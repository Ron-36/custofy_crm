import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { useSelector } from "react-redux";
import KpiCard from "../../components/dashboard/KpiCard";
import SalesPurchaseChart from "../../components/chart/SalesPurchaseChart";
import MonthlyRevenueChart from "../../components/chart/MonthlyRevenueChart";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  IndianRupee,
} from "lucide-react";

export default function Dashboard() {
  const { authUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalPurchase: 0,
    totalItems: 0,
    lowStock: 0,
  });

  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchDashboardData = async () => {
      setLoading(true);

      /* ---------------- TOTAL SALES ---------------- */
      const salesSnap = await getDocs(
        query(
          collection(db, "invoices"),
          where("ownerId", "==", authUser.uid),
          where("status", "==", "Saved")
        )
      );

      const totalSales = salesSnap.docs.reduce(
        (sum, d) => sum + (d.data().total || 0),
        0
      );

      /* ---------------- TOTAL PURCHASE ---------------- */
      const purchaseSnap = await getDocs(
        query(
          collection(db, "bills"),
          where("ownerId", "==", authUser.uid)
        )
      );

      const totalPurchase = purchaseSnap.docs.reduce(
        (sum, d) => sum + (d.data().total || 0),
        0
      );

      /* ---------------- TOTAL ITEMS ---------------- */
      const itemsSnap = await getDocs(
        query(
          collection(db, "items"),
          where("ownerId", "==", authUser.uid)
        )
      );

      const totalItems = itemsSnap.size;

      /* ---------------- LOW STOCK ---------------- */
      const inventorySnap = await getDocs(
        query(
          collection(db, "inventory"),
          where("ownerId", "==", authUser.uid)
        )
      );

      const lowStock = inventorySnap.docs.filter(
        (d) => (d.data().quantity || 0) <= 5
      ).length;

      setKpis({
        totalSales,
        totalPurchase,
        totalItems,
        lowStock,
      });

      setLoading(false);
    };

    fetchDashboardData();
  }, [authUser]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        
         
       <KpiCard
  title="Total Sales"
  value={`₹${kpis.totalSales.toLocaleString()}`}
  subtitle="Paid invoices"
  icon={IndianRupee}
/>

        <KpiCard
  title="Total Purchase"
  value={`₹${kpis.totalPurchase.toLocaleString()}`}
  subtitle="Bills amount"
  icon={ShoppingCart}
/>

<KpiCard
  title="Total Items"
  value={kpis.totalItems}
  subtitle="Active products"
  icon={TrendingUp}
/>

<KpiCard
  title="Low Stock"
  value={kpis.lowStock}
  subtitle="Qty ≤ 5"
  icon={Package}
/>
      </div>

      {/* PLACEHOLDERS FOR NEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesPurchaseChart/>

        <MonthlyRevenueChart />
      </div>

     

     
    </div>
  );
}
