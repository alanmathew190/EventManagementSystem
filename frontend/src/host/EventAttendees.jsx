import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function EventAttendees() {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/events/hosted/${eventId}/attendees/`)
      .then((res) => {
        setAttendees(res.data.attendees);
        setEventTitle(res.data.event);
      })
      .catch(() => {
        setError("Failed to load attendees");
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const approveAttendee = async (registrationId) => {
    try {
      await api.post(`/events/approve/${registrationId}/`);

      // Update UI instantly
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === registrationId ? { ...a, is_approved: true } : a
        )
      );
    } catch (err) {
      alert("Approval failed");
    }
  };

  const filteredAttendees = attendees.filter((a) =>
    a.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading attendees...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendees – {eventTitle}</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full border p-2 rounded"
      />

      {filteredAttendees.length === 0 && (
        <p className="text-gray-600">No matching attendees found.</p>
      )}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Username</th>
            <th className="border p-2 text-center">Attendance</th>
            <th className="border p-2 text-center">Scanned At</th>
            <th className="border p-2 text-center">Approval</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendees.map((a, index) => (
            <tr key={index}>
              <td className="border p-2">{a.username}</td>
              <td className="border p-2 text-center">
                {a.is_scanned ? "✅ Present" : "⏳ Not Scanned"}
              </td>
              <td className="border p-2 text-center">
                {a.scanned_at ? new Date(a.scanned_at).toLocaleString() : "-"}
              </td>
              <td className="border p-2 text-center">
                {a.is_approved ? (
                  <span className="text-green-600 font-semibold">Approved</span>
                ) : (
                  <button
                    onClick={() => approveAttendee(a.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
