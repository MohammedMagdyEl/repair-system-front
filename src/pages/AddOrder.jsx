// import { useState, useRef, useEffect } from "react";
// import MainLayout from "../layout/MainLayout";
// import API from "../services/api";

// export default function AddOrder() {
//   const phoneRef = useRef();
//   const nameRef = useRef();
//   const deviceRef = useRef();
//   const issueRef = useRef();
//   const costRef = useRef();
//   const profitRef = useRef();
//   const [form, setForm] = useState({
//     phoneNumber: "",
//     customerName: "",
//     device: "",
//     issue: "",
//     repairCost: "",
//     profitPercent: "",
//   });
//   useEffect(() => {
//     phoneRef.current.focus();
//   }, []);
//   const handleEnter = (e, nextRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (nextRef) {
//         nextRef.current.focus();
//       } else {
//         handleSubmit(); // آخر input يعمل submit
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.customerName || !form.device || !form.phoneNumber)
//       return alert("اكمل البيانات");

//     try {
//       // 1. لازم نبعت كل الداتا اللي اليوزر دخلها
//       await API.post("/orders", {
//         phoneNumber: form.phoneNumber,
//         customerName: form.customerName,
//         device: form.device,
//         issue: form.issue,
//         repairCost: form.repairCost ? Number(form.repairCost) : 0, // تحويل لرقم
//         profitPercent: form.profitPercent ? Number(form.profitPercent) : 0,
//       });

//       alert("تم إضافة الطلب بنجاح ✅");

//       // 2. تصفير الفورم
//       setForm({
//         phoneNumber: "",
//         customerName: "",
//         device: "",
//         issue: "",
//         repairCost: "",
//         profitPercent: "",
//       });
//     } catch (error) {
//       // 3. معالجة الخطأ لو التوكن منتهي أو فيه مشكلة
//       console.error(error);
//       alert(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
//     }
//   };
//   return (
//     <MainLayout>
//       <h2 className="text-xl font-bold mb-4">➕ إضافة طلب</h2>

//       <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
//         <input
//           ref={phoneRef}
//           onKeyDown={(e) => handleEnter(e, nameRef)}
//           value={form.phoneNumber}
//           placeholder="رقم العميل"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//         />
//         <input
//           ref={nameRef}
//           onKeyDown={(e) => handleEnter(e, deviceRef)}
//           value={form.customerName}
//           placeholder="اسم العميل"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, customerName: e.target.value })}
//         />

//         <input
//           ref={deviceRef}
//           onKeyDown={(e) => handleEnter(e, issueRef)}
//           value={form.device}
//           placeholder="نوع الماتور"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, device: e.target.value })}
//         />

//         <input
//           ref={issueRef}
//           onKeyDown={(e) => handleEnter(e, costRef)}
//           value={form.issue}
//           placeholder="وصف العطل"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, issue: e.target.value })}
//         />

//         <input
//           ref={costRef}
//           onKeyDown={(e) => handleEnter(e, profitRef)}
//           type="number"
//           value={form.repairCost}
//           placeholder="تكلفة الصيانة"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, repairCost: e.target.value })}
//         />

//         <input
//           ref={profitRef}
//           onKeyDown={(e) => handleEnter(e)}
//           type="number"
//           value={form.profitPercent}
//           placeholder="نسبة الربح %"
//           className="border p-2 rounded"
//           onChange={(e) => setForm({ ...form, profitPercent: e.target.value })}
//         />

//         <button
//           onClick={handleSubmit}
//           className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
//         >
//           حفظ
//         </button>
//       </div>
//     </MainLayout>
//   );
// }
import { useState, useRef, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";

export default function AddOrder() {
  const phoneRef = useRef();
  const nameRef = useRef();
  const deviceRef = useRef();
  const issueRef = useRef();

  const [form, setForm] = useState({ phoneNumber: "", customerName: "", device: "", issue: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { phoneRef.current.focus(); }, []);

  // دالة الفالديشن اللي بتشيك على خانة واحدة (عند الخروج منها)
  const validateField = (name, value) => {
    let error = "";
    if (name === "phoneNumber") {
      if (!value) error = "رقم العميل مطلوب";
      else if (value.length !== 11) error = "يجب أن يكون 11 رقم";
    } else if (name === "customerName") {
      if (!value) error = "اسم العميل مطلوب";
    } else if (name === "device") {
      if (!value) error = "نوع الماتور مطلوب";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // هل الفورم جاهزة تماماً للحفظ؟
  const isFormValid = 
    form.phoneNumber.length === 11 && 
    form.customerName.trim() !== "" && 
    form.device.trim() !== "" &&
    !Object.values(errors).some(err => err !== "");

  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef ? nextRef.current.focus() : (isFormValid && handleSubmit());
    }
  };

  const handleSubmit = async () => {
    if (loading || !isFormValid) return;

    setLoading(true);
    try {
      await API.post("/orders", form);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setForm({ phoneNumber: "", customerName: "", device: "", issue: "" });
      setErrors({});
      phoneRef.current.focus();
    } catch (error) {
      alert(error.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">➕ إضافة طلب</h2>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 relative">
        
        {/* حقل رقم العميل */}
        <div className="flex flex-col gap-1">
          <input
            ref={phoneRef}
            onKeyDown={(e) => handleEnter(e, nameRef)}
            onBlur={(e) => validateField("phoneNumber", e.target.value)} // تشيك عند الخروج
            value={form.phoneNumber}
            placeholder="رقم العميل"
            className={`border p-2 rounded outline-none transition-all ${errors.phoneNumber ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500'}`}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          {errors.phoneNumber && <span className="text-red-500 text-xs font-bold">{errors.phoneNumber}</span>}
        </div>

        {/* حقل اسم العميل */}
        <div className="flex flex-col gap-1">
          <input
            ref={nameRef}
            onKeyDown={(e) => handleEnter(e, deviceRef)}
            onBlur={(e) => validateField("customerName", e.target.value)}
            value={form.customerName}
            placeholder="اسم العميل"
            className={`border p-2 rounded outline-none transition-all ${errors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500'}`}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
          {errors.customerName && <span className="text-red-500 text-xs font-bold">{errors.customerName}</span>}
        </div>

        {/* حقل نوع الماتور */}
        <div className="flex flex-col gap-1">
          <input
            ref={deviceRef}
            onKeyDown={(e) => handleEnter(e, issueRef)}
            onBlur={(e) => validateField("device", e.target.value)}
            value={form.device}
            placeholder="نوع الماتور"
            className={`border p-2 rounded outline-none transition-all ${errors.device ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500'}`}
            onChange={(e) => setForm({ ...form, device: e.target.value })}
          />
          {errors.device && <span className="text-red-500 text-xs font-bold">{errors.device}</span>}
        </div>

        {/* حقل وصف العطل */}
        <input
          ref={issueRef}
          onKeyDown={(e) => handleEnter(e)}
          value={form.issue}
          placeholder="وصف العطل"
          className="border p-2 rounded outline-none focus:border-blue-500"
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          className={`p-2 rounded font-bold text-white transition-all ${
            !isFormValid || loading 
            ? 'bg-gray-300 cursor-not-allowed opacity-70' 
            : 'bg-green-500 hover:bg-green-600 shadow-md active:scale-95'
          }`}
        >
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>

        {/* Toast النجاح الاحترافي */}
        {showSuccess && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full shadow-2xl animate-bounce z-50">
            ✅ تم حفظ طلب صيانة الاتحاد بنجاح
          </div>
        )}
      </div>
    </MainLayout>
  );
}