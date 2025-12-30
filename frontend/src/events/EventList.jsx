import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/events/");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* 🔍 FILTER BY NAME OR PLACE */
  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            (event.place_name && event.place_name.toLowerCase().includes(query))
        )
      );
    }
  }, [search, events]);

  if (loading) {
    return <Spinner size="lg" />;
  }

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
        <input
          type="text"
          placeholder="Search by event name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mb-10 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        {/* EMPTY STATE */}
        {filteredEvents.length === 0 && (
          <EmptyState
            title="No Events Found"
            description="Try searching with a different event name or location."
          />
        )}

        {/* EVENT GRID */}
        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
              >
                {/* IMAGE */}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="text-lg font-bold text-white">
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

                  <span className="text-xs font-medium text-indigo-600">
                    {event.category === "free"
                      ? "Free Event"
                      : `Paid • ₹${event.price}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
