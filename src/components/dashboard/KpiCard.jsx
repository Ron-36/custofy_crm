export default function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      {/* ICON */}
      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={22} />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
