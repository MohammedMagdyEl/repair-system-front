
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import Centers from "./pages/Centers";
import Status from "./pages/Status";
import CenterDetails from "./pages/CenterDetails";
import LockedPage from "./pages/LockedPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); 
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<Login />} />

        {}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              {}
              <AddOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/centers"
          element={
            <PrivateRoute>
              <Centers />
            </PrivateRoute>
          }
        />
        <Route
          path="/centers/:centerName"
          element={
            <PrivateRoute>
              <CenterDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/status"
          element={
            <PrivateRoute>
              <Status />
            </PrivateRoute>
          }
        />

        {}
        <Route
          path="*"
          element={
            <div className="text-center mt-20 text-2xl text-red-500 font-bold">
              صفحة غير موجودة
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
