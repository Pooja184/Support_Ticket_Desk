import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/current-user");
        console.log("Auth user:", res.data.user);
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

  console.log("AuthProvider render", user, "loading", loading);

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

export const useAuth = () => useContext(AuthContext);
