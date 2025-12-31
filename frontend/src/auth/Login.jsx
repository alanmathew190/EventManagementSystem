import { useState, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GlassLayout from "../components/GlassLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, authLoading } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 Username / Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/events");
    } catch {
      setError("Invalid username or password");
    }
  };

  // 🔵 Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/events");
    } catch {
      setError("Google login failed");
    }
  };

  // ⏳ LOADING
  if (authLoading) {
    return (
      <GlassLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white/80 font-medium">Signing you in…</p>
          </div>
        </div>
      </GlassLayout>
    );
  }

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
          <p className="text-center text-white/70 mb-8">
            Sign in to your account
          </p>

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
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                           border border-white/30 px-4 py-3 text-white
                           placeholder-white/50
                           focus:ring-2 focus:ring-indigo-400
                           outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                           border border-white/30 px-4 py-3 text-white
                           placeholder-white/50
                           focus:ring-2 focus:ring-indigo-400
                           outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600
                         active:scale-95 text-white py-3 rounded-xl
                         font-semibold shadow-lg transition"
            >
              Login
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/30" />
            <span className="px-3 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              theme="filled_black"
            />
          </div>

          {/* REGISTER */}
          <p className="mt-6 text-center text-sm text-white/70">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </GlassLayout>
  );
}
