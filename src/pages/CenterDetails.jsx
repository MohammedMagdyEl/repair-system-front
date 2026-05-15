

































import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import useCenterFinance from "../hooks/useCenterFinance"; 
import {
  FaHistory,
  FaMoneyBillWave,
  FaArrowDown,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function CenterDetails() {
  const { centerName } = useParams();
  
  
  const [newPayment, setNewPayment] = useState({ amount: "", receivedBy: "" });

  
  const {
    orders,
    doneOrders,
    payments,
    loading,
    totalCost,
    totalPaid,
    remainingAccount,
    addPayment,
  } = useCenterFinance(centerName);

  
  const statementHistory = [
    ...doneOrders.map(o => ({
      _id: o._id,
      type: "order",
      date: new Date(o.updatedAt || o.createdAt),
      amount: o.repairCost || 0,
      label: `صيانة: ${o.device} - ${o.customerName}`,
      giver: "المركز", 
      receiver: "أنت",
    })),
    ...payments.map(p => ({
      _id: p._id || Math.random().toString(), 
      type: "payment",
      date: new Date(p.createdAt),
      amount: p.amount || 0,
      label: "دفعة نقدية",
      giver: p.givenBy || "أنت", 
      receiver: p.receivedBy,
    }))
  ].sort((a, b) => b.date - a.date);

  
  const handleAddPayment = async () => {
    if (!newPayment.amount || !newPayment.receivedBy) {
      return toast.error("أكمل بيانات الدفعة");
    }

    
    const isSuccess = await addPayment(newPayment.amount, newPayment.receivedBy);
    
    
    if (isSuccess) {
      setNewPayment({ amount: "", receivedBy: "" });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-center font-bold">
          جاري تحميل سجلات {centerName}...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Toaster />
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800">
          🏗️ كشف حساب: {centerName}
        </h2>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-right">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <p className="text-xs text-slate-400 mb-1">إجمالي التكلفة (المستحق):</p>
          <h3 className="text-2xl font-black">{totalCost.toLocaleString()} ج.م</h3>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl">
          <p className="text-xs text-emerald-100 mb-1">إجمالي ما تم دفعه:</p>
          <h3 className="text-2xl font-black">{totalPaid.toLocaleString()} ج.م</h3>
        </div>
        <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl border-4 border-red-200">
          <p className="text-xs text-red-100 mb-1">صافي المتبقي للمركز:</p>
          <h3 className="text-3xl font-black">{remainingAccount.toLocaleString()} ج.م</h3>
        </div>
      </div>

      {}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 mb-8">
        <h3 className="font-black mb-4 flex items-center gap-2 text-slate-700">
          <FaMoneyBillWave className="text-green-500" /> تسجيل دفعة نقدية
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">المبلغ</label>
            <input
              type="number"
              className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-green-400 w-32"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">اسم المستلم</label>
            <input
              type="text"
              className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-green-400 w-64"
              value={newPayment.receivedBy}
              onChange={(e) => setNewPayment({ ...newPayment, receivedBy: e.target.value })}
            />
          </div>
          <button
            onClick={handleAddPayment}
            className="bg-green-600 text-white px-8 py-2 rounded-xl font-black hover:bg-green-700 transition-all"
          >
            تأكيد الدفع
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <h3 className="font-black text-blue-600 mb-4 flex items-center gap-2">
            <FaHistory /> المواتير قيد الصيانة ({orders.filter((o) => o.status !== "تم تسليمه للعميل").length})
          </h3>
          <OrderTable data={orders.filter((o) => o.status !== "تم تسليمه للعميل")} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <h3 className="font-black text-slate-700 mb-4 flex items-center gap-2">
            <FaArrowDown /> سجل الحساب المجمع (صيانة ودفعات)
          </h3>
          <StatementTable data={statementHistory} />
        </div>
      </div>
    </MainLayout>
  );
}




function StatementTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-3">التاريخ</th>
            <th className="p-3">البيان</th>
            <th className="p-3">دائن (للمركز)</th>
            <th className="p-3">مدين (تم دفعه)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-b hover:bg-slate-50 transition-colors">
              <td className="p-3 whitespace-nowrap">
                {row.date.toLocaleDateString("ar-EG")}
                <br />
                <span className="text-[9px] text-slate-400">
                  {row.date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </td>
              <td className="p-3">
                <div className="font-bold text-slate-700">{row.label}</div>
                <div className="text-[10px] text-slate-500">
                  {row.type === "payment" ? `استلمها: ${row.receiver}` : "قيمة صيانة"}
                </div>
              </td>
              <td className="p-3 font-black text-slate-800">
                {row.type === "order" ? `${row.amount} ج.م` : "-"}
              </td>
              <td className="p-3 font-black text-green-600">
                {row.type === "payment" ? `${row.amount} ج.م` : "-"}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="p-10 text-center italic text-slate-300"
              >
                لا توجد حركات مسجلة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


function OrderTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="text-slate-400 text-xs border-b">
          <tr>
            <th className="py-2">العميل</th>
            <th className="py-2">الماتور</th>
            <th className="py-2 text-center">التكلفة</th>
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
          {data.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="p-10 text-center italic text-slate-300"
              >
                لا يوجد مواتير قيد الصيانة حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

