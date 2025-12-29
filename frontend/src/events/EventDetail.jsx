import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { successToast, errorToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";


export default function EventDetail() {
  const { id } = useParams();
const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [registrationId, setRegistrationId] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");

  const [confirmJoin, setConfirmJoin] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

useEffect(() => {
  api
    .get(`/events/events/${id}/`)
    .then((res) => {
      setEvent(res.data);

      // ✅ IMPORTANT PART
      if (res.data.user_registration) {
        setRegistrationId(res.data.user_registration.id);

        if (res.data.user_registration.status === "pending_payment") {
          setShowPayment(true);
        }
      }
    })
    .catch(() => errorToast("Failed to load event"))
    .finally(() => setLoading(false));
}, [id]);
  
  const joinEvent = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/events/events/${id}/join/`);

      if (res.data.registration_id) {
        // Paid event → show payment
        setRegistrationId(res.data.registration_id);
        setShowPayment(true);
        successToast("Registered! Please complete payment 💰");
      } else {
        // Free event → join complete
        successToast(res.data.message || "Joined event successfully 🎉");

        // ✅ REDIRECT after short delay
        setTimeout(() => {
          navigate("/my-events");
        }, 1200);
      }
    } catch (err) {
      errorToast(err.response?.data?.error || "Failed to join event");
    } finally {
      setActionLoading(false);
      setConfirmJoin(false);
    }
  };

  const submitPayment = async () => {
    if (!paymentRef.trim()) {
      errorToast("Please enter payment reference ID");
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/events/payments/confirm/${registrationId}/`, {
        payment_reference: paymentRef,
      });

      successToast("Payment submitted ✔ Waiting for approval");
      setShowPayment(false);
    } catch {
      errorToast("Payment submission failed");
    } finally {
      setActionLoading(false);
      setConfirmPay(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {/* POSTER */}
          {event.image && (
            <div className="relative h-80 mb-6 rounded-2xl overflow-hidden">
              <img src={event.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-sm">📍 {event.place_name}</p>
              </div>
            </div>
          )}
          <a
            href={event.location}
            target="blank"
            className="text-blue-700 mb-6 "
          >
            Click here to view On Google Maps
          </a>
          <p className="text-gray-700 mb-6">{event.description}</p>

          <p>🗓 {new Date(event.date).toLocaleString()}</p>
          <p>
            👥 {event.attendees_count} / {event.capacity}
          </p>

          {!event?.user_registration && (
            <button
              onClick={() => setConfirmJoin(true)}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl"
            >
              Join Event
            </button>
          )}

          {showPayment && event.category === "paid" && (
            <div className="mt-6 bg-yellow-50 p-5 rounded-xl">
              <p className="font-semibold">Pay to UPI:</p>
              <p className="font-mono text-blue-600">{event.upi_id}</p>

              <input
                required
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Payment Reference ID"
                className="w-full mt-4 border p-2 rounded"
              />

              <button
                onClick={() => setConfirmPay(true)}
                className="w-full mt-4 bg-emerald-500 text-white py-3 rounded-xl"
              >
                I Have Paid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM JOIN */}
      <ConfirmModal
        open={confirmJoin}
        title="Join Event"
        message="Are you sure you want to join this event?"
        confirmText="Join"
        onConfirm={joinEvent}
        onCancel={() => setConfirmJoin(false)}
        loading={actionLoading}
      />

      {/* CONFIRM PAYMENT */}
      <ConfirmModal
        open={confirmPay}
        title="Submit Payment"
        message="Confirm that you have completed the payment?"
        confirmText="Submit Payment"
        onConfirm={submitPayment}
        onCancel={() => setConfirmPay(false)}
        loading={actionLoading}
      />
      {event?.user_registration?.status === "pending_payment" && (
        <p className="mt-4 text-yellow-600 font-medium">
          ⏳ Payment pending — please complete payment
        </p>
      )}

      {event?.user_registration?.status === "payment_submitted" && (
        <p className="mt-4 text-blue-600 font-medium">
          🕒 Payment submitted — waiting for approval
        </p>
      )}

      {event?.user_registration?.status === "approved" && (
        <p className="mt-4 text-emerald-600 font-medium">
          ✅ You are confirmed for this event
        </p>
      )}
    </div>
  );
}
