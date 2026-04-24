// import { useEffect, useState } from "react";
// import MainLayout from "../layout/MainLayout";
// import API from "../services/api";
// import {
//   FaTools,
//   FaCheckCircle,
//   FaSpinner,
//   FaMoneyBillWave,
//   FaChartLine,
//   FaIndustry,
//   FaExclamationTriangle,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     API.get("/orders")
//       .then((res) => {
//         setOrders(res.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // --- الحسابات الإحصائية العامة ---
//   const total = orders.length;
//   const delivered = orders.filter(
//     (o) => o.status === "تم تسليمه للعميل",
//   ).length;
//   const inProgress = total - delivered;
//   const totalProfit = orders.reduce((sum, o) => sum + (o.profit || 0), 0);
//   const totalCost = orders.reduce((sum, o) => sum + (o.repairCost || 0), 0);
//   const completionRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

//   // --- تجميع بيانات المراكز (المنطق المطور) ---
//   const centersData = {};
//   orders.forEach((o) => {
//     if (!o.center) return;
//     if (!centersData[o.center]) {
//       centersData[o.center] = {
//         count: 0,
//         profit: 0,
//         cost: 0,
//         doneCount: 0,
//         doneCost: 0, // صيانة تمت ✅
//         pendingCount: 0,
//         pendingCost: 0, // صيانة لسه 🛠️
//       };
//     }
//     centersData[o.center].count += 1;
//     centersData[o.center].profit += o.profit || 0;
//     centersData[o.center].cost += o.repairCost || 0;

//     // تقسيم الحالات: (تم استلامه من المركز أو تم تسليمه = خلصت)
//     if (
//       o.status === "تم استلامه من المركز" ||
//       o.status === "تم تسليمه للعميل"
//     ) {
//       centersData[o.center].doneCount += 1;
//       centersData[o.center].doneCost += o.repairCost || 0;
//     } else {
//       // أي حالة تانية تعتبر لسه في الطريق أو في المركز
//       centersData[o.center].pendingCount += 1;
//       centersData[o.center].pendingCost += o.repairCost || 0;
//     }
//   });

//   if (loading)
//     return (
//       <MainLayout>
//         <div className="p-10 text-center font-bold">جاري تحميل البيانات...</div>
//       </MainLayout>
//     );

//   return (
//     <MainLayout>
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//           📊 لوحة التحكم والتقارير
//         </h2>
//         <div className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
//           تحديث تلقائي:{" "}
//           <span className="font-bold text-blue-600">
//             {new Date().toLocaleDateString("ar-EG")}
//           </span>
//         </div>
//       </div>

//       {/* --- الصف الأول: ملخص الحالات --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <SummaryCard
//           title="إجمالي المواتير"
//           value={total}
//           icon={<FaTools />}
//           bgColor="bg-gradient-to-br from-indigo-500 to-indigo-700"
//           footer={`نسبة الإنجاز الحالية: ${completionRate}%`}
//         />
//         <SummaryCard
//           title="تم التسليم"
//           value={delivered}
//           icon={<FaCheckCircle />}
//           bgColor="bg-gradient-to-br from-green-500 to-green-700"
//           footer="جاهز تماماً للاستلام"
//         />
//         <SummaryCard
//           title="قيد التنفيذ"
//           value={inProgress}
//           icon={<FaSpinner className="animate-spin" />}
//           bgColor="bg-gradient-to-br from-amber-500 to-amber-600"
//           footer="موجودة حالياً بالورش"
//         />
//       </div>

//       {/* --- الصف الثاني: الأرقام المالية --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-red-500">
//           <div className="flex items-center gap-3 text-gray-500 mb-2">
//             <FaMoneyBillWave /> <p className="font-bold">إجمالي التكلفة</p>
//           </div>
//           <h3 className="text-2xl font-black">
//             {totalCost.toLocaleString()} <small>ج.م</small>
//           </h3>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-500">
//           <div className="flex items-center gap-3 text-gray-500 mb-2">
//             <FaChartLine /> <p className="font-bold">إجمالي الربح</p>
//           </div>
//           <h3 className="text-2xl font-black text-green-600">
//             {totalProfit.toLocaleString()} <small>ج.م</small>
//           </h3>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500">
//           <div className="flex items-center gap-3 text-gray-500 mb-2">
//             <FaTools /> <p className="font-bold">متوسط الربح/طلب</p>
//           </div>
//           <h3 className="text-2xl font-black text-blue-700">
//             {total > 0 ? (totalProfit / total).toFixed(0) : 0}{" "}
//             <small>ج.م</small>
//           </h3>
//         </div>
//       </div>

