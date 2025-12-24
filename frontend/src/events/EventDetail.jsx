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
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
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

      // 🆓 Free event
      if (res.data.qr_code) {
        setMessage("🎉 Successfully joined!");
        setQrImage(res.data.qr_code);
      }

      // 💰 Paid event
      if (res.data.registration_id) {
        setRegistrationId(res.data.registration_id);
        setMessage("💰 Registration created. Please complete payment.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join event");
    }
  };

  const handlePayment = async () => {
    setError("");
    setMessage("");

    try {
      const res = await api.post(`/events/payments/confirm/${registrationId}/`);

      console.log("Payment response:", res.data); // 🔍 DEBUG

      setQrImage(res.data.qr_image); // ✅ MUST MATCH BACKEND KEY
      setMessage("✅ Payment successful. QR generated.");
    } catch (err) {
      setError("Payment failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>

      <p className="text-gray-700 mb-4">{event.description}</p>

      <p className="text-gray-700">
        Location: <strong>{event.place_name}</strong>
      </p>

      {event.location && (
        <a
          href={event.location}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-600 underline"
        >
          📍 View on Google Maps
        </a>
      )}

      <p className="text-sm text-gray-600 mb-2">
        🗓 {new Date(event.date).toLocaleString()}
      </p>

      <p className="text-sm text-gray-600 mb-4">
        👥 Capacity: {event.attendees_count} / {event.capacity}
      </p>

      <span
        className={`inline-block px-3 py-1 rounded text-sm mb-4 ${
          event.category === "free"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {event.category === "free"
          ? "Free Event"
          : `Paid Event • ₹${event.price}`}
      </span>

      {!qrImage && (
        <button
          onClick={handleJoin}
          className="block w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          Join Event
        </button>
      )}

      {/* 💳 Payment UI */}
      {registrationId && !qrImage && (
        <button
          onClick={handlePayment}
          className="block w-full mt-4 bg-green-600 text-white py-2 rounded"
        >
          Pay Now
        </button>
      )}

      {/* 🎟️ QR Display */}
      {qrImage !== null && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-semibold mb-2">
            Show this QR at the event
          </p>
          <img
            src={`http://127.0.0.1:8000${qrImage}`}
            alt="Event QR"
            className="mx-auto border p-2"
          />
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
