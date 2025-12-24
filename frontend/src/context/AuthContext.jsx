import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() =>
    JSON.parse(localStorage.getItem("authTokens"))
  );

  const login = (tokens) => {
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setAuthTokens(tokens);
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
