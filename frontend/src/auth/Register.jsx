import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import GlassLayout from "../components/GlassLayout";

export default function Register() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- NORMAL REGISTER ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/accounts/register/", {
        username,
        password,
      });

      const res = await api.post("/accounts/login/", {
        username,
        password,
      });

      localStorage.setItem("authTokens", JSON.stringify(res.data));
      navigate("/events");
    } catch {
      setError("Registration failed. Username already exists.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GOOGLE SIGNUP ---------- */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      navigate("/events");
    } catch {
      setError("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-md
                     bg-white/15 backdrop-blur-2xl
                     border border-white/25
                     rounded-3xl
                     shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                     p-8"
        >
          {/* 🔵 BRAND */}
          <h1 className="text-3xl font-extrabold text-center text-indigo-400 mb-2">
            EventSphere
          </h1>
          <p className="text-center text-white/70 mb-8">Create your account</p>

          {/* ❌ ERROR */}
          {error && (
            <div
              className="mb-4 bg-red-500/20 border border-red-400/40
                            text-red-300 text-sm px-4 py-2 rounded-xl"
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3 text-white
                         placeholder-white/50
                         focus:ring-2 focus:ring-indigo-400
                         outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3 text-white
                         placeholder-white/50
                         focus:ring-2 focus:ring-indigo-400
                         outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600
                         active:scale-95 text-white py-3 rounded-xl
                         font-semibold shadow-lg transition
                         disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/30" />
            <span className="px-3 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* GOOGLE SIGNUP */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google signup failed")}
              theme="filled_black"
            />
          </div>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </GlassLayout>
  );
}
