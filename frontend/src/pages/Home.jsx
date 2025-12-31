import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import GlassLayout from "../components/GlassLayout";

const POSTERS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87", // crowd event
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7", // concert lights
  "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2", // music festival
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", // stage crowd
  "https://images.unsplash.com/photo-1518972559570-7cc1309f3229", // dj / club
  "https://images.unsplash.com/photo-1506157786151-b8491531f063", // conference
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1", // tech meetup
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // night event
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d", // people networking
];

const FEATURES = [
  {
    icon: "🎟",
    title: "Secure Registrations",
    desc: "Register for free or paid events with approvals and capacity control.",
  },
  {
    icon: "📱",
    title: "QR Code Check-In",
    desc: "Fast, fraud-free attendance using QR-based scanning.",
  },
  {
    icon: "🧑‍💼",
    title: "Host & Manage",
    desc: "Create events, approve users, and manage everything in real time.",
  },
];

export default function Home() {
  const { authTokens } = useContext(AuthContext);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % POSTERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GlassLayout>
      {/* ================= HERO ================= */}
      <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-24">
        <div
          className="relative max-w-6xl w-full
                     min-h-[520px] md:min-h-[560px]
                     rounded-3xl overflow-hidden
                     shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
        >
          {/* IMAGE CAROUSEL */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {POSTERS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Event poster"
                className="min-w-full h-full object-cover  rounded-3xl"
              />
            ))}
          </div>

          {/* DARK + GLASS */}
          {/* 🎬 READABILITY GRADIENT (BOTTOM HEAVY) */}
          <div
            className="absolute inset-0 bg-gradient-to-t  rounded-3xl
                from-black/70 via-black/30 to-transparent"
          />

          {/* 🧊 SOFT GLASS WASH (VERY LIGHT) */}
          <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-md  rounded-3xl" />

          {/* ✨ GLASS EDGE */}
          <div className="absolute inset-0 border border-white/10 pointer-events-none  rounded-3xl" />

          {/* CONTENT */}
          <div className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16">
            <div className="mb-6">
              <div
                className="w-16 h-16 rounded-2xl bg-indigo-500 text-white
                              flex items-center justify-center text-2xl font-extrabold
                              shadow-[0_10px_30px_rgba(99,102,241,0.7)]"
              >
                ES
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              Manage & Attend Events with{" "}
              <span className="text-indigo-400">EventSphere</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-3xl mb-8">
              Discover events, register securely, check in with QR codes, and
              host unforgettable experiences — all from one platform.
            </p>

            {!authTokens ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/login"
                  className="bg-indigo-500 hover:bg-indigo-600
                             text-white px-8 py-3 rounded-xl
                             text-sm font-semibold transition active:scale-95"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-black/40 border border-white/20
                             hover:bg-black/50
                             text-white px-8 py-3 rounded-xl
                             text-sm font-semibold transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link
                to="/events"
                className="bg-emerald-400 hover:bg-emerald-500
                           text-white px-8 py-3 rounded-xl
                           text-sm font-semibold transition active:scale-95"
              >
                Explore Events
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURE CAROUSEL ================= */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-md mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="min-w-full flex justify-center">
                <div
                  className="p-8 rounded-3xl text-center
                             bg-white/10 backdrop-blur-2xl
                             border border-white/20
                             shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                             w-full"
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
    </GlassLayout>
  );
}
