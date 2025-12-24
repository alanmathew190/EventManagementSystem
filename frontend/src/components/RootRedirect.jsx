import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RootRedirect() {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? <Navigate to="/home" /> : <Navigate to="/login" />;
}
