import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Kanban,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Real-time dashboards with interactive charts to track business performance.",
  },
  {
    icon: Kanban,
    title: "Kanban Boards",
    description:
      "Drag-and-drop kanban boards to manage tasks and workflows visually.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Manage customers, interactions, and relationships in one place.",
  },
  {
    icon: ShoppingCart,
    title: "Sales Tracking",
    description:
      "Track invoices, payments received, and your entire sales pipeline.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    description:
      "Monitor stock levels, manage items, and avoid inventory shortages.",
  },
  {
    icon: FileText,
    title: "Purchase Management",
    description:
      "Manage vendors, bills, and payments made with ease.",
  },
  {
    icon: TrendingUp,
    title: "Smart Reports",
    description:
      "Generate detailed reports for inventory, sales, and daily activity.",
  },
  {
    icon: Settings,
    title: "Easy Configuration",
    description:
      "Manage company details, settings, and admin profile easily.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-6 md:px-12 linear-gradient from-white to-gray-50"
    >
      {/* Section Header */}
      <div className="text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
          Powerful Features
        </h3>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Custofy CRM gives you everything you need to manage sales, customers,
          inventory, and business growth — all in one platform.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="
                p-6 rounded-2xl
                bg-white/70 backdrop-blur-md
                border border-gray-200
                shadow-sm
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300
                text-center
              "
            >
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-indigo-100">
                <Icon className="w-7 h-7 text-indigo-600" />
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>

              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
