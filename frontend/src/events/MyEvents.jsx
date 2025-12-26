import { useEffect, useState } from "react";
import api from "../api/axios";
import { QRCodeCanvas } from "qrcode.react";


export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/events/my-events/");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load joined events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return <p className="p-8 text-gray-600">Loading your events…</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">
            Track your registrations, approvals, and event entry QR codes.
          </p>
        </div>

        {events.length === 0 && (
          <p className="text-gray-500">You haven’t joined any events yet.</p>
        )}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div
                className={`h-1 ${
                  event.category === "free" ? "bg-emerald-500" : "bg-indigo-500"
                }`}
              />
              {new Date(event.date) < new Date() && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  Completed
                </span>
              )}
              <div className="p-5">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {event.title}
                </h2>

                {/* Location */}
                <p className="text-sm text-gray-600 mb-1">
                  📍 {event.place_name}
                </p>

                {event.location && (
                  <a
                    href={event.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                )}

                {/* Date */}
                <p className="text-sm text-gray-500 mt-2">
                  🗓 {new Date(event.date).toLocaleString()}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.category === "free"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {event.category === "free" ? "Free Event" : "Paid Event"}
                  </span>

                  {event.is_scanned ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      ✅ Attended
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      ⏳ Not Scanned
                    </span>
                  )}
                </div>

                {/* Approval Status */}
                {!event.is_approved && (
                  <div className="mt-4 text-sm text-amber-600 font-medium">
                    ⏳ Waiting for host approval
                  </div>
                )}

                {/* QR Ticket */}
                {event.is_approved && event.qr_token && (
                  <div className="mt-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      🎟 Entry Ticket
                    </p>

                    {/* Centered QR */}
                    <div className="flex justify-center mb-3">
                      <QRCodeCanvas
                        value={event.qr_token}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>

                    <p className="text-[11px] text-gray-500 break-all">
                      <strong>QR Token:</strong> {event.qr_token}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Show this QR at the event entrance
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
