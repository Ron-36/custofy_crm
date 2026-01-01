import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardLayout from "../components/layout/DashboardLaout";
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/dashboard/sales/Customers";
import Vendors from "../pages/dashboard/purchases/Vendors";
import Items from "../pages/dashboard/Items";
import Invoices from "../pages/dashboard/sales/Invoices";
import Bills from "../pages/dashboard/purchases/Bills";
import Inventory from "../pages/dashboard/Inventory";
import Kanban from "../pages/dashboard/Kanban";
import AdminProfile from "../pages/AdminProfile";
import CompanyProfile from "../pages/dashboard/settings/CompanyProfile";
import AuthGuard from "../components/auth/AuthGuard";
import PaymentsReceived from "../pages/dashboard/sales/PaymentsReceived";
import Paymentsmade from "../pages/dashboard/purchases/Paymentsmade";
import Reports from "../pages/dashboard/Reports";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: ( <AuthGuard>  <DashboardLayout /></AuthGuard>),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "kanban",
        element: <Kanban />,
      },
      {
        path: "sales/customers",
        element: <Customers />,
      },
      {
        path: "purchases/vendors",
        element: <Vendors />,
      },
      {
        path: "purchases/bills",
        element: <Bills />,
      },
      {
        path: "purchases/paymentsmade",
        element: <Paymentsmade />,
      },
      {
        path: "items",
        element: <Items />,
      },
      {
        path: "sales/invoices",
        element: <Invoices />,
      },
      {
        path: "sales/paymentsreceived",
        element: <PaymentsReceived />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings/adminprofile",
        element: <AdminProfile />,
      },
      {
        path: "settings/companyprofile",
        element: <CompanyProfile />,
      },
    ],
  },
]);
