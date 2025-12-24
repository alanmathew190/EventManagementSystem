import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (loc = "") => {
    setLoading(true);
    try {
      const res = await api.get(
        loc ? `/events/events/?location=${loc}` : "/events/events/"
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(location);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>

      {/* 🔍 Location Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>

        <button
          type="button"
          onClick={() => {
            setLocation("");
            fetchEvents();
          }}
          className="bg-gray-500 text-white px-4 rounded"
        >
          Clear
        </button>
      </form>

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className="text-gray-600">No events found for this location.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow bg-white">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                
            <p className="text-sm text-gray-600">📍 {event.place_name}</p>

            <p className="text-sm text-gray-600">📍 {event.location}</p>

            <p className="text-sm text-gray-600">
              🗓 {new Date(event.date).toLocaleString()}
            </p>

            <Link
              to={`/events/${event.id}`}
              className="inline-block mt-3 text-blue-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
