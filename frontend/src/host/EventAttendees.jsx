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

      setAttendees((prev) =>
        prev.map((a) =>
          a.id === registrationId ? { ...a, is_approved: true } : a
        )
      );
    } catch {
      alert("Approval failed");
    }
  };

  const filteredAttendees = attendees.filter((a) =>
    a.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6 text-gray-600">Loading attendees…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Attendees</h1>
          <p className="text-gray-600">
            {eventTitle} — Manage approvals and attendance
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Empty */}
        {filteredAttendees.length === 0 && (
          <p className="text-gray-500">No matching attendees found.</p>
        )}

        {/* Table */}
        {filteredAttendees.length > 0 && (
          <div className="overflow-x-auto bg-white border rounded-2xl shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="border p-2">Payment Ref</th>

                  <th className="p-3 text-center text-sm font-semibold text-gray-700">
                    Attendance
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">
                    Scanned At
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">
                    Approval
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendees.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Username */}
                    <td className="p-3 text-sm text-gray-900 font-medium">
                      {a.username}
                    </td>
                    {/* paymentid */}
                    <td className="border p-2 text-sm font-mono">
                      {a.payment_reference || "-"}
                    </td>

                    {/* Attendance */}
                    <td className="p-3 text-center">
                      {a.is_scanned ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Present
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Not Scanned
                        </span>
                      )}
                    </td>

                    {/* Scanned Time */}
                    <td className="p-3 text-center text-sm text-gray-600">
                      {a.scanned_at
                        ? new Date(a.scanned_at).toLocaleString()
                        : "—"}
                    </td>

                    {/* Approval */}
                    <td className="p-3 text-center">
                      {a.is_approved ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => approveAttendee(a.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
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
        )}
      </div>
    </div>
  );
}
