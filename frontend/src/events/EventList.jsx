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
      console.log(res.data);
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
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600">
            Explore upcoming events and join experiences around you.
          </p>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3 mb-10"
        >
          <input
            type="text"
            placeholder="Search by place or city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold">
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setLocation("");
              fetchEvents();
            }}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold"
          >
            Clear
          </button>
        </form>

        {/* LOADING */}
        {loading && <p className="text-gray-600">Loading events...</p>}

        {/* NO RESULTS */}
        {!loading && events.length === 0 && (
          <p className="text-gray-600">No events found.</p>
        )}

        {/* EVENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
            >
              {/* POSTER */}
              <div className="relative h-48">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {event.title}
                  </h2>
                  {event.place_name && (
                    <p className="text-sm text-gray-200">
                      📍 {event.place_name}
                    </p>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    event.category === "free"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {event.category === "free"
                    ? "Free Event"
                    : `Paid • ₹${event.price}`}
                </span>

                <p className="mt-3 text-indigo-600 text-sm font-semibold group-hover:underline">
                  View Details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
