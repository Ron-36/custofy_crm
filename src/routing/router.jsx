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
import AdminProfile from "../pages/AdminProfile";
import CompanyProfile from "../pages/dashboard/settings/CompanyProfile";
import AuthGuard from "../components/auth/AuthGuard";
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
        path: "items",
        element: <Items />,
      },
      {
        path: "sales/invoices",
        element: <Invoices />,
      },
      {
        path: "inventory",
        element: <Inventory />,
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
