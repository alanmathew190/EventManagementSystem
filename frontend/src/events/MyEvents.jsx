import { useEffect, useState } from "react";
import api from "../api/axios";
import { QRCodeCanvas } from "qrcode.react";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/events/my-events/");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error("Failed to load joined events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredEvents(
      events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.place_name.toLowerCase().includes(query)
      )
    );
  }, [search, events]);

  if (loading) return <Spinner size="lg" text="Loading your events…" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-fuchsia-500/40 rounded-full blur-[160px]" />
      </div>

      {/* 🛡 TOP DARK SHIELD */}
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        {/* HEADER */}
        <div className="mb-10 pt-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">My Events</h1>
          <p className="text-white/70">
            Search events and access your QR tickets.
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by event name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mb-10 rounded-2xl
                     bg-white/20 backdrop-blur-xl
                     border border-white/30 px-5 py-3
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-white/50
                     outline-none shadow-lg"
        />

        {/* EMPTY STATES */}
        {events.length === 0 && (
          <EmptyState
            title="No Registrations"
            description="You haven’t joined any events yet."
            actionLabel="Browse Events"
            onAction={() => navigate("/events")}
          />
        )}

        {events.length > 0 && filteredEvents.length === 0 && (
          <EmptyState
            title="No Matching Events"
            description="Try searching with a different event name or location."
          />
        )}

        {/* EVENT GRID */}
        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event) => {
              const isCompleted = new Date(event.date) < new Date();

              return (
                <div
                  key={event.event_id}
                  onClick={() => event.is_approved && setSelectedEvent(event)}
                  className="cursor-pointer group rounded-3xl overflow-hidden
                             bg-white/15 backdrop-blur-2xl
                             border border-white/25
                             shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                             transition-all duration-500
                             hover:bg-white/25 hover:-translate-y-3"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60">
                        No Poster
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* BADGES */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            event.category === "free"
                              ? "bg-emerald-400/30 text-emerald-200 border border-emerald-300/30"
                              : "bg-indigo-400/30 text-indigo-200 border border-indigo-300/30"
                          }`}
                      >
                        {event.category === "free" ? "Free" : "Paid"}
                      </span>

                      {isCompleted && (
                        <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* TITLE */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h2 className="text-lg font-bold text-white">
                        {event.title}
                      </h2>
                      <p className="text-sm text-white/70">
                        📍 {event.place_name}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-white">
                    <p className="text-sm text-white/70">
                      🗓 {new Date(event.date).toLocaleString()}
                    </p>

                    {!event.is_approved && (
                      <p className="mt-2 text-sm text-amber-300 font-medium">
                        ⏳ Waiting for host approval
                      </p>
                    )}

                    {event.is_approved && (
                      <p className="mt-2 text-sm text-indigo-300 font-semibold">
                        Tap to view QR ticket →
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔳 QR MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm
                     flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white/15 backdrop-blur-2xl
                       border border-white/25
                       rounded-3xl p-6 w-[360px]
                       text-center relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-1">{selectedEvent.title}</h2>

            <p className="text-sm text-white/70 mb-4">
              Entry Pass – Show this at the entrance
            </p>

            <div className="border border-white/30 rounded-xl p-5 bg-black/30 mb-4">
              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  value={selectedEvent.qr_token}
                  size={200}
                  bgColor="#000000"
                  fgColor="#ffffff"
                  level="H"
                />
              </div>

              <div className="bg-black/40 border border-white/20 rounded-lg px-3 py-2">
                <p className="text-[11px] text-white/50 mb-1">QR Token</p>
                <p className="text-[11px] font-mono text-white break-all">
                  {selectedEvent.qr_token}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/50">
              Please keep this ticket safe until event entry
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
