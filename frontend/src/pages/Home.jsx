import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { authTokens } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      {/* 🔷 Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-indigo-600">EventSphere</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover events, join workshops, and host your own experiences. Secure
          registrations, QR-based check-ins, and seamless event management — all
          in one platform.
        </p>

        {!authTokens ? (
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white border border-gray-300 hover:border-indigo-600 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <Link
            to="/events"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Explore Events
          </Link>
        )}
      </section>

      {/* ✨ Features Section */}
      <section className="mt-20 bg-white py-16 border-t">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3 text-center">
          <div className="p-6 rounded-xl hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎟 Secure Registrations
            </h3>
            <p className="text-gray-600 text-sm">
              Join free or paid events with approval-based QR tickets. Prevents
              fake entries and overbooking.
            </p>
          </div>

          <div className="p-6 rounded-xl hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📱 QR Check-In
            </h3>
            <p className="text-gray-600 text-sm">
              QR-based attendance marking with live validation by event hosts.
            </p>
          </div>

          <div className="p-6 rounded-xl hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🧑‍💼 Host & Manage Events
            </h3>
            <p className="text-gray-600 text-sm">
              Create, manage, approve attendees, and monitor attendance in
              real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 Footer CTA */}
      {!authTokens && (
        <section className="py-16 bg-gray-50 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account and start exploring events today.
          </p>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Join EventSphere
          </Link>
        </section>
      )}
    </div>
  );
}
