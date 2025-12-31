import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content:
      "Custofy transformed how we manage our customer relationships. The analytics dashboard alone has helped us increase sales by 40%.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Operations Manager, RetailPro",
    content:
      "The inventory management feature is a game-changer. We never run out of stock anymore, and our purchasing process is streamlined.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Director, GrowthCo",
    content:
      "Best CRM we've ever used. The kanban boards help our team stay organized, and the reporting features are incredibly detailed.",
    rating: 5,
  },
];

const logos = [
  "TATA",
  "RELIANCE",
  "HDFC",
  "AIRTEL",
  "JSW",
  "ADANI",
];

export default function Customers() {
  return (
    <section
      id="customers"
      className="py-20 px-6 md:px-12 bg-white"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
          Trusted by Growing Teams
        </h3>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Thousands of businesses use Custofy CRM to manage customer
          relationships, track sales, and grow faster.
        </p>
      </div>

      {/* Testimonials */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="
              p-6 rounded-2xl
              border border-gray-200
              shadow-sm
              hover:shadow-lg transition
              bg-white
            "
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-indigo-100 mb-4" />

            {/* Content */}
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              “{testimonial.content}”
            </p>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-indigo-600 text-indigo-600"
                />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                {testimonial.name.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logos */}
      <div className="mt-16">
        <p className="text-center text-sm text-gray-500 mb-6">
          Trusted by fast-growing companies worldwide
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {logos.map((logo, index) => (
            <span
              key={index}
              className="text-gray-400 font-semibold text-lg"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
