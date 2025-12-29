import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("authTokens"))
  );
  const [username, setUsername] = useState(authTokens?.username || null);
  const [isAdmin, setIsAdmin] = useState(authTokens?.isAdmin || false);
  const [authLoading, setAuthLoading] = useState(false);

  // 🔐 Username / Password Login
  const login = async (username, password) => {
    setAuthLoading(true);
    try {
      const res = await api.post("/accounts/login/", { username, password });

      const userRes = await api.get("/accounts/me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      const finalTokens = {
        access: res.data.access,
        refresh: res.data.refresh,
        username: userRes.data.username,
        isAdmin: userRes.data.is_staff || userRes.data.is_superuser,
      };

      localStorage.setItem("authTokens", JSON.stringify(finalTokens));
      setAuthTokens(finalTokens);
      setUsername(finalTokens.username);
      setIsAdmin(finalTokens.isAdmin);
    } finally {
      setAuthLoading(false);
    }
  };

  // 🔵 Google Login
  const loginWithGoogle = async (googleToken) => {
    setAuthLoading(true);
    try {
      const res = await api.post("/accounts/google/", {
        token: googleToken,
      });

      const userRes = await api.get("/accounts/me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      const finalTokens = {
        access: res.data.access,
        refresh: res.data.refresh,
        username: userRes.data.username,
        isAdmin: userRes.data.is_staff || userRes.data.is_superuser,
      };

      localStorage.setItem("authTokens", JSON.stringify(finalTokens));
      setAuthTokens(finalTokens);
      setUsername(finalTokens.username);
      setIsAdmin(finalTokens.isAdmin);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUsername(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        username,
        isAdmin,
        authLoading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
