

import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaIndustry,
  FaPercentage,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export default function Centers() {
  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState({ name: "", profitPercent: "" });
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [selectedId, setSelectedId] = useState(null); 

  const load = async () => {
    try {
      const res = await API.get("/centers");
      
      setCenters(res.data.filter((c) => !c.isDeleted));
    
    } catch (error) {
      toast.error("فشل في تحميل المراكز");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!form.name || !form.profitPercent)
      return toast.error("برجاء إكمال البيانات");

    try {
      if (isEditMode) {
        
        await API.put(`/centers/${selectedId}`, {
          name: form.name,
          profitPercent: Number(form.profitPercent),
        });
        toast.success("تم تحديث بيانات المركز بنجاح ✅");
      } else {
        
        await API.post("/centers", {
          name: form.name,
          profitPercent: Number(form.profitPercent),
        });
        toast.success("تم إضافة المركز بنجاح ✅");
      }

      resetForm(); 
      load(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ في العملية");
    }
  };

  
  const handleEditClick = (center) => {
    setIsEditMode(true);
    setSelectedId(center._id);
    setForm({ name: center.name, profitPercent: center.profitPercent });
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  
  const resetForm = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setForm({ name: "", profitPercent: "" });
  };

  
  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم إخفاء المركز من القائمة!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "تراجع",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          
          await API.patch(`/centers/delete/${id}`);
          toast.success("تم الحذف بنجاح");
          load();
        
        } catch (error) {
          toast.error("فشل الحذف");
        }
      }
    });
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-10 text-center font-bold">جاري التحميل...</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Toaster position="top-center" />

      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
          <FaIndustry className="text-2xl text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">
          إدارة مراكز الصيانة
        </h2>
      </div>

      {}
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-[32px] shadow-xl border mb-10 transition-all duration-500 ${isEditMode ? "bg-blue-50 border-blue-200 shadow-blue-100" : "bg-white border-slate-100"}`}
      >
        <p className="text-slate-500 mb-4 font-bold text-sm">
          {isEditMode ? "📝 تعديل بيانات المركز" : "➕ إضافة مركز جديد"}
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold shadow-sm transition-all"
            placeholder="اسم المركز (ورشة الأمل...)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="relative w-full md:w-48">
            <input
              type="number"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold shadow-sm transition-all"
              placeholder="الربح %"
              value={form.profitPercent}
              onChange={(e) =>
                setForm({ ...form, profitPercent: e.target.value })
              }
            />
            <FaPercentage className="absolute left-4 top-5 text-slate-300" />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${isEditMode ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"} text-white text-sm`}
            >
              {isEditMode ? (
                <>
                  <FaCheck /> حفظ التعديل
                </>
              ) : (
                <>
                  <FaPlus /> إضافة مركز
                </>
              )}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-slate-300 transition-all"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </form>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {centers.map((c) => (
          <div
            key={c._id}
            className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <FaIndustry className="text-xl" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditClick(c)}
                  className="text-slate-300 hover:text-blue-600 p-2 transition-all hover:scale-110"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-slate-300 hover:text-red-500 p-2 transition-all hover:scale-110"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{c.name}</h3>
            <div className="flex items-center gap-2 text-blue-600 font-black bg-blue-50/50 w-fit px-4 py-1.5 rounded-full mt-3 border border-blue-100">
              <span className="text-xs tracking-tight">
                {c.profitPercent}% ربح إضافي
              </span>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
