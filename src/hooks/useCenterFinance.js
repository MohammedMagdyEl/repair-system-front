import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function useCenterFinance(centerName) {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resPayments] = await Promise.all([
        API.get("/orders?all=true"),
        API.get(`/payments/${centerName}`),
      ]);

      const rawOrders = resOrders.data.orders || resOrders.data;
      const centerOrders = rawOrders.filter(
        (o) => o.center === centerName
      );
      // 
      setOrders(centerOrders);
      setPayments(resPayments.data || []);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء جلب بيانات المركز");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (centerName) {
      loadData();
    }
  
  }, [centerName]);

  
  const doneOrders = orders.filter(
    (o) => o.status === "تم استلامه من المركز" || o.status === "تم تسليمه للعميل"
  );
  const totalCost = doneOrders
    .filter((o) => o.willBeRepaired !== "لا")
    .reduce((sum, o) => sum + (o.repairCost || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remainingAccount = totalCost - totalPaid;

  
  const addPayment = async (amount, receivedBy) => {
    try {
      await API.post("/payments", {
        centerName,
        amount: Number(amount),
        receivedBy,
      });
      toast.success("تم تسجيل الدفعة وخصمها من الحساب ✅");
      loadData(); 
      return true; 
    
    } catch (error) {
      toast.error("فشل تسجيل الدفعة");
      return false; 
    }
  };

  
  return {
    orders,
    doneOrders,
    payments,
    loading,
    totalCost,
    totalPaid,
    remainingAccount,
    addPayment,
    refreshData: loadData, 
  };
}