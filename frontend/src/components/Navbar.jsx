import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { authTokens, username, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authTokens) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🔵 Brand */}
        <Link to="/events" className="text-xl font-bold text-indigo-600">
          EventSphere
        </Link>

        {/* 🍔 Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* 🖥️ Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/events" className="hover:text-indigo-600">
            Events
          </Link>
          <Link to="/my-events" className="hover:text-indigo-600">
            My Events
          </Link>
          <Link to="/host/create" className="hover:text-indigo-600">
            Host Event
          </Link>
          <Link to="/hosted-events" className="hover:text-indigo-600">
            Hosted Events
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-indigo-600 font-semibold">
              Admin Panel
            </Link>
          )}

          <span className="text-gray-600">
            Hi, <strong>{username}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 bg-gray-50 p-4 rounded-lg">
          <Link to="/events" className="block hover:text-indigo-600">
            Events
          </Link>
          <Link to="/my-events" className="block hover:text-indigo-600">
            My Events
          </Link>
          <Link to="/host/create" className="block hover:text-indigo-600">
            Host Event
          </Link>
          <Link to="/hosted-events" className="block hover:text-indigo-600">
            Hosted Events
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block text-indigo-600 font-semibold">
              Admin Panel
            </Link>
          )}

          <div className="text-sm text-gray-600">
            Logged in as <strong>{username}</strong>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
