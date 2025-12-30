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
    return <p className="p-6 font-bold text-center text-gray-600"> <Spinner size="lg" />
      Loading pending events…</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        {events.length === 0 && (
          <EmptyState
            title="No Pending Approvals"
            description="All events are reviewed. Great job!"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border shadow-sm"
            >
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p className="text-sm text-gray-600">📍 {event.place_name}</p>

                <div className="flex gap-2 mt-4">
                  {/* VIEW */}
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setConfirmApprove(false);
                    }}
                    className="flex-1 border border-indigo-500 text-indigo-600 py-2 rounded-xl"
                  >
                    View Details
                  </button>

                  {/* APPROVE */}
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setConfirmApprove(true);
                    }}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
