
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../services/api.js";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const loginPromise = API.post("/signIn", { email, password });

    toast.promise(loginPromise, {
      loading: 'جاري التحقق...',
      success: (res) => {
        const { token } = res.data;
        // 1. حفظ التوكن في الـ LocalStorage
        localStorage.setItem("token", token);
        // 2. تحديث الـ Headers في Axios فوراً
        setAuthToken(token); 
        // 3. التوجيه لصفحة الطلبات
        nav("/orders");
        return "أهلاً بك مجدداً ✅";
      },
      error: (err) => err.response?.data?.message || "فشل تسجيل الدخول",
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 font-sans" dir="rtl">
      <Toaster position="top-center" />
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">صيانة الاتحاد</h2>
        
        <input 
          type="text" 
          placeholder="البريد الإلكتروني" 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <input 
          type="password" 
          placeholder="كلمة المرور" 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
          دخول للنظام
        </button>
      </form>
    </div>
  );
}