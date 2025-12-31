import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { successToast, errorToast } from "../utils/toast";
import Spinner from "../components/Spinner";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/events/events/${id}/`)
      .then((res) => setEvent(res.data))
      .catch(() => errorToast("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const joinEvent = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/events/events/${id}/join/`);

      if (event.category === "free") {
        successToast("Joined event successfully 🎉");
        setTimeout(() => navigate("/my-events"), 1200);
        return;
      }

      const registrationId = res.data.registration_id;
      if (!registrationId) {
        errorToast("Registration failed");
        return;
      }

      const orderRes = await api.post(
        `/events/payments/create/${registrationId}/`
      );

      const options = {
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "EventSphere",
        description: orderRes.data.event,
        order_id: orderRes.data.order_id,
        handler: async function (response) {
          try {
            await api.post("/events/payments/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            successToast("Payment successful 🎉");
            navigate("/my-events");
          } catch {
            errorToast("Payment verification failed");
          }
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      errorToast(err.response?.data?.error || "Failed to join event");
    } finally {
      setActionLoading(false);
      setConfirmJoin(false);
    }
  };

  if (loading) return <Spinner size="lg" />;

  if (!event) return null;

  const isFull = event.attendees_count >= event.capacity;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-fuchsia-500/40 rounded-full blur-[160px]" />
      </div>

      {/* NAV SHIELD */}
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-16">
        <div className="rounded-3xl overflow-hidden bg-white/15 backdrop-blur-2xl border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* IMAGE */}
          {event.image && (
            <div className="relative h-[420px]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* TITLE */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                  {event.title}
                </h1>
                <p className="text-white/80 text-sm">📍 {event.place_name}</p>

                {/* BADGES */}
                <div className="flex gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        event.category === "free"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-300/30"
                          : "bg-indigo-400/20 text-indigo-300 border border-indigo-300/30"
                      }`}
                  >
                    {event.category === "free"
                      ? "Free Event"
                      : `Paid • ₹${event.price}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div className="p-8 text-white space-y-6">
            <a
              href={event.location}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-indigo-300 hover:underline"
            >
              View on Google Maps →
            </a>

            <p className="text-white/80 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/70">
              <p>🗓 {new Date(event.date).toLocaleString()}</p>
              <p>
                👥 {event.attendees_count} / {event.capacity}
              </p>
            </div>

            {/* JOIN BUTTON */}
            <button
              disabled={isFull}
              onClick={() => setConfirmJoin(true)}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition
                ${
                  isFull
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white"
                }`}
            >
              {isFull
                ? "Event Full 🚫"
                : event.category === "paid"
                ? `Join & Pay ₹${event.price}`
                : "Join Event"}
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmJoin}
        title="Join Event"
        message="Are you sure you want to join this event?"
        confirmText="Yes, Join"
        onConfirm={joinEvent}
        onCancel={() => setConfirmJoin(false)}
        loading={actionLoading}
      />
    </div>
  );
}
