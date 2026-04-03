
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaPlusCircle,
  FaChartBar,
  FaIndustry,
  FaSignOutAlt,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // استيراد مكتبة فك التوكن

export default function MainLayout({ children }) {
  const [userRole, setUserRole] = useState(""); // استيت لحفظ الرول
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // 1. هات التوكن من اللوكل استورج
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // 2. فك تشفير التوكن
        const decoded = jwtDecode(token);
        // 3. اسحب الـ role منه (تأكد أن الاسم في التوكن هو role)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserRole(decoded.role);
      } catch (error) {
        console.error("خطأ في فك التوكن:", error);
        setUserRole("");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar - القائمة الجانبية */}
      <aside className="w-72 text-slate-500 flex flex-col shadow-2xl z-20">
        <div className="p-8 flex flex-col items-center border-b border-slate-800">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/20 mb-3">
            <FaIndustry className="text-3xl text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-500 tracking-wider text-center">
            نظام صيانة الاتحاد
          </h2>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">
            إدارة الورش والمواتير
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {/* يمكنك هنا أيضاً إخفاء روابط معينة بناءً على الـ Role */}
          {userRole === "Admin" && (
            <NavItem
              to="/dashboard"
              icon={<FaChartBar />}
              label="لوحة التحكم"
              active={isActive("/dashboard")}
            />
          )}

          <NavItem
            to="/orders"
            icon={<FaClipboardList />}
            label="سجل الطلبات"
            active={isActive("/orders")}
          />
          <NavItem
            to="/add"
            icon={<FaPlusCircle />}
            label="إضافة طلب جديد"
            active={isActive("/add")}
          />

          {userRole === "Admin" && (
            <NavItem
              to="/centers"
              icon={<FaIndustry />}
              label="مراكز الصيانة"
              active={isActive("/centers")}
            />
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
          >
            <FaSignOutAlt />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header - الهيدر الديناميكي */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-slate-400 text-sm">
            أهلاً بك،{" "}
            <span className="text-slate-800 font-bold">
              {/* التغيير هنا بناءً على الـ Role */}
              {userRole === "Admin" ? "admin" : "user "} 👋
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`text-[10px] px-2 py-1 rounded-md font-bold ${userRole === "Admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
            >
              {userRole === "Admin" ? "مدير" : "مستخدم"}
            </div>
            <div className="bg-slate-100 h-10 w-10 rounded-full flex items-center justify-center font-bold text-slate-500 shadow-inner">
              {userRole === "Admin" ? "AD" : "US"}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-[-4px]"
            : "hover:bg-slate-800 hover:text-white"
        }`}
    >
      <span
        className={`${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors text-lg`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
