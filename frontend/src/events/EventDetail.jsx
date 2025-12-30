import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { successToast, errorToast } from "../utils/toast";

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

      // FREE EVENT
      if (!res.data.registration_id) {
        successToast("Joined event successfully 🎉");
        setTimeout(() => navigate("/my-events"), 1200);
        return;
      }

      // PAID EVENT → Razorpay
      const registrationId = res.data.registration_id;

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
          await api.post("/events/payments/verify/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          successToast("Payment successful 🎉");
          navigate("/my-events");
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {event.image && (
            <div className="relative h-80 mb-6 rounded-2xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-sm">📍 {event.place_name}</p>
              </div>
            </div>
          )}

          <a
            href={event.location}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 block mb-4"
          >
            View on Google Maps
          </a>

          <p className="text-gray-700 mb-4">{event.description}</p>
          <p>🗓 {new Date(event.date).toLocaleString()}</p>
          <p>
            👥 {event.attendees_count} / {event.capacity}
          </p>

          <button
            onClick={() => setConfirmJoin(true)}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
          >
            {event.category === "paid"
              ? `Join & Pay ₹${event.price}`
              : "Join Event"}
          </button>
        </div>
      </div>

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
