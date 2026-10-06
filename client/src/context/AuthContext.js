import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("codeforge_token", data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", { name, email, password });
    localStorage.setItem("codeforge_token", data.token);
    setUser(data.user);
  };

  const updateProfile = async (profile) => {
    const { data } = await API.put("/auth/me", profile);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("codeforge_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("codeforge_token");
    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("codeforge_token"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
