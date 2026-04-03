import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaIndustry, FaPercentage, FaPlus, FaTrash } from "react-icons/fa";

export default function Centers() {
  const [status, setStatus] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get("/status");
      setStatus(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("فشل في تحميل المراكز");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addStatus = async () => {
    if (!form.name) {
      return toast.error("برجاء إكمال البيانات");
    }

    try {
      await API.post("/status", {
        name: form.name,
      });
      toast.success("تم إضافة الحالة بنجاح ✅");
      setForm({ name: "" }); // تصفير الفورم
      load();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };

  // 🚀 إضافة ميزة المسح (اختياري)
  //   const deleteStatus = (id) => {
  //     Swal.fire({
  //       title: "هل أنت متأكد؟",
  //       text: "سيتم حذف المركز نهائياً!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#ef4444",
  //       confirmButtonText: "نعم، احذف",
  //       cancelButtonText: "إلغاء",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         await API.delete(`/centers/${id}`);
  //         toast.success("تم الحذف");
  //         load();
  //       }
  //     });
  //   };
  const deleteStatus = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف الحالة نهائياً!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/status/${id}`);
        toast.success("تم الحذف");
        load();
      }
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Toaster position="top-center" />

      <div className="flex items-center gap-3 mb-8">
        <FaIndustry className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-black text-slate-800">
          إدارة مراكز الصيانة
        </h2>
      </div>

      {/* 📥 نموذج الإضافة */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-10">
        <p className="text-slate-500 mb-4 font-bold text-sm">إضافة حالة جديد</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
              <FaIndustry />
            </span>
            <input
              className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm"
              placeholder="اسم الحالة "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <button
            onClick={addStatus}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            <FaPlus /> إضافة
          </button>
        </div>
      </div>

      {/* 📊 عرض المراكز */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {status.length > 0 ? (
          status.map((c) => (
            <div
              key={c._id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <FaIndustry className="text-xl" />
                </div>
                <button
                  onClick={() => deleteStatus(c._id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                  <FaTrash />
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">
                {c.name}
              </h3>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            لا توجد مراكز مسجلة حالياً
          </div>
        )}
      </div>
    </MainLayout>
  );
}
