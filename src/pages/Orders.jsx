// import { useEffect, useState } from "react";
// import MainLayout from "../layout/MainLayout";
// import API from "../services/api";
// import toast, { Toaster } from "react-hot-toast";
// import Swal from "sweetalert2";

// const STATUS_OPTIONS = [
//   "تم الاستلام",
//   "تم نزوله للمركز",
//   "تم استلامه من المركز",
//   "تم تسليمه للعميل",
// ];

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCenter, setSelectedCenter] = useState(""); // فلتر المركز
//   const [selectedStatus, setSelectedStatus] = useState(""); // فلتر الحالة
//   const [loading, setLoading] = useState(true); // حالة اللودينج

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [resOrders, resCenters] = await Promise.all([
//         API.get("/orders"),
//         API.get("/centers"),
//       ]);

//       // الترتيب: الجديد فوق، والمُسلم تحت خالص
//       const sorted = resOrders.data.sort((a, b) => {
//         if (a.status === "تم تسليمه للعميل" && b.status !== "تم تسليمه للعميل")
//           return 1;
//         if (a.status !== "تم تسليمه للعميل" && b.status === "تم تسليمه للعميل")
//           return -1;
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });

//       setOrders(sorted);
//       setCenters(resCenters.data);
//       // eslint-disable-next-line no-unused-vars
//     } catch (error) {
//       toast.error("فشل في تحميل البيانات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const confirmUpdate = (id, data, title) => {
//     Swal.fire({
//       title: `تأكيد ${title}`,
//       text: "هل تريد حفظ التغييرات الجديدة؟",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#ef4444",
//       confirmButtonText: "نعم، حفظ",
//       cancelButtonText: "تراجع",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await API.put(`/orders/assign/${id}`, data);
//           toast.success("تم التحديث بنجاح ✅");
//           loadData();
//           // eslint-disable-next-line no-unused-vars
//         } catch (err) {
//           toast.error("حدث خطأ أثناء التحديث");
//           loadData();
//         }
//       }
//     });
//   };

//   // 🔍 منطق الفلترة المجمع (الاسم + المركز + الحالة)
//   const filteredOrders = orders.filter((o) => {
//     const matchesSearch =
//       o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.phoneNumber.includes(searchTerm);
//     const matchesCenter = selectedCenter === "" || o.center === selectedCenter;
//     const matchesStatus = selectedStatus === "" || o.status === selectedStatus;
//     return matchesSearch && matchesCenter && matchesStatus;
//   });

//   return (
//     <MainLayout>
//       <Toaster position="top-center" />

//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-2">
//         <h2 className="text-2xl font-black text-slate-800">📋 سجل الصيانات</h2>

