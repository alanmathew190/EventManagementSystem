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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Hosted Events</h1>

      {events.length === 0 && (
        <p className="text-gray-600">You haven’t hosted any events yet.</p>
      )}

      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded mb-3 bg-white shadow">
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {event.location} • {new Date(event.date).toLocaleString()}
          </p>

          <p className="text-sm mt-1">
            Attendees: {event.attendees_count}/{event.capacity}
          </p>

          <button
            onClick={() => navigate(`/hosted-events/${event.id}/attendees`)}
            className="ml-3 bg-gray-700 text-white px-3 py-1 rounded"
          >
            View Attendees
          </button>

          {!event.approved && (
            <p className="text-red-500 text-sm mt-1">Awaiting admin approval</p>
          )}

          <button
            onClick={() => navigate(`/host/scan/${event.id}`)}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Scan QR
          </button>
          
        </div>
      ))}
    </div>
  );
}
