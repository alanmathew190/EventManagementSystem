import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import GlassLayout from "../components/GlassLayout";

const FEATURES = [
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
];

export default function Home() {
  const { authTokens } = useContext(AuthContext);
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % FEATURES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassLayout>
      {/* 🔷 HERO */}
      <section className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div
          className="relative max-w-5xl w-full text-center
                     bg-black/40 backdrop-blur-2xl
                     border border-white/20
                     rounded-3xl
                     shadow-[0_30px_80px_rgba(0,0,0,0.8)]
                     p-12 md:p-20"
        >
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/90 text-white flex items-center justify-center text-2xl font-extrabold">
              ES
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Manage & Attend Events with{" "}
            <span className="text-indigo-400">EventSphere</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Discover events, register securely, check in with QR codes, and host
            unforgettable experiences.
          </p>

          {!authTokens ? (
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/login"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white/15 border border-white/25 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/25 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to="/events"
              className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-semibold transition"
            >
              Explore Events
            </Link>
          )}
        </div>
      </section>

      {/* ✨ FEATURE CAROUSEL */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="min-w-full flex justify-center">
                <div
                  className="p-10 rounded-3xl text-center
                             bg-white/10 backdrop-blur-2xl
                             border border-white/20
                             shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                             max-w-md w-full"
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {f.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </section>
      )}
    </GlassLayout>
  );
}
