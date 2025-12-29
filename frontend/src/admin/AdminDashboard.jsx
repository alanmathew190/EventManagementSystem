import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/events/admin/events/pending/")
      .then((res) => setEvents(res.data))
      .catch(() => setError("You are not authorized"))
      .finally(() => setLoading(false));
  }, []);


  const approveEvent = async (eventId) => {
    try {
      await api.post(`/events/admin/events/${eventId}/approve/`);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch {
      alert("Approval failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading pending events…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Review and approve pending events submitted by hosts.
          </p>
        </div>

        {events.length === 0 && (
          <p className="text-emerald-600 font-medium">🎉 No pending events</p>
        )}

        {/* EVENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
            >
              {/* POSTER */}
              <div className="relative h-44">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Poster
                  </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* CATEGORY */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    event.category === "paid"
                      ? "bg-indigo-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {event.category === "paid"
                    ? `Paid • ₹${event.price}`
                    : "Free Event"}
                </span>

                {/* TITLE */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-1">
                <p className="text-sm text-gray-600">
                  👤 Host: <strong>{event.host}</strong>
                </p>

                <p className="text-sm text-gray-600">📍 {event.place_name}</p>

                <p className="text-sm text-gray-600">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600">
                  👥 Capacity: {event.capacity}
                </p>

                {/* ACTION */}
                <button
                  onClick={() => approveEvent(event.id)}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  Approve Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
