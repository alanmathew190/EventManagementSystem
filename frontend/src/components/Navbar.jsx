import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { authTokens, username, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authTokens) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🔵 Brand & Navigation */}
        <div className="flex items-center space-x-8">
          <Link
            to="/events"
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            EventSphere
          </Link>

          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <Link to="/events" className="hover:text-indigo-600 transition">
              Events
            </Link>
            <Link to="/my-events" className="hover:text-indigo-600 transition">
              My Events
            </Link>
            <Link
              to="/host/create"
              className="hover:text-indigo-600 transition"
            >
              Host Event
            </Link>
            <Link
              to="/hosted-events"
              className="hover:text-indigo-600 transition"
            >
              Hosted Events
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-indigo-600 font-semibold">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* 🔐 User Info */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:block text-sm text-gray-600">
            Logged in as <strong className="text-gray-900">{username}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
