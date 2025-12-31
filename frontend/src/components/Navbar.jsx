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

  // ✅ Logout confirmation restored
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `relative font-medium transition ${
      location.pathname === path
        ? "text-indigo-400"
        : "text-white/70 hover:text-indigo-400"
    }`;

  return (
    <nav
      className="fixed top-0 z-50 w-full overflow-x-hidden
                    bg-white/10 backdrop-blur-2xl
                    border-b border-white/20
                    shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🔵 BRAND */}
        <Link
          to="/events"
          className="flex items-center gap-2 text-xl font-extrabold text-indigo-400"
        >
          <span
            className="w-8 h-8 rounded-lg bg-indigo-500 text-white
                           flex items-center justify-center text-sm shadow-lg"
          >
            ES
          </span>
          EventSphere
        </Link>

        {/* 🍔 MOBILE TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg
                     hover:bg-white/10 active:scale-95
                     transition text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* 🖥 DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm">
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
              className="text-indigo-400 font-semibold hover:underline"
            >
              Admin
            </Link>
          )}

          {/* 👤 USER */}
          <div
            className="flex items-center gap-2
                          bg-white/15 backdrop-blur-xl
                          px-3 py-1.5 rounded-full
                          border border-white/25"
          >
            <span className="text-white font-semibold">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500/80 hover:bg-red-600
                       active:scale-95 text-white
                       px-4 py-2 rounded-lg
                       transition shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div
          className="md:hidden w-full
                        bg-black/70 backdrop-blur-2xl
                        border-t border-white/20
                        px-4 py-5 space-y-4 text-sm"
        >
          {[
            { path: "/events", label: "Events" },
            { path: "/my-events", label: "My Events" },
            { path: "/host/create", label: "Host Event" },
            { path: "/hosted-events", label: "Hosted Events" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block font-medium ${
                location.pathname === item.path
                  ? "text-indigo-400"
                  : "text-white/80 hover:text-indigo-400"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block font-semibold text-indigo-400"
            >
              Admin Panel
            </Link>
          )}

          <div
            className="pt-4 border-t border-white/20
                          flex items-center justify-between"
          >
            <span className="text-white/70">
              Logged in as <strong>{username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600
                         active:scale-95 text-white
                         px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
