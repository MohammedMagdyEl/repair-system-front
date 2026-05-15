import React, { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  "تم الاستلام",
  "تم نزوله للمركز",
  "تم استلامه من المركز",
  "تم تسليمه للعميل",
];

export default function OrderTableRow({
  o,
  centers,
  confirmUpdate,
  editDevice,
  editIssue,
  userRole,
}) {
  const [localCustomerName, setLocalCustomerName] = useState(o.customerName || "");
  const [localRepairCost, setLocalRepairCost] = useState(o.repairCost || 0);
  const [localFinalPrice, setLocalFinalPrice] = useState(o.finalPrice || 0);
  const [localIsContacted, setLocalIsContacted] = useState(o.isCustomerContacted || false);
  const [localWillBeRepaired, setLocalWillBeRepaired] = useState(o.willBeRepaired || "لم يحدد");

  useEffect(() => {
    setLocalCustomerName(o.customerName || "");
    setLocalRepairCost(o.repairCost || 0);
    setLocalFinalPrice(o.finalPrice || 0);
    setLocalIsContacted(o.isCustomerContacted || false);
    setLocalWillBeRepaired(o.willBeRepaired || "لم يحدد");
  }, [o]);

  return (
    <tbody className="group border-b hover:bg-slate-50 transition-colors cursor-default">
      {}
      <tr
        className={`${
          o.status === "تم تسليمه للعميل" 
            ? "bg-emerald-50/40 opacity-70" 
            : o.willBeRepaired === "لا"
              ? "bg-rose-50/60"
              : ""
        }`}
      >
        <td className="p-4 font-mono text-slate-400">
          <div className="text-slate-700 font-bold">
            {new Date(o.createdAt).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "numeric",
            })}
          </div>
          <div className="text-[10px] text-blue-500">
            {new Date(o.createdAt).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </td>
        <td className="p-4 font-bold w-40">
          <input
            value={localCustomerName}
            onChange={(e) => setLocalCustomerName(e.target.value)}
            onBlur={() => {
              if (localCustomerName !== o.customerName)
                confirmUpdate(o._id, { customerName: localCustomerName }, "اسم العميل");
            }}
            className="bg-transparent border-none w-full focus:ring-2 focus:ring-blue-100 rounded px-1 cursor-edit font-black outline-none"
          />
          <div className="text-[10px] font-normal text-slate-400 mt-1 px-1">
            {o.phoneNumber}
          </div>
        </td>
        <td className="p-4 text-center">
          <select
            value={o.center || ""}
            onChange={(e) =>
              confirmUpdate(o._id, { centerName: e.target.value }, "المركز")
            }
            className="border-none bg-slate-100 rounded-lg p-1 text-[10px] outline-none font-bold cursor-pointer"
          >
            <option value="">--</option>
            {centers
              .filter((c) => !c.isDeleted)
              .map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </select>
        </td>
        <td className="p-4 text-center">
          <select
            value={o.status}
            onChange={(e) =>
              confirmUpdate(o._id, { status: e.target.value }, "حالة الطلب")
            }
            className={`p-1 rounded-full text-[9px] font-black border-2 px-3 shadow-inner transition-colors
              ${
                o.status === "تم تسليمه للعميل"
                  ? "bg-green-100 text-green-700 border-green-500"
                  : o.status === "تم نزوله للمركز"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                  : o.status === "تم استلامه من المركز"
                  ? "bg-blue-100 text-blue-700 border-blue-500"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>

        <td className="p-4 text-center">
          <div className="flex flex-col gap-2 items-center">
            <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer bg-slate-50 border border-slate-200 px-2 py-1 rounded-md w-full justify-center shadow-sm hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={localIsContacted}
                onChange={(e) => confirmUpdate(o._id, { isCustomerContacted: e.target.checked }, "التواصل مع العميل")}
                className="w-3 h-3 text-blue-600 rounded border-slate-300"
              />
              تم التواصل
            </label>
            <select
              value={localWillBeRepaired}
              onChange={(e) => confirmUpdate(o._id, { willBeRepaired: e.target.value }, "قرار الإصلاح")}
              className={`border p-1 rounded-md text-[10px] outline-none font-bold shadow-sm w-full cursor-pointer transition-colors
                ${localWillBeRepaired === "نعم" ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : localWillBeRepaired === "لا" ? "bg-rose-50 text-rose-700 border-rose-200" 
                : "bg-slate-50 text-slate-500 border-slate-200"}`}
            >
              <option value="لم يحدد">لم يحدد (القرار؟)</option>
              <option value="نعم">نعم (موافق) ✅</option>
              <option value="لا">لا (مرفوض) ❌</option>
            </select>
          </div>
        </td>
        {userRole === "Admin" && (
          <td className="p-4 text-center">
            <input
              type="number"
              value={localRepairCost}
              onChange={(e) => setLocalRepairCost(e.target.value)}
              onBlur={() => {
                if (Number(localRepairCost) !== o.repairCost)
                  confirmUpdate(o._id, { repairCost: Number(localRepairCost) }, "التكلفة");
              }}
              className="border-b border-dashed w-16 p-1 text-center font-bold text-slate-700 outline-none focus:border-blue-400 bg-transparent"
            />
          </td>
        )}
        {userRole === "Admin" && (
          <td className="p-4 text-center text-emerald-600 font-black">
            {o.profit} <small>ج.م</small>
          </td>
        )}
        <td className="p-4 text-center bg-blue-50/20">
          <input
            type="number"
            value={localFinalPrice}
            onChange={(e) => setLocalFinalPrice(e.target.value)}
            onBlur={() => {
              if (Number(localFinalPrice) !== o.finalPrice)
                confirmUpdate(o._id, { finalPrice: Number(localFinalPrice) }, "الإجمالي");
            }}
            className="border-b border-dashed w-16 p-1 text-center font-black text-blue-900 outline-none focus:border-blue-400 bg-transparent"
          />
        </td>
      </tr>

      {}
      <tr
        className={`${
          o.status === "تم تسليمه للعميل" 
            ? "bg-emerald-50/20 opacity-70" 
            : o.willBeRepaired === "لا"
              ? "bg-rose-50/30"
              : "bg-slate-50/50"
        }`}
      >
        <td colSpan={userRole === "Admin" ? 8 : 6} className="p-0 border-none">
          <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <div className="overflow-hidden">
              <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
                {}
                <div
                  onClick={() => editDevice(o._id, o.device)}
                  className="flex items-center gap-2 w-full cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-indigo-100 transition-all shadow-sm"
                >
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full whitespace-nowrap">
                    نوع الجهاز 📱
                  </span>
                  <p className="flex-1 text-[12px] text-slate-700 font-bold">
                    {o.device ? (
                      o.device
                    ) : (
                      <span className="text-slate-400 italic font-normal">
                        اضغط هنا لإضافة اسم الجهاز...
                      </span>
                    )}
                  </p>
                </div>

                {}
                <div
                  onClick={() => editIssue(o._id, o.issue)}
                  className="flex items-start gap-2 w-full cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-rose-100 transition-all shadow-sm"
                >
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full whitespace-nowrap mt-0.5">
                    تفاصيل العطل 🛠️
                  </span>
                  <p className="flex-1 text-[11px] text-slate-600 font-medium leading-relaxed pt-1">
                    {o.issue ? (
                      o.issue
                    ) : (
                      <span className="text-slate-400 italic">
                        اضغط هنا لوصف العطل وملاحظات الاستلام...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
