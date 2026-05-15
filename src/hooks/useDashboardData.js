import { useState, useEffect } from "react";
import API from "../services/api";

export default function useDashboardData() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resPayments] = await Promise.all([
        API.get("/orders?all=true"),
        API.get("/payments").catch(() => ({ data: [] })),
      ]);
      setOrders(resOrders.data.orders || resOrders.data);
      setPayments(resPayments.data || []);
    } catch (error) {
      console.error("خطأ في جلب بيانات لوحة التحكم:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const centersData = {};
  let globalDoneCost = 0; 

  
  orders.forEach((o) => {
    if (!o.center) return;
    if (!centersData[o.center]) {
      centersData[o.center] = {
        count: 0,
        profit: 0,
        doneCount: 0,
        doneCost: 0,
        pendingCount: 0,
        pendingCost: 0,
        totalPaid: 0,
        remainingAccount: 0,
      };
    }

    centersData[o.center].count += 1;

    
    if (o.willBeRepaired === "لا") return;

    
    if (o.status === "تم استلامه من المركز" || o.status === "تم تسليمه للعميل") {
      centersData[o.center].doneCount += 1;
      centersData[o.center].doneCost += o.repairCost || 0;
      centersData[o.center].profit += o.profit || 0;
      globalDoneCost += o.repairCost || 0;
    } else {
      centersData[o.center].pendingCount += 1;
      centersData[o.center].pendingCost += o.repairCost || 0;
    }
  });

  let globalTotalPaid = 0;

  
  payments.forEach((p) => {
    globalTotalPaid += p.amount || 0;
    if (p.centerName && centersData[p.centerName]) {
      centersData[p.centerName].totalPaid += p.amount || 0;
    }
  });

  
  Object.keys(centersData).forEach((center) => {
    centersData[center].remainingAccount =
      centersData[center].doneCost - centersData[center].totalPaid;
  });

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "تم تسليمه للعميل").length,
    inProgress: orders.length - orders.filter((o) => o.status === "تم تسليمه للعميل").length,
    totalProfit: orders.filter((o) => o.willBeRepaired !== "لا" && (o.status === "تم استلامه من المركز" || o.status === "تم تسليمه للعميل")).reduce((sum, o) => sum + (o.profit || 0), 0),
    globalRemaining: globalDoneCost - globalTotalPaid, 
    completionRate: orders.length > 0 ? ((orders.filter((o) => o.status === "تم تسليمه للعميل").length / orders.length) * 100).toFixed(1) : 0
  };

  return { loading, stats, centersData, refreshData: fetchData };
}