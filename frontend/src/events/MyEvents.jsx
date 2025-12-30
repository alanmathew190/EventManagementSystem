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

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Events</h1>
          <p className="text-gray-600">
            Search events and access your QR tickets.
          </p>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by event name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mb-8 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isCompleted = new Date(event.date) < new Date();

              return (
                <div
                  key={event.event_id}
                  onClick={() => event.is_approved && setSelectedEvent(event)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
                >
                  {/* POSTER */}
                  <div className="relative h-44">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No Poster
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* BADGES */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.category === "free"
                            ? "bg-emerald-500 text-white"
                            : "bg-indigo-500 text-white"
                        }`}
                      >
                        {event.category === "free" ? "Free" : "Paid"}
                      </span>

                      {isCompleted && (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-700 text-white">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* TITLE */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h2 className="text-lg font-bold text-white leading-tight">
                        {event.title}
                      </h2>
                      <p className="text-sm text-gray-200">
                        📍 {event.place_name}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <p className="text-sm text-gray-600">
                      🗓 {new Date(event.date).toLocaleString()}
                    </p>

                    {!event.is_approved && (
                      <p className="mt-2 text-sm text-amber-600 font-medium">
                        ⏳ Waiting for host approval
                      </p>
                    )}

                    {event.is_approved && (
                      <p className="mt-2 text-sm text-indigo-600 font-semibold">
                        Tap to view QR ticket →
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR MODAL */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[360px] text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>

              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {selectedEvent.title}
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Entry Pass – Show this at the entrance
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 mb-4">
                <div className="flex justify-center mb-4">
                  <QRCodeCanvas
                    value={selectedEvent.qr_token}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>

                <div className="bg-white border rounded-lg px-3 py-2">
                  <p className="text-[11px] text-gray-500 mb-1">QR Token</p>
                  <p className="text-[11px] font-mono text-gray-800 break-all">
                    {selectedEvent.qr_token}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Please keep this ticket safe until event entry
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
