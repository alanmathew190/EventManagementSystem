import { useEffect, useState } from "react";
import api from "../api/axios";
import EventDetailsModal from "../components/EventDetailsModal";
import { successToast, errorToast } from "../utils/toast";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api
      .get("/events/admin/events/pending/")
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const approveEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    try {
      await api.post(`/events/admin/events/${selectedEvent.id}/approve/`);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      successToast("Event approved successfully 🎉");
      setSelectedEvent(null);
      setConfirmApprove(false);
    } catch {
      errorToast("Event approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" text="Loading pending events…" />;
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

      {/* 🛡 NAVBAR SHIELD */}
      <div
        className="absolute top-0 left-0 w-full h-36
                      bg-gradient-to-b from-black via-black/90 to-transparent
                      pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Admin Panel
          </h1>
          <p className="text-white/70 max-w-2xl">
            Review and approve events submitted by hosts.
          </p>
        </div>

        {events.length === 0 && (
          <EmptyState
            title="No Pending Approvals"
            description="All events are reviewed. Great job!"
          />
        )}

        {/* EVENT GRID */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl overflow-hidden
                           bg-white/15 backdrop-blur-2xl
                           border border-white/25
                           shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                           transition-all duration-500
                           hover:bg-white/25 hover:-translate-y-2"
              >
                <div className="p-6 text-white space-y-2">
                  <h2 className="text-lg font-bold leading-snug">
                    {event.title}
                  </h2>
                  <p className="text-sm text-white/70">📍 {event.place_name}</p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setConfirmApprove(false);
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20
                                 active:scale-95 text-white
                                 py-2 rounded-xl text-sm font-semibold
                                 transition border border-white/25"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setConfirmApprove(true);
                      }}
                      className="flex-1 bg-emerald-400/80 hover:bg-emerald-500
                                 active:scale-95 text-white
                                 py-2 rounded-xl text-sm font-semibold
                                 transition shadow"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        <EventDetailsModal
          open={!!selectedEvent}
          event={selectedEvent}
          confirmApprove={confirmApprove}
          onClose={() => {
            setSelectedEvent(null);
            setConfirmApprove(false);
          }}
          onApprove={approveEvent}
          loading={actionLoading}
        />
      </div>
    </div>
  );
}
