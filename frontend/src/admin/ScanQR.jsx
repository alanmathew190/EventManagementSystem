import { useState } from "react";
import api from "../api/axios";

export default function ScanQR() {
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setResult(null);

    if (!qrToken.trim()) {
      setError("QR token is required");
      return;
    }

    try {
      const res = await api.post("/events/events/scan-qr/", {
        qr_token: qrToken,
      });

      setMessage("✅ Attendance marked successfully");
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Invalid or already scanned QR"
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan Event QR</h1>

      <form onSubmit={handleScan} className="space-y-4">
        <input
          type="text"
          placeholder="Paste QR token (UUID)"
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Scan QR
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-semibold">{message}</p>
      )}

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-4 border p-3 rounded bg-gray-50">
          <p>
            <strong>User:</strong> {result.user}
          </p>
          <p>
            <strong>Event:</strong> {result.event}
          </p>
          <p>
            <strong>Scanned At:</strong>{" "}
            {new Date(result.scanned_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
