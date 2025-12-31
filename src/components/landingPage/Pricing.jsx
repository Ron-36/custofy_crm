import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "₹299",
    period: "/month",
    description: "Perfect for small businesses just getting started.",
    features: [
      "Up to 500 customers",
      "Basic analytics dashboard",
      "Invoice management",
      "Email support",
      "1 user account",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹499",
    period: "/month",
    description: "For growing businesses that need more power.",
    features: [
      "Up to 5,000 customers",
      "Advanced analytics & reports",
      "Kanban boards",
      "Inventory management",
      "Priority support",
      "5 user accounts",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹699",
    period: "/month",
    description: "For large organizations with complex needs.",
    features: [
      "Unlimited customers",
      "Custom reports & dashboards",
      "Advanced automation",
      "Multi-location inventory",
      "24/7 dedicated support",
      "Unlimited users",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-6 md:px-12 bg-gray-50"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
          Simple & Transparent Pricing
        </h3>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Choose a plan that fits your business needs. Upgrade or downgrade at
          any time as your business grows.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              relative p-8 rounded-2xl bg-white
              border shadow-sm
              flex flex-col
              ${
                plan.popular
                  ? "border-indigo-600 scale-105 shadow-lg"
                  : "border-gray-200"
              }
            `}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            {/* Plan Info */}
            <h4 className="text-xl font-bold text-gray-900">
              {plan.name}
            </h4>

            <p className="text-gray-600 mt-2 text-sm">
              {plan.description}
            </p>

            <div className="mt-6 flex items-end">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-500 ml-1">
                {plan.period}
              </span>
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to="/login"
              className={`
                mt-8 inline-flex items-center justify-center
                rounded-lg py-3 text-sm font-medium transition
                ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
