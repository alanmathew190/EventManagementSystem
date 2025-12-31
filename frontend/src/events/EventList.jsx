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

  useEffect(() => {
    const query = search.toLowerCase().trim();
    if (!query) setFilteredEvents(events);
    else {
      setFilteredEvents(
        events.filter(
          (e) =>
            e.title.toLowerCase().includes(query) ||
            (e.place_name && e.place_name.toLowerCase().includes(query))
        )
      );
    }
  }, [search, events]);

  if (loading) return <Spinner size="lg" text="Loading events…" />;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* 🌈 BACKGROUND GLOW (PUSHED DOWN) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-fuchsia-500/40 rounded-full blur-[160px]" />
      </div>

      {/* 🛡 DARK SHIELD FOR NAVBAR */}
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 py-14">
        {/* 🧠 HEADER */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Discover Events
          </h1>
          <p className="text-white/70 max-w-2xl">
            Premium experiences, curated for you.
          </p>
        </div>

        {/* 🔍 SEARCH (GLASS) */}
        <div className="mb-14 max-w-md">
          <input
            type="text"
            placeholder="Search by event or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-white/20 backdrop-blur-xl
                       border border-white/30 px-5 py-3 text-white
                       placeholder-white/60 focus:ring-2 focus:ring-white/50
                       outline-none shadow-lg"
          />
        </div>

        {/* EMPTY */}
        {filteredEvents.length === 0 && (
          <EmptyState
            title="No Events Found"
            description="Try a different keyword."
          />
        )}

        {/* 🎟 EVENT GRID */}
        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="group relative rounded-3xl overflow-hidden
                           bg-white/15 backdrop-blur-2xl
                           border border-white/25
                           shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                           transition-all duration-500
                           hover:bg-white/25 hover:-translate-y-3"
              >
                {/* ✨ GLASS SHINE */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                </div>

                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      No Image
                    </div>
                  )}

                  {/* 🎬 CINEMATIC DARK OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="relative p-6 text-white">
                  <h2 className="text-xl font-bold leading-snug mb-2">
                    {event.title}
                  </h2>

                  {event.place_name && (
                    <p className="text-sm text-white/70 mb-2">
                      📍 {event.place_name}
                    </p>
                  )}

                  <p className="text-sm text-white/70 mb-3">
                    🗓 {new Date(event.date).toLocaleString()}
                  </p>

                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold
                      ${
                        event.category === "free"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-300/30"
                          : "bg-indigo-400/20 text-indigo-300 border border-indigo-300/30"
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
        )}
      </div>
    </div>
  );
}
