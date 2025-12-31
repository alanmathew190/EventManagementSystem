import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import GlassLayout from "../components/GlassLayout";

export default function Home() {
  const { authTokens } = useContext(AuthContext);

  return (
    <GlassLayout>
      {/* 🔷 HERO */}
      <section className="flex items-center justify-center min-h-screen px-6 pt-15">
        <div
          className="relative max-w-5xl w-full text-center
               bg-black/40 backdrop-blur-2xl
               border border-white/20
               rounded-3xl
               shadow-[0_30px_80px_rgba(0,0,0,0.8)]
               p-12 md:p-20
               transition-all duration-500"
        >
          {/* 🧊 INNER GLASS BORDER (DEPTH) */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

          {/* 🟣 LOGO */}
          <div className="flex justify-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl
                   bg-indigo-500/90 text-white
                   flex items-center justify-center
                   text-2xl font-extrabold
                   shadow-[0_10px_30px_rgba(99,102,241,0.6)]"
            >
              ES
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Manage & Attend Events with{" "}
            <span className="relative inline-block text-indigo-400">
              EventSphere
              <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-indigo-400 rounded-full" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Discover events, register securely, check in with QR codes, and host
            unforgettable experiences — all from one powerful platform.
          </p>

          {!authTokens ? (
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/login"
                className="bg-indigo-500 hover:bg-indigo-600
                     active:scale-95
                     text-white px-10 py-4 rounded-xl
                     text-sm font-semibold
                     shadow-[0_10px_30px_rgba(99,102,241,0.6)]
                     transition transform hover:-translate-y-1"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white/15 backdrop-blur-xl
                     border border-white/25
                     hover:bg-white/25
                     active:scale-95
                     text-white px-10 py-4 rounded-xl
                     text-sm font-semibold
                     shadow transition transform hover:-translate-y-1"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to="/events"
              className="inline-block bg-emerald-400 hover:bg-emerald-500
                   active:scale-95
                   text-white px-10 py-4 rounded-xl
                   text-sm font-semibold
                   shadow-[0_10px_30px_rgba(52,211,153,0.6)]
                   transition transform hover:-translate-y-1"
            >
              Explore Events
            </Link>
          )}
        </div>
      </section>

      {/* ✨ FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 text-center">
          {[
            {
              icon: "🎟",
              title: "Secure Registrations",
              desc: "Register for free or paid events with capacity control and approval-based access.",
            },
            {
              icon: "📱",
              title: "QR Code Check-In",
              desc: "Fast, accurate, and fraud-free attendance using QR-based scanning.",
            },
            {
              icon: "🧑‍💼",
              title: "Host & Manage",
              desc: "Create events, approve attendees, and manage everything in real time.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group p-10 rounded-3xl
                         bg-white/10 backdrop-blur-2xl
                         border border-white/20
                         shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                         transition-all duration-500
                         hover:bg-white/20 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {f.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      {!authTokens && (
        <section className="py-24 text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to host or attend events?
          </h2>
          <p className="text-white/80 mb-10 text-lg">
            Join EventSphere today and experience seamless event management.
          </p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 hover:bg-gray-100
                       active:scale-95 px-10 py-4 rounded-xl text-sm
                       font-semibold shadow-lg transition transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </section>
      )}
    </GlassLayout>
  );
}
