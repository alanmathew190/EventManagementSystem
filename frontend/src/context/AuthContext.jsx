import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() => {
    const stored = localStorage.getItem("authTokens");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    localStorage.setItem("authTokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        username: authTokens?.username || "",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
