// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import MainLayout from "../layout/MainLayout";
// import API from "../services/api";
// import { FaUser, FaHistory, FaMoneyBillAlt, FaCheckCircle } from "react-icons/fa";

// export default function CenterDetails() {
//   const { centerName } = useParams(); // بناخد اسم المركز من الرابط
//   const [orders, setOrders] = useState([]);
//   const [payments, setPayments] = useState(0); // الفلوس اللي المركز أخدها
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get("/orders")
//       .then((res) => {
//         // فلترة المواتير الخاصة بهذا المركز فقط
//         const centerOrders = res.data.filter((o) => o.center === centerName);
//         setOrders(centerOrders);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [centerName]);

//   // تقسيم المواتير
//   const doneOrders = orders.filter(
//     (o) =>
//       o.status === "تم استلامه من المركز" || o.status === "تم تسليمه للعميل",
//   );
//   const pendingOrders = orders.filter(
//     (o) =>
//       o.status !== "تم استلامه من المركز" && o.status !== "تم تسليمه للعميل",
//   );

//   // الحسابات الممالية
//   const totalCost = orders.reduce((sum, o) => sum + (o.repairCost || 0), 0);
//   const remainingAccount = totalCost - payments;

//   if (loading)
//     return (
//       <MainLayout>
//         <div className="p-10 text-center">جاري التحميل...</div>
//       </MainLayout>
//     );

//   return (
//     <MainLayout>
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h2 className="text-2xl font-black text-slate-800">
//           🏗️ كشف حساب: {centerName}
//         </h2>

//         {/* حقل إدخال المدفوعات للمركز */}
//         <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-4">
//           <div>
//             <p className="text-[10px] font-bold text-red-600">
//               خصم مبالغ مستلمة (سلف/حساب):
//             </p>
//             <input
//               type="number"
//               className="bg-white border-red-200 border rounded-lg p-1 font-bold text-red-700 outline-none w-32"
//               value={payments}
//               onChange={(e) => setPayments(Number(e.target.value))}
//             />
//           </div>
//           <div className="text-left">
//             <p className="text-[10px] font-bold text-slate-500">
//               صافي الحساب للمركز:
//             </p>
//             <p className="text-xl font-black text-red-700">
//               {remainingAccount.toLocaleString()} ج.م
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* جدول الصيانة الحالية (اللي لسه عنده) */}
//         <div className="bg-white rounded-3xl shadow-sm border p-6">
//           <h3 className="font-black text-orange-600 mb-4 flex items-center gap-2">
//             <FaHistory /> مواتير قيد الصيانة ({pendingOrders.length})
//           </h3>
//           <OrderTable data={pendingOrders} type="pending" />
//         </div>

