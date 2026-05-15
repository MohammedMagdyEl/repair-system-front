





























                        







import MainLayout from "../layout/MainLayout";
import {
  FaTools,
  FaCheckCircle,
  FaSpinner,
  FaMoneyBillWave,
  FaChartLine,
  FaIndustry,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDashboardData from "../hooks/useDashboardData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, stats, centersData } = useDashboardData();

  if (loading)
    return (
      <MainLayout>
        <div className="p-10 text-center font-bold">جاري تحميل البيانات...</div>
      </MainLayout>
    );

  const avgProfit = stats.total > 0 ? (stats.totalProfit / stats.total).toFixed(0) : 0;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          📊 لوحة التحكم والتقارير
        </h2>
        <div className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 font-bold">
          {new Date().toLocaleDateString("ar-EG")}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="إجمالي المواتير" value={stats.total} icon={<FaTools />} bgColor="bg-gradient-to-br from-indigo-500 to-indigo-700" footer={`نسبة الإنجاز: ${stats.completionRate}%`} />
        <SummaryCard title="تم التسليم" value={stats.delivered} icon={<FaCheckCircle />} bgColor="bg-gradient-to-br from-green-500 to-green-700" footer="جاهز تماماً للاستلام" />
        <SummaryCard title="قيد التنفيذ" value={stats.inProgress} icon={<FaSpinner className="animate-spin" />} bgColor="bg-gradient-to-br from-amber-500 to-amber-600" footer="موجودة حالياً بالورش" />
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaMoneyBillWave /> <p className="font-bold">إجمالي التكلفة</p>
          </div>
          <h3 className="text-2xl font-black">{stats.globalRemaining.toLocaleString()} <small className="text-xs">ج.م</small></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaChartLine /> <p className="font-bold">إجمالي الربح</p>
          </div>
          <h3 className="text-2xl font-black text-green-600">{stats.totalProfit.toLocaleString()} <small className="text-xs">ج.م</small></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <FaTools /> <p className="font-bold">متوسط الربح/طلب</p>
          </div>
          <h3 className="text-2xl font-black text-blue-700">{avgProfit} <small className="text-xs">ج.م</small></h3>
        </div>
      </div>

      {}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6 px-2">
          <FaIndustry className="text-2xl text-gray-700" />
          <h3 className="text-xl font-black text-gray-800">🏭 أداء مراكز الصيانة (اضغط للتفاصيل)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(centersData).length > 0 ? (
            Object.keys(centersData).map((center) => (
              <CenterCard
                key={center}
                center={center}
                data={centersData[center]}
                onClick={() => navigate(`/centers/${center}`)}
              />
            ))
          ) : (
            <p className="text-gray-400 italic px-2 font-bold">لا توجد مراكز حالياً...</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function SummaryCard({ title, value, icon, bgColor, footer }) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group`}>
      <div className="relative z-10">
        <p className="text-white/80 font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-black">{value}</h3>
        <p className="mt-4 text-[10px] text-white/60 font-light uppercase tracking-wider">{footer}</p>
      </div>
      <div className="absolute top-4 left-4 text-6xl text-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  );
}

function CenterCard({ center, data, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-300 transition-all group cursor-pointer active:scale-95"
    >
      <h4 className="font-black text-lg mb-4 text-indigo-900 pb-2 border-b flex justify-between items-center group-hover:text-indigo-600">
        {center}
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs">الكل: {data.count}</span>
      </h4>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold mb-1">صيانة تمت ✅</p>
            <p className="text-lg font-black text-slate-800">{data.doneCount}</p>
            <p className="text-[14px] text-red-600 font-black mt-1">ت: {data.doneCost.toLocaleString()} ج.م</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold mb-1">صيانة لسه 🛠️</p>
            <p className="text-lg font-black text-slate-800">{data.pendingCount}</p>
            <p className="text-[14px] text-slate-500 font-black mt-1">ت: {data.pendingCost.toLocaleString()} ج.م</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-50">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-gray-400 font-bold">تم دفعه للمركز:</span>
            <span className="font-bold text-gray-700 text-sm">{data.totalPaid.toLocaleString()} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-3">
            <span className="text-red-600 font-bold">باقي للمركز (صافي):</span>
            <span className="font-black text-red-700 text-lg">{data.remainingAccount.toLocaleString()} ج.م</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 p-3 rounded-2xl group-hover:bg-green-100 transition-colors">
            <span className="text-green-800 font-black text-xs">صافي ربح المحل:</span>
            <span className="font-black text-green-700 text-lg">
              {data.profit.toLocaleString()} <small className="text-[10px]">ج.م</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}