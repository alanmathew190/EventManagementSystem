import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/events/my-events/");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load joined events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return <p className="p-6">Loading your events...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Joined Events</h1>

      {events.length === 0 && (
        <p className="text-gray-500">You haven’t joined any events yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.event_id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{event.title}</h2>

            <p className="text-sm text-gray-600">📍 {event.location}</p>

            <p className="text-sm text-gray-600">
              🗓 {new Date(event.date).toLocaleString()}
            </p>

            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                event.category === "free"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {event.category === "free" ? "Free" : "Paid"}
            </span>

            <p
              className={`mt-2 text-sm ${
                event.is_scanned ? "text-green-600" : "text-orange-600"
              }`}
            >
              {event.is_scanned ? "✅ Attendance Marked" : "⏳ Not Yet Scanned"}
            </p>

            {event.qr_image && (
              <img
                src={`http://127.0.0.1:8000${event.qr_image}`}
                alt="QR Code"
                className="mt-3 w-40 border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
