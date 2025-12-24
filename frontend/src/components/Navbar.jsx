import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { authTokens, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authTokens) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/events">Events</Link>
        <Link to="/my-events">My Events</Link>
        <Link to="/host/create">Host Event</Link>
        <Link to="/hosted-events">Hosted Events</Link>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-300">
          Logged in as: <strong>{username || "User"}</strong>
        </span>

        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
