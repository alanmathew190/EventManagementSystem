import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { authTokens, username, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authTokens) return null;

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  const linkClass = (path) =>
    `transition ${
      location.pathname === path
        ? "text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🔵 Brand */}
        <Link
          to="/events"
          className="text-2xl font-extrabold tracking-tight text-indigo-600"
        >
          EventSphere
        </Link>

        {/* 🍔 Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* 🖥 Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/events" className={linkClass("/events")}>
            Events
          </Link>
          <Link to="/my-events" className={linkClass("/my-events")}>
            My Events
          </Link>
          <Link to="/host/create" className={linkClass("/host/create")}>
            Host Event
          </Link>
          <Link to="/hosted-events" className={linkClass("/hosted-events")}>
            Hosted
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Admin
            </Link>
          )}

          {/* 👤 User */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-gray-700 font-semibold">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3 text-sm">
          <Link
            to="/events"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-gray-700 hover:text-indigo-600"
          >
            Events
          </Link>
          <Link
            to="/my-events"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-gray-700 hover:text-indigo-600"
          >
            My Events
          </Link>
          <Link
            to="/host/create"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-gray-700 hover:text-indigo-600"
          >
            Host Event
          </Link>
          <Link
            to="/hosted-events"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-gray-700 hover:text-indigo-600"
          >
            Hosted Events
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block font-semibold text-indigo-600"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-3 border-t flex items-center justify-between">
            <span className="text-gray-600">
              Logged in as <strong>{username}</strong>
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
