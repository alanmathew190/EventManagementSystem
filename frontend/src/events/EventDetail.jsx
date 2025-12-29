import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [registrationId, setRegistrationId] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const [paymentRef, setPaymentRef] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/events/${id}/`);
        setEvent(res.data);
      } catch {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    setError("");
    setMessage("");

    try {
      const res = await api.post(`/events/events/${id}/join/`);

      if (res.data.registration_id) {
        setRegistrationId(res.data.registration_id);
        setShowPayment(true);
        setMessage("💰 Registered. Please complete payment.");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join event");
    }
  };

  const handlePayment = async () => {
    setError("");
    setMessage("");

    if (!paymentRef.trim()) {
      setError("Please enter payment reference ID");
      return;
    }

    try {
      await api.post(`/events/payments/confirm/${registrationId}/`, {
        payment_reference: paymentRef,
      });

      setMessage("✅ Payment submitted. Waiting for host approval.");
      setShowPayment(false);
    } catch {
      setError("Payment submission failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {/* 🎨 EVENT POSTER */}
          {event.image ? (
            <div className="relative w-full h-72 md:h-96 mb-6 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Title on Poster */}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {event.title}
                </h1>
                <p className="text-sm text-gray-200 mt-1">
                  📍 {event.place_name}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-72 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center text-gray-500">
              No event poster uploaded
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Meta */}
          <div className="space-y-2 text-sm text-gray-600">
            {event.location && (
              <a
                href={event.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View on Google Maps
              </a>
            )}

            <p>🗓 {new Date(event.date).toLocaleString()}</p>
            <p>
              👥 Capacity: {event.attendees_count} / {event.capacity}
            </p>
          </div>

          {/* Category */}
          <div className="mt-4">
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                event.category === "free"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {event.category === "free"
                ? "Free Event"
                : `Paid Event • ₹${event.price}`}
            </span>
          </div>

          {/* JOIN BUTTON */}
          {!registrationId && (
            <button
              onClick={handleJoin}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Join Event
            </button>
          )}

          {/* PAYMENT SECTION */}
          {showPayment && event.category === "paid" && (
            <div className="mt-6 p-5 border rounded-xl bg-yellow-50">
              <p className="font-semibold text-gray-800 mb-1">
                Payment Required
              </p>

              <p className="text-sm text-gray-700">
                Pay to UPI ID:
                <span className="ml-2 font-mono text-blue-600">
                  {event.upi_id}
                </span>
              </p>

              <input
                type="text"
                placeholder="Enter Payment Reference ID"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full mt-4 border p-2 rounded"
              />

              <button
                onClick={handlePayment}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition"
              >
                I Have Paid
              </button>

              <p className="text-xs text-gray-600 mt-2">
                Enter the transaction/reference ID you received after payment.
              </p>
            </div>
          )}

          {/* Messages */}
          {message && (
            <p className="mt-6 text-center text-emerald-600 font-medium">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-6 text-center text-red-600 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
