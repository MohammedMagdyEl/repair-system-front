import React from "react";

const STATUS_OPTIONS = [
  "تم الاستلام",
  "تم نزوله للمركز",
  "تم استلامه من المركز",
  "تم تسليمه للعميل",
];

export default function OrdersFilters({
  searchTerm,
  setSearchTerm,
  selectedCenter,
  setSelectedCenter,
  selectedStatus,
  setSelectedStatus,
  centers,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-2">
      <h2 className="text-2xl font-black text-slate-800">📋 سجل الصيانات</h2>

      <div className="flex flex-wrap gap-2 justify-center">
        <input
          className="border p-2 rounded-xl text-xs w-48 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          placeholder="بحث بالاسم أو الرقم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-xl text-[10px] bg-white shadow-sm outline-none"
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
        >
          <option value="">كل المراكز 🏭</option>
          {centers
            .filter((c) => !c.isDeleted)
            .map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
        </select>
        <select
          className="border p-2 rounded-xl text-[10px] bg-white shadow-sm outline-none"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">كل الحالات 🔄</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
