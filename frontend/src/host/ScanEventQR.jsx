import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ScanEventQR() {
  const { eventId } = useParams();
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/events/events/scan-qr/", {
        qr_token: qrToken,
      });

      setMessage(`✅ ${res.data.user} marked present`);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or already scanned QR");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Scan QR for Event #{eventId}</h1>

      <form onSubmit={handleScan} className="space-y-3">
        <input
          type="text"
          placeholder="Paste QR token"
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Scan
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
