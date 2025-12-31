import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function HostedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/events/hosted/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner size="lg" text="Loading hosted events…" />;
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden
                    bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
    >
      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-40 -left-40 w-[500px] h-[500px]
                        bg-indigo-500/40 rounded-full blur-[160px]"
        />
        <div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px]
                        bg-fuchsia-500/40 rounded-full blur-[160px]"
        />
      </div>

      {/* 🛡 DARK SHIELD FOR NAVBAR */}
      <div
        className="absolute top-0 left-0 w-full h-36
                      bg-gradient-to-b from-black via-black/90 to-transparent
                      pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Hosted Events
          </h1>
          <p className="text-white/70 max-w-2xl">
            Manage your events, approve attendees, and scan entry QR codes.
          </p>
        </div>

        {events.length === 0 && (
          <EmptyState
            title="No Hosted Events"
            description="You haven’t hosted any events yet."
            actionLabel="Create Event"
            onAction={() => navigate("/host/create")}
          />
        )}

        {/* EVENT GRID */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative rounded-3xl overflow-hidden
                           bg-white/15 backdrop-blur-2xl
                           border border-white/25
                           shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                           transition-all duration-500
                           hover:bg-white/25 hover:-translate-y-3"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover
                                 transition-transform duration-700
                                 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      No Poster
                    </div>
                  )}

                  {/* DARK OVERLAY */}
                  <div
                    className="absolute inset-0
                                  bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                  />

                  {/* STATUS BADGE */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full
                                text-xs font-semibold backdrop-blur-xl border
                                ${
                                  event.approved
                                    ? "bg-emerald-400/20 text-emerald-300 border-emerald-300/30"
                                    : "bg-amber-400/20 text-amber-300 border-amber-300/30"
                                }`}
                  >
                    {event.approved ? "Approved" : "Pending"}
                  </span>

                  {/* TITLE */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {event.title}
                    </h2>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 text-white space-y-2">
                  <p className="text-sm text-white/70">
                    🗓 {new Date(event.date).toLocaleString()}
                  </p>

                  <p className="text-sm text-white/70">
                    👥 Attendees{" "}
                    <strong className="text-white">
                      {event.attendees_count}/{event.capacity}
                    </strong>
                  </p>

                  {!event.approved && (
                    <p className="text-sm font-medium text-amber-300">
                      ⏳ Awaiting admin approval
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-5 grid gap-3">
                    <button
                      onClick={() =>
                        navigate(`/hosted-events/${event.id}/attendees`)
                      }
                      className="w-full bg-indigo-500 hover:bg-indigo-600
                                 active:scale-95 text-white
                                 py-2.5 rounded-xl text-sm font-semibold
                                 transition shadow"
                    >
                      View Attendees
                    </button>

                    <button
                      onClick={() => navigate(`/host/scan/${event.id}`)}
                      className="w-full bg-black/60 hover:bg-black/80
                                 active:scale-95 text-white
                                 py-2.5 rounded-xl text-sm font-semibold
                                 transition border border-white/20"
                    >
                      Scan QR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
