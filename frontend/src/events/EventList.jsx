import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/events/");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="p-6">Loading events...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Events</h1>

      {events.length === 0 && (
        <p className="text-gray-500">No events available</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">{event.title}</h2>

            <p className="text-sm text-gray-600 mb-1">📍 {event.location}</p>

            <p className="text-sm text-gray-600 mb-1">
              🗓 {new Date(event.date).toLocaleString()}
            </p>

            <p
              className={`inline-block px-2 py-1 text-xs rounded mb-3 ${
                event.category === "free"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {event.category === "free"
                ? "Free Event"
                : `Paid Event • ₹${event.price}`}
            </p>

            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
