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
    api
      .get("/events/events/")
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) setFilteredEvents(events);
    else {
      setFilteredEvents(
        events.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            (e.place_name && e.place_name.toLowerCase().includes(q))
        )
      );
    }
  }, [search, events]);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-6 pt-20 pb-16">
      {/* NAV SHIELD */}
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Discover Events
          </h1>
          <p className="text-white/60 max-w-2xl">
            Experiences happening around you.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-12 max-w-md">
          <input
            type="text"
            placeholder="Search events or locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                       border border-white/30 px-4 py-3 text-white
                       placeholder-white/50 outline-none"
          />
        </div>

        {filteredEvents.length === 0 && (
          <EmptyState
            title="No Events Found"
            description="Try a different keyword."
          />
        )}

        {/* EVENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group relative
                         h-60 sm:h-64 md:h-72
                         rounded-3xl overflow-hidden
                         shadow-[0_16px_40px_rgba(0,0,0,0.55)]
                         transition-transform transition-shadow duration-300
                         hover:scale-[1.035]
                         hover:shadow-[0_28px_70px_rgba(0,0,0,0.7)]"
            >
              {/* IMAGE */}
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center text-white/40">
                  No Image
                </div>
              )}

              {/* DARK GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

              {/* ✨ GLASS SHINE */}
              <div
                className="pointer-events-none absolute inset-0
                           -translate-x-full
                           bg-gradient-to-tr
                           from-white/0 via-white/25 to-white/0
                           opacity-0
                           group-hover:opacity-100
                           group-hover:translate-x-full
                           transition-all duration-700"
              />

              {/* CONTENT */}
              <div className="absolute bottom-0 p-4 md:p-5 text-white">
                <h2 className="text-lg md:text-xl font-extrabold leading-snug mb-1">
                  {event.title}
                </h2>

                {event.place_name && (
                  <p className="text-xs md:text-sm text-white/70 mb-1">
                    📍 {event.place_name}
                  </p>
                )}

                <p className="text-xs md:text-sm text-white/60 mb-2">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold
                    ${
                      event.category === "free"
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-indigo-400/20 text-indigo-300"
                    }`}
                >
                  {event.category === "free"
                    ? "Free Event"
                    : `Paid • ₹${event.price}`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