//         {/* جدول الصيانة المنتهية (اللي استلمناها منه) */}
//         <div className="bg-white rounded-3xl shadow-sm border p-6">
//           <h3 className="font-black text-green-600 mb-4 flex items-center gap-2">
//             <FaCheckCircle /> مواتير تم الانتهاء منها ({doneOrders.length})
//           </h3>
//           <OrderTable data={doneOrders} type="done" />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// // مكون فرعي للجدول المصغر
// function OrderTable({ data, type }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-right text-sm">
//         <thead className="text-slate-400 text-xs border-b">
//           <tr>
//             <th className="pb-2">العميل</th>
//             <th className="pb-2">الماتور</th>
//             <th className="pb-2 text-center">التكلفة</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((o) => (
//             <tr
//               key={o._id}
//               className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
//             >
//               <td className="py-3 font-bold text-slate-700">
//                 <div className="flex items-center gap-2">
//                   <FaUser className="text-[10px] text-slate-300" />{" "}
//                   {o.customerName}
//                 </div>
//               </td>
//               <td className="py-3 text-slate-500 text-xs">{o.device}</td>
//               <td
//                 className={`py-3 text-center font-black ${type === "done" ? "text-slate-800" : "text-orange-600"}`}
//               >
//                 {o.repairCost} ج.م
//               </td>
//             </tr>
//           ))}
//           {data.length === 0 && (
//             <tr>
//               <td
//                 colSpan="3"
//                 className="py-10 text-center text-slate-300 italic"
//               >
//                 لا يوجد بيانات
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";
import {
  FaUser,
  FaHistory,
  FaCheckCircle,
  FaMoneyBillWave,
  FaArrowDown,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function CenterDetails() {
  const { centerName } = useParams();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]); // سجل الدفعات من الباك
  const [newPayment, setNewPayment] = useState({ amount: "", receivedBy: "" }); // دفع دفعة جديدة
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resOrders, resPayments] = await Promise.all([
        API.get("/orders"),
        API.get(`/payments/${centerName}`), // نفترض وجود Route في الباك لجلب مدفوعات مركز معين
      ]);

      const centerOrders = resOrders.data.filter(
        (o) => o.center === centerName,
      );
      setOrders(centerOrders);
      setPayments(resPayments.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [centerName]);

  // الحسابات المالية
  const totalCost = orders.reduce((sum, o) => sum + (o.repairCost || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remainingAccount = totalCost - totalPaid;

  const handleAddPayment = async () => {
    if (!newPayment.amount || !newPayment.receivedBy)
      return toast.error("أكمل بيانات الدفعة");

    try {
      await API.post("/payments", {
        centerName,
        amount: Number(newPayment.amount),
        receivedBy: newPayment.receivedBy,
        // الباك إيند هيضيف الـ givenBy من التوكن (Token)
      });
      toast.success("تم تسجيل الدفعة وخصمها من الحساب ✅");
      setNewPayment({ amount: "", receivedBy: "" });
      loadData(); // إعادة تحميل الداتا
    } catch (error) {
      toast.error("فشل تسجيل الدفعة");
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-10 text-center font-bold">
          جاري تحميل سجلات الاتحاد...
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Toaster />
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800">
          🏗️ كشف حساب: {centerName}
        </h2>
      </div>

      {/* --- لوحة الماليات --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-right">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <p className="text-xs text-slate-400 mb-1">
            إجمالي تكلفة المواتير (المستحق):
          </p>
          <h3 className="text-2xl font-black">
            {totalCost.toLocaleString()} ج.م
          </h3>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl">
          <p className="text-xs text-emerald-100 mb-1">
            إجمالي ما تم دفعه للمركز:
          </p>
          <h3 className="text-2xl font-black">
            {totalPaid.toLocaleString()} ج.م
          </h3>
        </div>
        <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl border-4 border-red-200">
          <p className="text-xs text-red-100 mb-1">
            صافي المتبقي للمركز حالياً:
          </p>
          <h3 className="text-3xl font-black">
            {remainingAccount.toLocaleString()} ج.م
          </h3>
        </div>
      </div>

      {/* --- فورم إضافة دفعة جديدة --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 mb-8">
        <h3 className="font-black mb-4 flex items-center gap-2 text-slate-700">
          <FaMoneyBillWave className="text-green-500" /> تسجيل دفعة نقدية للمركز
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">
              المبلغ بالجنيه
            </label>
            <input
              type="number"
              className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-green-400 w-32"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, amount: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">
              اسم المستلم من المركز
            </label>
            <input
              type="text"
              className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-green-400 w-64"
              placeholder="مثلاً: م. أحمد علي"
              value={newPayment.receivedBy}
              onChange={(e) =>
                setNewPayment({ ...newPayment, receivedBy: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddPayment}
            className="bg-green-600 text-white px-8 py-2 rounded-xl font-black hover:bg-green-700 transition-all"
          >
            تأكيد الدفع والخصم
          </button>
        </div>
      </div>

      {/* --- الجداول (المواتير والدفعات) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <h3 className="font-black text-blue-600 mb-4 flex items-center gap-2">
            <FaHistory /> المواتير قيد الصيانة (
            {orders.filter((o) => o.status !== "تم تسليمه للعميل").length})
          </h3>
          <OrderTable
            data={orders.filter((o) => o.status !== "تم تسليمه للعميل")}
            type="pending"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <h3 className="font-black text-slate-700 mb-4 flex items-center gap-2">
            <FaArrowDown /> سجل المدفوعات التاريخي
          </h3>
          <PaymentTable data={payments} />
        </div>
      </div>
    </MainLayout>
  );
}

// جدول المدفوعات الجديد
function PaymentTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-3">التاريخ</th>
            <th className="p-3">المبلغ</th>
            <th className="p-3">المسلم (أنت)</th>
            <th className="p-3">المستلم (المركز)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">
                {new Date(p.createdAt).toLocaleDateString("ar-EG")}
              </td>
              <td className="p-3 font-black text-red-600">{p.amount} ج.م</td>
              <td className="p-3 font-bold">{p.givenBy}</td>
              <td className="p-3 font-bold text-slate-700">{p.receivedBy}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="p-10 text-center italic text-slate-300"
              >
                لا توجد دفعات مسجلة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// جدول الطلبات (كما هو مع تعديلات بسيطة للوضوح)
function OrderTable({ data }) {
  return (
    <table className="w-full text-right text-sm">
      <thead className="text-slate-400 text-xs border-b">
        <tr>
          <th>العميل</th>
          <th>الماتور</th>
          <th className="text-center">التكلفة</th>
        </tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o._id} className="border-b border-slate-50">
            <td className="py-3">
              <div className="font-bold text-slate-700">{o.customerName}</div>
              <div className="text-[10px] text-slate-400">{o.phoneNumber}</div>
            </td>
            <td className="py-3 text-xs">{o.device}</td>
            <td className="py-3 text-center font-black">{o.repairCost} ج.م</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