//       {/* --- قسم أداء المراكز المطور --- */}
//       <div className="mt-10">
//         <div className="flex items-center gap-3 mb-6 px-2">
//           <FaIndustry className="text-2xl text-gray-700" />
//           <h3 className="text-xl font-black text-gray-800">
//             🏭 أداء مراكز الصيانة بالتفصيل
//           </h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Object.keys(centersData).length > 0 ? (
//             Object.keys(centersData).map((center) => (

//               <div
//                 key={center}
//                 className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden"
//               >
//                 <h4 className="font-black text-lg mb-4 text-indigo-900 pb-2 border-b flex justify-between items-center">
//                   {center}
//                   <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs">
//                     الكل: {centersData[center].count}
//                   </span>
//                 </h4>

//                 <div className="space-y-4">
//                   {/* تفاصيل الصيانة (تمت vs لسه) بالأحمر كما طلبت */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
//                       <p className="text-[10px] text-slate-500 font-bold mb-1">
//                         صيانة تمت ✅
//                       </p>
//                       <p className="text-lg font-black text-slate-800">
//                         {centersData[center].doneCount}
//                       </p>
//                       <p className="text-[14px] text-red-600 font-black mt-1 ">
//                         ت: {centersData[center].doneCost.toLocaleString()} ج.م
//                       </p>
//                     </div>
//                     <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
//                       <p className="text-[10px] text-slate-500 font-bold mb-1">
//                         صيانة لسه 🛠️
//                       </p>
//                       <p className="text-lg font-black text-slate-800">
//                         {centersData[center].pendingCount}
//                       </p>
//                       <p className="text-[14px] text-red-600 font-black mt-1">
//                         ت: {centersData[center].pendingCost.toLocaleString()}{" "}
//                         ج.م
//                       </p>
//                     </div>
//                   </div>

//                   {/* الإجماليات */}
//                   <div className="pt-2 border-t border-slate-50">
//                     <div className="flex justify-between items-center text-xs mb-2">
//                       <span className="text-gray-400 font-bold">
//                         إجمالي التكلفة بالمركز:
//                       </span>
//                       <span className="font-bold text-red-700 text-lg ">
//                         {centersData[center].cost.toLocaleString()} ج.م
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center bg-green-50 p-3 rounded-2xl">
//                       <span className="text-green-800 font-black text-xs">
//                         صافي ربح المحل:
//                       </span>
//                       <span className="font-black text-green-700 text-lg">
//                         {centersData[center].profit.toLocaleString()}{" "}
//                         <small className="text-[10px]">ج.م</small>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 italic px-2">
//               لا توجد بيانات مراكز مرتبطة بطلبات حالياً.
//             </p>
//           )}
//         </div>
//       </div>

//     </MainLayout>
//   );

// }