//         {/* أدوات البحث والفلترة */}
//         <div className="flex flex-wrap gap-2 justify-center">
//           <input
//             className="border p-2 rounded-xl text-xs w-48 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
//             placeholder="بحث بالاسم أو الرقم..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="border p-2 rounded-xl text-[10px] bg-white shadow-sm outline-none"
//             value={selectedCenter}
//             onChange={(e) => setSelectedCenter(e.target.value)}
//           >
//             <option value="">كل المراكز 🏭</option>
//             {centers
//               .filter((c) => !c.isDeleted)
//               .map((c) => (
//                 <option key={c._id} value={c.name}>
//                   {c.name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="border p-2 rounded-xl text-[10px] bg-white shadow-sm outline-none"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="">كل الحالات 🔄</option>
//             {STATUS_OPTIONS.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
//         <table className="w-full text-right text-xs">
//           <thead className="bg-slate-900 text-white font-bold">
//             <tr>
//               <th className="p-4">التاريخ والوقت</th>
//               <th className="p-4">العميل / الهاتف</th>
//               <th className="p-4 text-center">المركز</th>
//               <th className="p-4 text-center">الحالة</th>
//               <th className="p-4 text-center">التكلفة</th>
//               <th className="p-4 text-center">الربح</th>
//               <th className="p-4 text-center">الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               Array.from({ length: 6 }).map((_, i) => (
//                 <tr key={i} className="animate-pulse border-b">
//                   {Array.from({ length: 7 }).map((_, j) => (
//                     <td key={j} className="p-4">
//                       <div className="h-4 bg-gray-200 rounded"></div>
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : filteredOrders.length > 0 ? (
//               filteredOrders.map((o) => (
//                 <tr
//                   key={o._id}
//                   className={`border-b transition-all hover:bg-slate-50 ${o.status === "تم تسليمه للعميل" ? "bg-emerald-50/40 opacity-70" : ""}`}
//                 >
//                   <td className="p-4 font-mono text-slate-400">
//                     <div className="text-slate-700 font-bold">
//                       {new Date(o.createdAt).toLocaleDateString("ar-EG", {
//                         day: "numeric",
//                         month: "numeric",
//                       })}
//                     </div>
//                     <div className="text-[10px] text-blue-500">
//                       {new Date(o.createdAt).toLocaleTimeString("ar-EG", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </td>
//                   <td className="p-4 font-bold">
//                     <input
//                       defaultValue={o.customerName}
//                       onBlur={(e) => {
//                         if (e.target.value !== o.customerName)
//                           confirmUpdate(
//                             o._id,
//                             { customerName: e.target.value },
//                             "اسم العميل",
//                           );
//                       }}
//                       className="bg-transparent border-none w-full focus:ring-2 focus:ring-blue-100 rounded px-1 cursor-edit font-black"
//                     />
//                     <div className="text-[10px] font-normal text-slate-400 mt-1 px-1">
//                       {o.phoneNumber}
//                     </div>
//                   </td>
//                   <td className="p-4 text-center">
//                     <select
//                       value={o.center || ""}
//                       onChange={(e) =>
//                         confirmUpdate(
//                           o._id,
//                           { centerName: e.target.value },
//                           "المركز",
//                         )
//                       }
//                       className="border-none bg-slate-100 rounded-lg p-1 text-[10px] outline-none font-bold cursor-pointer"
//                     >
//                       <option value="">--</option>
//                       {centers
//                         .filter((c) => !c.isDeleted)
//                         .map((c) => (
//                           <option key={c._id} value={c.name}>
//                             {c.name}
//                           </option>
//                         ))}
//                     </select>
//                   </td>
//                   <td className="p-4 text-center">
//                     <select
//                       value={o.status}
//                       onChange={(e) =>
//                         confirmUpdate(
//                           o._id,
//                           { status: e.target.value },
//                           "حالة الطلب",
//                         )
//                       }
//                       className={`p-1 rounded-full text-[9px] font-black border-2 px-3 shadow-inner transition-colors
//                         ${
//                           o.status === "تم تسليمه للعميل"
//                             ? "bg-green-100 text-green-700 border-green-500"
//                             : o.status === "تم نزوله للمركز"
//                               ? "bg-yellow-100 text-yellow-700 border-yellow-500"
//                               : o.status === "تم استلامه من المركز"
//                                 ? "bg-blue-100 text-blue-700 border-blue-500"
//                                 : "bg-slate-100 text-slate-600 border-slate-300"
//                         }`}
//                     >
//                       {STATUS_OPTIONS.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="p-4 text-center">
//                     <input
//                       type="number"
//                       defaultValue={o.repairCost}
//                       onBlur={(e) => {
//                         if (Number(e.target.value) !== o.repairCost)
//                           confirmUpdate(
//                             o._id,
//                             { repairCost: e.target.value },
//                             "التكلفة",
//                           );
//                       }}
//                       className="border-b border-dashed w-16 p-1 text-center font-bold text-slate-700 outline-none focus:border-blue-400"
//                     />
//                   </td>
//                   <td className="p-4 text-center text-emerald-600 font-black">
//                     {o.profit} <small>ج.م</small>
//                   </td>
//                   <td className="p-4 text-center font-black text-blue-900 bg-blue-50/20">
//                     {o.finalPrice} <small>ج.م</small>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="p-10 text-center text-slate-400 italic"
//                 >
//                   لا توجد طلبات تطابق اختياراتك...
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </MainLayout>
//   );
// }


import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
  "تم الاستلام",
  "تم نزوله للمركز",
  "تم استلامه من المركز",
  "تم تسليمه للعميل",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resCenters] = await Promise.all([
        API.get("/orders"),
        API.get("/centers"),
      ]);

      const sorted = resOrders.data.sort((a, b) => {
        if (a.status === "تم تسليمه للعميل" && b.status !== "تم تسليمه للعميل")
          return 1;
        if (a.status !== "تم تسليمه للعميل" && b.status === "تم تسليمه للعميل")
          return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrders(sorted);
      setCenters(resCenters.data);
    } catch (error) {
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmUpdate = (id, data, title) => {
    Swal.fire({
      title: `تأكيد ${title}`,
      text: "هل تريد حفظ التغييرات الجديدة؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "نعم، حفظ",
      cancelButtonText: "تراجع",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.put(`/orders/assign/${id}`, data);
          toast.success("تم التحديث بنجاح ✅");
          loadData();
        } catch (err) {
          toast.error("حدث خطأ أثناء التحديث");
          loadData();
        }
      }
    });
  };

  // 👇 دالة تعديل اسم الجهاز
  const editDevice = (id, currentDevice) => {
    Swal.fire({
      title: "تعديل نوع الجهاز",
      input: "text",
      inputValue: currentDevice || "",
      inputPlaceholder: "مثال: iPhone 13 Pro Max",
      showCancelButton: true,
      confirmButtonText: "حفظ",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#3b82f6",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmUpdate(id, { device: result.value }, "نوع الجهاز");
      }
    });
  };

  // 👇 دالة تعديل تفاصيل العطل
  const editIssue = (id, currentIssue) => {
    Swal.fire({
      title: "تعديل تفاصيل العطل",
      input: "textarea",
      inputValue: currentIssue || "",
      inputPlaceholder: "اكتب تفاصيل وملاحظات العطل هنا...",
      showCancelButton: true,
      confirmButtonText: "حفظ",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#3b82f6",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmUpdate(id, { issue: result.value }, "تفاصيل العطل");
      }
    });
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phoneNumber.includes(searchTerm);
    const matchesCenter = selectedCenter === "" || o.center === selectedCenter;
    const matchesStatus = selectedStatus === "" || o.status === selectedStatus;
    return matchesSearch && matchesCenter && matchesStatus;
  });

  return (
    <MainLayout>
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-2">
        <h2 className="text-2xl font-black text-slate-800">📋 سجل الصيانات</h2>

        <div className="flex flex-wrap gap-2 justify-center">
          <input
            className="border p-2 rounded-xl text-xs w-48 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            placeholder="بحث بالاسم أو الرقم..."
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
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </select>
          <select
            className="border p-2 rounded-xl text-[10px] bg-white shadow-sm outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">كل الحالات 🔄</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 pb-10">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="p-4 w-28">التاريخ والوقت</th>
              <th className="p-4">العميل / الهاتف</th>
              <th className="p-4 text-center">المركز</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">التكلفة</th>
              <th className="p-4 text-center">الربح</th>
              <th className="p-4 text-center">الإجمالي</th>
            </tr>
          </thead>
          
          {loading ? (
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((o) => (
              <tbody 
                key={o._id} 
                className="group border-b hover:bg-slate-50 transition-colors cursor-default"
              >
                {/* ====== الصف الأول (البيانات الأساسية) ====== */}
                <tr className={`${o.status === "تم تسليمه للعميل" ? "bg-emerald-50/40 opacity-70" : ""}`}>
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
                      defaultValue={o.customerName}
                      onBlur={(e) => {
                        if (e.target.value !== o.customerName)
                          confirmUpdate(o._id, { customerName: e.target.value }, "اسم العميل");
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
                      onChange={(e) => confirmUpdate(o._id, { centerName: e.target.value }, "المركز")}
                      className="border-none bg-slate-100 rounded-lg p-1 text-[10px] outline-none font-bold cursor-pointer"
                    >
                      <option value="">--</option>
                      {centers.filter((c) => !c.isDeleted).map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={o.status}
                      onChange={(e) => confirmUpdate(o._id, { status: e.target.value }, "حالة الطلب")}
                      className={`p-1 rounded-full text-[9px] font-black border-2 px-3 shadow-inner transition-colors
                        ${o.status === "تم تسليمه للعميل" ? "bg-green-100 text-green-700 border-green-500"
                          : o.status === "تم نزوله للمركز" ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                          : o.status === "تم استلامه من المركز" ? "bg-blue-100 text-blue-700 border-blue-500"
                          : "bg-slate-100 text-slate-600 border-slate-300"}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      defaultValue={o.repairCost}
                      onBlur={(e) => {
                        if (Number(e.target.value) !== o.repairCost)
                          confirmUpdate(o._id, { repairCost: e.target.value }, "التكلفة");
                      }}
                      className="border-b border-dashed w-16 p-1 text-center font-bold text-slate-700 outline-none focus:border-blue-400 bg-transparent"
                    />
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-black">
                    {o.profit} <small>ج.م</small>
                  </td>
                  <td className="p-4 text-center font-black text-blue-900 bg-blue-50/20">
                    {o.finalPrice} <small>ج.م</small>
                  </td>
                </tr>

                {/* ====== الصف الثاني مع الترانزيشن السلس (يحتوي على الجهاز والعطل) ====== */}
                <tr className={`${o.status === "تم تسليمه للعميل" ? "bg-emerald-50/20 opacity-70" : "bg-slate-50/50"}`}>
                  <td colSpan="7" className="p-0 border-none">
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
                          
                          {/* 📱 جزء الجهاز */}
                          <div 
                            onClick={() => editDevice(o._id, o.device)}
                            className="flex items-center gap-2 w-full cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-indigo-100 transition-all shadow-sm"
                          >
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full whitespace-nowrap">
                              نوع الجهاز 📱
                            </span>
                            <p className="flex-1 text-[12px] text-slate-700 font-bold">
                              {o.device ? o.device : <span className="text-slate-400 italic font-normal">اضغط هنا لإضافة اسم الجهاز...</span>}
                            </p>
                          </div>

                          {/* 🛠️ جزء العطل */}
                          <div 
                            onClick={() => editIssue(o._id, o.issue)}
                            className="flex items-start gap-2 w-full cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-rose-100 transition-all shadow-sm"
                          >
                            <span className="text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full whitespace-nowrap mt-0.5">
                              تفاصيل العطل 🛠️
                            </span>
                            <p className="flex-1 text-[11px] text-slate-600 font-medium leading-relaxed pt-1">
                              {o.issue ? o.issue : <span className="text-slate-400 italic">اضغط هنا لوصف العطل وملاحظات الاستلام...</span>}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="p-10 text-center text-slate-400 italic">
                  لا توجد طلبات تطابق اختياراتك...
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </MainLayout>
  );
}
