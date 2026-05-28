import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { AuthContext } from "./useAuth.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/current-user");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