// function SummaryCard({ title, value, icon, bgColor, footer }) {
//   return (
//     <div
//       className={`${bgColor} p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group `}
//     >
//       <div className="relative z-10">
//         <p className="text-white/80 font-medium mb-1">{title}</p>
//         <h3 className="text-4xl font-black">{value}</h3>
//         <p className="mt-4 text-[10px] text-white/60 font-light uppercase tracking-wider">
//           {footer}
//         </p>
//       </div>
//       <div className="absolute top-4 left-4 text-6xl text-white/10 group-hover:scale-110 transition-transform">
//         {icon}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";
import {
  FaTools,
  FaCheckCircle,
  FaSpinner,
  FaMoneyBillWave,
  FaChartLine,
  FaIndustry,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // أداة التنقل بين الصفحات

  useEffect(() => {
    API.get("/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- الحسابات الإحصائية العامة ---
  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "تم تسليمه للعميل").length;
  const inProgress = total - delivered;
  const totalProfit = orders.reduce((sum, o) => sum + (o.profit || 0), 0);
  const totalCost = orders.reduce((sum, o) => sum + (o.repairCost || 0), 0);
  const completionRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

  // --- تجميع بيانات المراكز (المنطق المطور) ---
  const centersData = {};
  orders.forEach((o) => {
    if (!o.center) return;
    if (!centersData[o.center]) {
      centersData[o.center] = {
        count: 0,
        profit: 0,
        cost: 0,
        doneCount: 0,
        doneCost: 0, 
        pendingCount: 0,
        pendingCost: 0, 
      };
    }
    centersData[o.center].count += 1;
    centersData[o.center].profit += o.profit || 0;
    centersData[o.center].cost += o.repairCost || 0;

    // تقسيم الحالات: (تم استلامه من المركز أو تم تسليمه = خلصت)
    if (o.status === "تم استلامه من المركز" || o.status === "تم تسليمه للعميل") {
      centersData[o.center].doneCount += 1;
      centersData[o.center].doneCost += o.repairCost || 0;
    } else {
      centersData[o.center].pendingCount += 1;
      centersData[o.center].pendingCost += o.repairCost || 0;
    }
  });

  if (loading)
    return (
      <MainLayout>
        <div className="p-10 text-center font-bold">جاري تحميل البيانات...</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      {/* العنوان العلوي */}
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          📊 لوحة التحكم والتقارير
        </h2>
        <div className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 font-bold">
          {new Date().toLocaleDateString("ar-EG")}
        </div>
      </div>

      {/* --- الصف الأول: ملخص الحالات --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="إجمالي المواتير"
          value={total}
          icon={<FaTools />}
          bgColor="bg-gradient-to-br from-indigo-500 to-indigo-700"
          footer={`نسبة الإنجاز: ${completionRate}%`}
        />
        <SummaryCard
          title="تم التسليم"
          value={delivered}
          icon={<FaCheckCircle />}
          bgColor="bg-gradient-to-br from-green-500 to-green-700"
          footer="جاهز تماماً للاستلام"
        />
        <SummaryCard
          title="قيد التنفيذ"
          value={inProgress}
          icon={<FaSpinner className="animate-spin" />}
          bgColor="bg-gradient-to-br from-amber-500 to-amber-600"
          footer="موجودة حالياً بالورش"
        />
      </div>

      {/* --- الصف الثاني: الأرقام المالية --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaMoneyBillWave /> <p className="font-bold">إجمالي التكلفة</p>
          </div>
          <h3 className="text-2xl font-black">
            {totalCost.toLocaleString()} <small className="text-xs">ج.م</small>
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaChartLine /> <p className="font-bold">إجمالي الربح</p>
          </div>
          <h3 className="text-2xl font-black text-green-600">
            {totalProfit.toLocaleString()} <small className="text-xs">ج.م</small>
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaTools /> <p className="font-bold">متوسط الربح/طلب</p>
          </div>
          <h3 className="text-2xl font-black text-blue-700">
            {total > 0 ? (totalProfit / total).toFixed(0) : 0}{" "}
            <small className="text-xs">ج.م</small>
          </h3>
        </div>
      </div>

      {/* --- قسم أداء المراكز (الكارت بالكامل قابل للضغط) --- */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6 px-2">
          <FaIndustry className="text-2xl text-gray-700" />
          <h3 className="text-xl font-black text-gray-800">
            🏭 أداء مراكز الصيانة (اضغط للتفاصيل)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(centersData).length > 0 ? (
            Object.keys(centersData).map((center) => (
              <div
                key={center}
                onClick={() => navigate(`/centers/${center}`)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-300 transition-all group cursor-pointer active:scale-95"
              >
                <h4 className="font-black text-lg mb-4 text-indigo-900 pb-2 border-b flex justify-between items-center group-hover:text-indigo-600">
                  {center}
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs">
                    الكل: {centersData[center].count}
                  </span>
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold mb-1">صيانة تمت ✅</p>
                      <p className="text-lg font-black text-slate-800">{centersData[center].doneCount}</p>
                      <p className="text-[14px] text-red-600 font-black mt-1">ت: {centersData[center].doneCost.toLocaleString()} ج.م</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold mb-1">صيانة لسه 🛠️</p>
                      <p className="text-lg font-black text-slate-800">{centersData[center].pendingCount}</p>
                      <p className="text-[14px] text-red-600 font-black mt-1">ت: {centersData[center].pendingCost.toLocaleString()} ج.م</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-gray-400 font-bold">إجمالي التكلفة:</span>
                      <span className="font-bold text-red-700 text-lg">{centersData[center].cost.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-2xl group-hover:bg-green-100 transition-colors">
                      <span className="text-green-800 font-black text-xs">صافي ربح المحل:</span>
                      <span className="font-black text-green-700 text-lg">
                        {centersData[center].profit.toLocaleString()} <small className="text-[10px]">ج.م</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic px-2 font-bold">لا توجد مراكز حالياً...</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// مكون فرعي للكروت العلوية
function SummaryCard({ title, value, icon, bgColor, footer }) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group`}>
      <div className="relative z-10">
        <p className="text-white/80 font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-black">{value}</h3>
        <p className="mt-4 text-[10px] text-white/60 font-light uppercase tracking-wider">{footer}</p>
      </div>
      <div className="absolute top-4 left-4 text-6xl text-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  );
}