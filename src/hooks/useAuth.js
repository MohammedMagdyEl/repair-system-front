import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [userRole, setUserRole] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        setUserRole("");
      }
    }
    setIsReady(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return { userRole, isReady, logout };
}
