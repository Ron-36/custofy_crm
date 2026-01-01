import { useState } from "react";
import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  CreditCard,
  ShoppingBag,
  Package,
  Warehouse,
  BarChart3,
  Settings,
  Building2,
  User,
  ChevronDown,
  Menu,
  X,
  PanelLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50
          h-screen bg-white border-r
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="text-xl font-bold text-indigo-600">
              Custofy
            </span>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block"
          >
            <PanelLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 text-sm space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} end/>
          <NavItem to="/dashboard/kanban" icon={Kanban} label="Kanban" collapsed={collapsed} />

          <Accordion
            label="Sales"
            icon={Users}
            isOpen={openMenu === "sales"}
            onClick={() => toggleMenu("sales")}
            collapsed={collapsed}
          >
            <SubNav to="/dashboard/sales/customers" label="Customers" icon={Users} collapsed={collapsed} />
            <SubNav to="/dashboard/sales/invoices" label="Invoices" icon={FileText} collapsed={collapsed} />
            <SubNav to="/dashboard/sales/paymentsreceived" label="Payments Received" icon={CreditCard} collapsed={collapsed} />
          </Accordion>

          <Accordion
            label="Purchase"
            icon={ShoppingBag}
            isOpen={openMenu === "purchase"}
            onClick={() => toggleMenu("purchase")}
            collapsed={collapsed}
          >
            <SubNav to="/dashboard/purchases/vendors" label="Vendors" icon={ShoppingBag} collapsed={collapsed} />
            <SubNav to="/dashboard/purchases/bills" label="Bills" icon={FileText} collapsed={collapsed} />
            <SubNav to="/dashboard/purchases/paymentsmade" label="Payments Made" icon={CreditCard} collapsed={collapsed} />
          </Accordion>

          <NavItem to="/dashboard/items" icon={Package} label="Items" collapsed={collapsed} />
          <NavItem to="/dashboard/inventory" icon={Warehouse} label="Inventory" collapsed={collapsed} />
          <NavItem to="/dashboard/reports" icon={BarChart3} label="Reports" collapsed={collapsed} />

          <Accordion
            label="Settings"
            icon={Settings}
            isOpen={openMenu === "settings"}
            onClick={() => toggleMenu("settings")}
            collapsed={collapsed}
          >
            <SubNav to="/dashboard/settings/adminprofile" label="Admin Profile" icon={User} collapsed={collapsed} />
            <SubNav to="/dashboard/settings/companyprofile" label="Company Profile" icon={Building2} collapsed={collapsed} />
          </Accordion>
        </nav>
      </aside>
    </>
  );
}

/* ---------- Components ---------- */

function NavItem({ to, icon: Icon, label, collapsed,end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-indigo-50"}`
      }
    >
      <Icon size={18} />
      {!collapsed && label}
    </NavLink>
  );
}

function SubNav({ to, icon: Icon, label, collapsed }) {
  if (collapsed) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg transition
        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-indigo-50"}`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}

function Accordion({ label, icon: Icon, isOpen, onClick, children, collapsed }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-50"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {!collapsed && label}
        </div>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {!collapsed && isOpen && (
        <div className="mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}
