export default function Hero() {
  return (
    <section className="text-center py-20 px-6 bg-gray-50">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Manage Customers Smarter with <span className="text-indigo-600">Custofy CRM</span>
      </h2>

      <p className="max-w-2xl mx-auto text-gray-600 mb-8">
        Custofy CRM helps businesses track leads, close deals faster,
        and build long-lasting customer relationships.
      </p>

      <div className="flex justify-center gap-4">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Start Free Trial
        </button>
        <button className="border px-6 py-3 rounded-lg">
          View Demo
        </button>
      </div>
    </section>
  );
}
