import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function HostedEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/events/hosted/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hosted Events
          </h1>
          <p className="text-gray-600">
            Manage your events, approve attendees, and scan entry QR codes.
          </p>
        </div>

        {events.length === 0 && (
          <p className="text-gray-500">You haven’t hosted any events yet.</p>
        )}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Top Status Bar */}
              <div
                className={`h-1 ${
                  event.approved ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />

              <div className="p-5">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {event.title}
                </h2>

                {/* Date & Location */}
                <p className="text-sm text-gray-600 mb-1">
                  📍 {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                {/* Capacity */}
                <p className="text-sm text-gray-600 mt-2">
                  👥 Attendees:{" "}
                  <strong>
                    {event.attendees_count}/{event.capacity}
                  </strong>
                </p>

                {/* Approval Status */}
                {!event.approved ? (
                  <div className="mt-3 text-sm font-medium text-amber-600">
                    ⏳ Awaiting admin approval
                  </div>
                ) : (
                  <div className="mt-3 text-sm font-medium text-emerald-600">
                    ✅ Approved & Live
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 grid grid-cols-1 gap-3">
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
