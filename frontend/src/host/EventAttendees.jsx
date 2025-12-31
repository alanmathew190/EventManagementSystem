import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

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
      .catch(() => setError("Failed to load attendees"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const filteredAttendees = attendees.filter((a) =>
    a.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Spinner size="lg" text="Loading attendees…" />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
      >
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
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

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Event Attendees
          </h1>
          <p className="text-white/70">
            {eventTitle} — attendance & payment status
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-8 max-w-sm">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-white/20 backdrop-blur-xl
                       border border-white/30 px-5 py-3 text-white
                       placeholder-white/60 focus:ring-2 focus:ring-white/50
                       outline-none shadow-lg"
          />
        </div>

        {/* EMPTY */}
        {filteredAttendees.length === 0 && (
          <EmptyState
            title="No Attendees Found"
            description="No users match your search."
          />
        )}

        {/* TABLE */}
        {filteredAttendees.length > 0 && (
          <div
            className="overflow-x-auto rounded-3xl
                       bg-white/15 backdrop-blur-2xl
                       border border-white/25
                       shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <table className="w-full border-collapse text-white">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">
                    Username
                  </th>

                  <th className="p-4 text-center text-sm font-semibold">
                    Payment
                  </th>

                  <th className="p-4 text-center text-sm font-semibold">
                    Attendance
                  </th>

                  <th className="p-4 text-center text-sm font-semibold">
                    Scanned At
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendees.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-white/15
                               hover:bg-white/10 transition"
                  >
                    {/* USERNAME */}
                    <td className="p-4 text-sm font-medium">{a.username}</td>

                    {/* PAYMENT (— FOR FREE EVENTS) */}
                    <td className="p-4 text-center">
                      {a.is_paid === null || a.is_paid === undefined ? (
                        <span className="text-white/40 text-sm">—</span>
                      ) : a.is_paid ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold
                                         bg-emerald-400/20 text-emerald-300
                                         border border-emerald-300/30"
                        >
                          Paid
                        </span>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold
                                         bg-amber-400/20 text-amber-300
                                         border border-amber-300/30"
                        >
                          Pending
                        </span>
                      )}
                    </td>

                    {/* ATTENDANCE */}
                    <td className="p-4 text-center">
                      {a.is_scanned ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold
                                         bg-emerald-400/20 text-emerald-300
                                         border border-emerald-300/30"
                        >
                          Present
                        </span>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold
                                         bg-white/20 text-white/70
                                         border border-white/25"
                        >
                          Not Scanned
                        </span>
                      )}
                    </td>

                    {/* SCAN TIME */}
                    <td className="p-4 text-center text-sm text-white/70">
                      {a.scanned_at
                        ? new Date(a.scanned_at).toLocaleString()
                        : "—"}
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
