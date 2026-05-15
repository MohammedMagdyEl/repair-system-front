import { useState, useEffect, useRef, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [centers, setCenters] = useState([]);
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  
  const observer = useRef();
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadData = async (currentPage = page, append = false) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage,
        limit: 7, 
      });
      if (searchTerm) query.append("search", searchTerm);
      if (selectedCenter) query.append("center", selectedCenter);
      if (selectedStatus) query.append("status", selectedStatus);

      const [resOrders, resCenters] = await Promise.all([
        API.get(`/orders?${query.toString()}`),
        API.get("/centers"),
      ]);

      const newOrders = resOrders.data.orders || [];
      
      setOrders((prev) => (append ? [...prev, ...newOrders] : newOrders));
      setHasMore(resOrders.data.hasMore || false);
      setTotalPages(resOrders.data.totalPages || 1);
      if (!append) setCenters(resCenters.data || []);
    } catch (error) {
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); 
      loadData(1, false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  
  }, [searchTerm, selectedCenter, selectedStatus]);

  useEffect(() => {
    if (page > 1) {
      loadData(page, true); 
    }
  
  }, [page]);

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
          const response = await API.put(`/orders/assign/${id}`, data);
          toast.success("تم التحديث بنجاح ✅");
          setOrders((prev) => prev.map((o) => (o._id === id ? response.data : o)));
        } catch (err) {
          toast.error(err.response?.data?.message || "حدث خطأ أثناء التحديث");
        }
      } else {
        setOrders((prev) => [...prev]); 
      }
    });
  };

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

  return {
    orders,
    centers,
    searchTerm,
    setSearchTerm,
    selectedCenter,
    setSelectedCenter,
    selectedStatus,
    setSelectedStatus,
    loading,
    lastElementRef,
    confirmUpdate,
    editDevice,
    editIssue
  };
}
