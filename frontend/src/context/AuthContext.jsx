import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("authTokens"))
  );

  const [username, setUsername] = useState(
    authTokens ? authTokens.username : null
  );

  const [isAdmin, setIsAdmin] = useState(
    authTokens ? authTokens.isAdmin : false
  );

  const login = async (tokens) => {
    // Save tokens first
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setAuthTokens(tokens);

    // Fetch user profile
    const res = await api.get("/accounts/me/");

    setUsername(res.data.username);
    setIsAdmin(res.data.is_staff || res.data.is_superuser);

    // Store admin info
    localStorage.setItem(
      "authTokens",
      JSON.stringify({
        ...tokens,
        username: res.data.username,
        isAdmin: res.data.is_staff || res.data.is_superuser,
      })
    );
  };

  const logout = () => {
    setAuthTokens(null);
    setUsername(null);
    setIsAdmin(false);
    localStorage.removeItem("authTokens");
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        username,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
