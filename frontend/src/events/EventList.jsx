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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 🔷 Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600">
            Explore upcoming events and join experiences around you.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3 mb-10"
        >
          <input
            type="text"
            placeholder="Search by place or city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setLocation("");
              fetchEvents();
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold transition"
          >
            Clear
          </button>
        </form>

        {/* ⏳ Loading */}
        {loading && <p className="text-gray-600">Loading events...</p>}

        {/* ❌ No Results */}
        {!loading && events.length === 0 && (
          <p className="text-gray-600">No events found for this location.</p>
        )}

        {/* 🎟 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {event.title}
              </h2>

              {event.place_name && (
                <p className="text-sm text-gray-700 mb-1">
                  📍 {event.place_name}
                </p>
              )}

              <p className="text-sm text-gray-500 mb-2">
                🗓 {new Date(event.date).toLocaleString()}
              </p>

              {/* Category Badge */}
              <span
                className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium ${
                  event.category === "free"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {event.category === "free" ? "Free Event" : "Paid Event"}
              </span>

              <div className="mt-2">
                <Link
                  to={`/events/${event.id}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
