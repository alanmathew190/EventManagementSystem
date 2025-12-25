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
        setMessage("💰 Registered. Please pay and wait for host approval.");
      }

      if (res.data.message && !res.data.registration_id) {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join event");
    }
  };

  const handlePayment = async () => {
    setError("");
    setMessage("");

    try {
      await api.post(`/events/payments/confirm/${registrationId}/`);
      setMessage("✅ Payment received. Waiting for host approval.");
    } catch {
      setError("Payment failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>

      <p>
        Location: <strong>{event.place_name}</strong>
      </p>

      {event.location && (
        <a
          href={event.location}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View on Google Maps
        </a>
      )}

      <p className="text-sm text-gray-600 mt-2">
        🗓 {new Date(event.date).toLocaleString()}
      </p>

      <p className="text-sm text-gray-600">
        👥 Capacity: {event.attendees_count} / {event.capacity}
      </p>

      <span
        className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
          event.category === "free"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {event.category === "free"
          ? "Free Event"
          : `Paid Event • ₹${event.price}`}
      </span>

      {/* Payment QR */}
      {event.category === "paid" && event.payment_qr && (
        <div className="mt-4 text-center">
          <img
            src={event.payment_qr}
            alt="Payment QR"
            className="w-48 mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">
            Pay using this QR and wait for host approval.
          </p>
        </div>
      )}

      {!registrationId && (
        <button
          onClick={handleJoin}
          className="block w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          Join Event
        </button>
      )}

      {registrationId && (
        <button
          onClick={handlePayment}
          className="block w-full mt-4 bg-green-600 text-white py-2 rounded"
        >
          I Have Paid
        </button>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
