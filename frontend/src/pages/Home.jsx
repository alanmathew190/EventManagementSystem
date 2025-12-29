import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { authTokens } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🔷 HERO */}
      <section className="flex-1 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 text-center pt-24 md:pt-32">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Manage & Attend Events with{" "}
            <span className="text-indigo-600">EventSphere</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Discover events, register securely, check in with QR codes, and host
            unforgettable experiences — all from one powerful platform.
          </p>

          {!authTokens ? (
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white border border-gray-300 hover:border-indigo-600 text-gray-700 px-8 py-3 rounded-xl text-sm font-semibold transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to="/events"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-semibold transition"
            >
              Explore Events
            </Link>
          )}
        </div>
      </section>

      {/* ✨ FEATURES */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3 text-center">
          <div className="p-8 rounded-2xl hover:shadow-lg transition bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎟 Secure Registrations
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Register for free or paid events with capacity control and secure
              approval-based access.
            </p>
          </div>

          <div className="p-8 rounded-2xl hover:shadow-lg transition bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📱 QR Code Check-In
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              QR-based ticket scanning ensures fast, accurate, and fraud-free
              attendance.
            </p>
          </div>

          <div className="p-8 rounded-2xl hover:shadow-lg transition bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🧑‍💼 Host & Manage
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create events, approve attendees, track attendance, and manage
              everything in real time.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      {!authTokens && (
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to host or attend events?
          </h2>
          <p className="text-gray-600 mb-8">
            Join EventSphere today and experience seamless event management.
          </p>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold transition"
          >
            Get Started
          </Link>
        </section>
      )}
    </div>
  );
}
