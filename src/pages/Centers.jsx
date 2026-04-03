// import { useState, useEffect } from "react";
// import MainLayout from "../layout/MainLayout";
// import API from "../services/api";
// import toast, { Toaster } from "react-hot-toast";
// import Swal from "sweetalert2";
// import { FaIndustry, FaPercentage, FaPlus, FaTrash } from "react-icons/fa";

// export default function Centers() {
//   const [centers, setCenters] = useState([]);
//   const [form, setForm] = useState({ name: "", profitPercent: "" });
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       const res = await API.get("/centers");
//       setCenters(res.data);
//       // eslint-disable-next-line no-unused-vars
//     } catch (error) {
//       toast.error("فشل في تحميل المراكز");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const addCenter = async () => {
//     if (!form.name || !form.profitPercent) {
//       return toast.error("برجاء إكمال البيانات");
//     }
//     if (form.profitPercent < 10) {
//       return Swal.fire("تنبيه", "نسبة الربح لا يمكن أن تقل عن 10%", "warning");
//     }

//     try {
//       await API.post("/centers", {
//         name: form.name,
//         profitPercent: Number(form.profitPercent),
//       });
//       toast.success("تم إضافة المركز بنجاح ✅");
//       setForm({ name: "", profitPercent: "" }); // تصفير الفورم
//       load();
//       // eslint-disable-next-line no-unused-vars
//     } catch (error) {
//       toast.error("حدث خطأ أثناء الإضافة");
//     }
//   };

//   // 🚀 إضافة ميزة المسح (اختياري)
//   // const deleteCenter = (id) => {
//   //   Swal.fire({
//   //     title: "هل أنت متأكد؟",
//   //     text: "سيتم حذف المركز نهائياً!",
//   //     icon: "warning",
//   //     showCancelButton: true,
//   //     confirmButtonColor: "#ef4444",
//   //     confirmButtonText: "نعم، احذف",
//   //     cancelButtonText: "إلغاء",
//   //   }).then(async (result) => {
//   //     if (result.isConfirmed) {
//   //       await API.put(`/centers/${id}`, { isDeleted: true });
//   //       // setCenters((prev) =>
//   //       //   prev.map((c) => (c._id === id ? { ...c, isDeleted: true } : c)),
//   //       // );
//   //       toast.success("تم الحذف");
//   //       load();
//   //     }
//   //   });
//   // };
//   const deleteCenter = (id) => {
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
//         try {
//           await API.put(`/centers/${id}`, { isDeleted: true });
//           setCenters((prev) => prev.filter((c) => c._id !== id));
//           Swal.fire("تم!", "تم حذف المركز بنجاح ✅", "success");
//         } catch (error) {
//           Swal.fire("خطأ!", "حدث خطأ أثناء الحذف", "error");
//           console.error(error);
//         }
//       }
//     });
//   };
//   if (loading) {
//     return (
//       <MainLayout>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <Toaster position="top-center" />

//       <div className="flex items-center gap-3 mb-8">
//         <FaIndustry className="text-3xl text-indigo-600" />
//         <h2 className="text-2xl font-black text-slate-800">
//           إدارة مراكز الصيانة
//         </h2>
//       </div>

//       {/* 📥 نموذج الإضافة */}
//       <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-10">
//         <p className="text-slate-500 mb-4 font-bold text-sm">إضافة مركز جديد</p>
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
//               <FaIndustry />
//             </span>
//             <input
//               className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm"
//               placeholder="اسم المركز (مثلاً: ورشة الاتحاد)"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           </div>

//           <div className="relative w-full md:w-48">
//             <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
//               <FaPercentage />
//             </span>
//             <input
//               type="number"
//               className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm"
//               placeholder="نسبة الربح"
//               value={form.profitPercent}
//               onChange={(e) =>
//                 setForm({ ...form, profitPercent: e.target.value })
//               }
//             />
//           </div>

//           <button
//             onClick={addCenter}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
//           >
//             <FaPlus /> إضافة
//           </button>
//         </div>
//       </div>

//       {/* 📊 عرض المراكز */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {centers.length > 0 ? (
//           centers
//             .filter((c) => !c.isDeleted)
//             .map((c) => (
//               <div
//                 key={c._id}
//                 className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
//                     <FaIndustry className="text-xl" />
//                   </div>
//                   <button
//                     onClick={() => deleteCenter(c._id)}
//                     className="text-slate-300 hover:text-red-500 transition-colors p-2"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//                 <h3 className="text-lg font-black text-slate-800 mb-1">
//                   {c.name}
//                 </h3>
//                 <div className="flex items-center gap-2 text-indigo-600 font-bold">
//                   <FaPercentage className="text-xs" />
//                   <span>{c.profitPercent}% ربح إضافي</span>
//                 </div>
//               </div>
//             ))
//         ) : (
//           <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
//             لا توجد مراكز مسجلة حالياً
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// }

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
  const [isEditMode, setIsEditMode] = useState(false); // 🆕 حالة التعديل
  const [selectedId, setSelectedId] = useState(null); // 🆕 معرف المركز اللي بنعدله

  const load = async () => {
    try {
      const res = await API.get("/centers");
      // بنعرض بس اللي مش ممسوحين
      setCenters(res.data.filter((c) => !c.isDeleted));
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

  // --- 1. وظيفة الحفظ (إضافة أو تعديل) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع تحديث الصفحة
    if (!form.name || !form.profitPercent)
      return toast.error("برجاء إكمال البيانات");

    try {
      if (isEditMode) {
        // 📝 تحديث مركز موجود (PUT)
        await API.put(`/centers/${selectedId}`, {
          name: form.name,
          profitPercent: Number(form.profitPercent),
        });
        toast.success("تم تحديث بيانات المركز بنجاح ✅");
      } else {
        // ➕ إضافة مركز جديد (POST)
        await API.post("/centers", {
          name: form.name,
          profitPercent: Number(form.profitPercent),
        });
        toast.success("تم إضافة المركز بنجاح ✅");
      }

      resetForm(); // تصفير الفورم
      load(); // إعادة تحميل الداتا
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ في العملية");
    }
  };

  // --- 2. وظيفة ملء الفورم للتعديل ---
  const handleEditClick = (center) => {
    setIsEditMode(true);
    setSelectedId(center._id);
    setForm({ name: center.name, profitPercent: center.profitPercent });
    window.scrollTo({ top: 0, behavior: "smooth" }); // اطلع لفوق عشان تشوف الفورم
  };

  // --- 3. تصفير الفورم ---
  const resetForm = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setForm({ name: "", profitPercent: "" });
  };

  // --- 4. حذف المركز (Soft Delete) ---
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
          // بننادي مسار المسح اللي عملناه PATCH أو PUT حسب الباكيند بتاعك
          await API.patch(`/centers/delete/${id}`);
          toast.success("تم الحذف بنجاح");
          load();
        // eslint-disable-next-line no-unused-vars
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

      {/* 📥 الفورم الموحد */}
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

      {/* 📊 عرض المراكز */}
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
