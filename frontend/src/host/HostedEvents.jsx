import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function HostedEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events/hosted/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
     .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hosted Events
          </h1>
          <p className="text-gray-600">
            Manage your events, approve attendees, and scan entry QR codes.
          </p>
        </div>

        {loading && (
          <p className="p-6 font-bold text-center text-gray-600">
            {" "}
            <Spinner size="lg" />
            Loading events you hosted…
          </p>
        )}

        {!loading && events.length === 0 && (
          <EmptyState
            title="No Hosted Events"
            description="You haven’t hosted any events yet. Create one and start managing attendees."
            actionLabel="Create Event"
            onAction={() => navigate("/host/create")}
          />
        )}

        {/* EVENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
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

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    event.approved
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {event.approved ? "Approved" : "Pending"}
                </span>

                {/* TITLE */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-2">
                <p className="text-sm text-gray-600">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600">
                  👥 Attendees:{" "}
                  <strong>
                    {event.attendees_count}/{event.capacity}
                  </strong>
                </p>

                {!event.approved && (
                  <p className="text-sm font-medium text-amber-600">
                    ⏳ Awaiting admin approval
                  </p>
                )}

                {/* ACTIONS */}
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={() =>
                      navigate(`/hosted-events/${event.id}/attendees`)
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition"
                  >
                    View Attendees
                  </button>

                  <button
                    onClick={() => navigate(`/host/scan/${event.id}`)}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl text-sm font-semibold transition"
                  >
                    Scan QR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
