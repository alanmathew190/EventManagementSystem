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

  if (loading) return <p className="p-6">Loading pending events...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel – Pending Events</h1>

      {events.length === 0 && (
        <p className="text-green-600">🎉 No pending events</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>

            <p className="text-sm text-gray-600">Host: {event.host}</p>

            <p className="text-sm text-gray-600">📍 {event.place_name}</p>

            <p className="text-sm text-gray-600">
              🗓 {new Date(event.date).toLocaleString()}
            </p>

            <p className="text-sm text-gray-600">
              {event.category === "paid"
                ? `💰 Paid • ₹${event.price}`
                : "🆓 Free Event"}
            </p>

            <p className="text-sm text-gray-600">Capacity: {event.capacity}</p>

            <button
              onClick={() => approveEvent(event.id)}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Approve Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
