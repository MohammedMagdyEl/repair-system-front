import React from "react";
import OrderTableRow from "./OrderTableRow";

export default function OrdersTable({
  orders,
  centers,
  loading,
  lastElementRef,
  confirmUpdate,
  editDevice,
  editIssue,
  userRole,
}) {
  const isAdmin = userRole === "Admin";

  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 pb-10">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-900 text-white font-bold">
          <tr>
            <th className="p-4 w-28">التاريخ والوقت</th>
            <th className="p-4">العميل / الهاتف</th>
            <th className="p-4 text-center">المركز</th>
            <th className="p-4 text-center">الحالة</th>
            <th className="p-4 text-center">التواصل وقرار الإصلاح</th>
            {isAdmin && <th className="p-4 text-center">التكلفة</th>}
            {isAdmin && <th className="p-4 text-center">الربح</th>}
            <th className="p-4 text-center">الإجمالي</th>
          </tr>
        </thead>

        {orders.length > 0 ? (
          orders.map((o, index) => {
            const isLast = orders.length === index + 1;
            const row = (
              <OrderTableRow
                key={o._id}
                o={o}
                centers={centers}
                confirmUpdate={confirmUpdate}
                editDevice={editDevice}
                editIssue={editIssue}
                userRole={userRole}
              />
            );
            if (isLast) {
              return (
                <React.Fragment key={o._id}>
                  {row}
                  <tbody>
                    <tr ref={lastElementRef} />
                  </tbody>
                </React.Fragment>
              );
            }
            return row;
          })
        ) : (
          !loading && (
            <tbody>
              <tr>
                <td colSpan={isAdmin ? 8 : 6} className="p-10 text-center text-slate-400 italic">
                  لا توجد طلبات تطابق اختياراتك...
                </td>
              </tr>
            </tbody>
          )
        )}
      </table>

      {loading && (
        <div className="flex justify-center items-center gap-3 p-6 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
          <span className="font-bold">جاري التحميل...</span>
        </div>
      )}
    </div>
  );
}
