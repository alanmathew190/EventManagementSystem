import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { authTokens, isAdmin } = useContext(AuthContext);

  if (!authTokens) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/events" />;

  return children;
}
