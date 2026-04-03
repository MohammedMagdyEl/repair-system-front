import { useState, useRef, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import API from "../services/api";

export default function AddOrder() {
  const phoneRef = useRef();
  const nameRef = useRef();
  const deviceRef = useRef();
  const issueRef = useRef();
  const costRef = useRef();
  const profitRef = useRef();
  const [form, setForm] = useState({
    phoneNumber: "",
    customerName: "",
    device: "",
    issue: "",
    repairCost: "",
    profitPercent: "",
  });
  useEffect(() => {
    phoneRef.current.focus();
  }, []);
  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef) {
        nextRef.current.focus();
      } else {
        handleSubmit(); // آخر input يعمل submit
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.device || !form.phoneNumber)
      return alert("اكمل البيانات");

    try {
      // 1. لازم نبعت كل الداتا اللي اليوزر دخلها
      await API.post("/orders", {
        phoneNumber: form.phoneNumber,
        customerName: form.customerName,
        device: form.device,
        issue: form.issue,
        repairCost: form.repairCost ? Number(form.repairCost) : 0, // تحويل لرقم
        profitPercent: form.profitPercent ? Number(form.profitPercent) : 0,
      });

      alert("تم إضافة الطلب بنجاح ✅");

      // 2. تصفير الفورم
      setForm({
        phoneNumber: "",
        customerName: "",
        device: "",
        issue: "",
        repairCost: "",
        profitPercent: "",
      });
    } catch (error) {
      // 3. معالجة الخطأ لو التوكن منتهي أو فيه مشكلة
      console.error(error);
      alert(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
    }
  };
  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">➕ إضافة طلب</h2>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
        <input
          ref={phoneRef}
          onKeyDown={(e) => handleEnter(e, nameRef)}
          value={form.phoneNumber}
          placeholder="رقم العميل"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />
        <input
          ref={nameRef}
          onKeyDown={(e) => handleEnter(e, deviceRef)}
          value={form.customerName}
          placeholder="اسم العميل"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />

        <input
          ref={deviceRef}
          onKeyDown={(e) => handleEnter(e, issueRef)}
          value={form.device}
          placeholder="نوع الماتور"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, device: e.target.value })}
        />

        <input
          ref={issueRef}
          onKeyDown={(e) => handleEnter(e, costRef)}
          value={form.issue}
          placeholder="وصف العطل"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
        />

        <input
          ref={costRef}
          onKeyDown={(e) => handleEnter(e, profitRef)}
          type="number"
          value={form.repairCost}
          placeholder="تكلفة الصيانة"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, repairCost: e.target.value })}
        />

        <input
          ref={profitRef}
          onKeyDown={(e) => handleEnter(e)}
          type="number"
          value={form.profitPercent}
          placeholder="نسبة الربح %"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, profitPercent: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          حفظ
        </button>
      </div>
    </MainLayout>
  );
}
