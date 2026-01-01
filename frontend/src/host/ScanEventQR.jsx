import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { successToast, errorToast } from "../utils/toast";

export default function ScanQR() {
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);
  const hasScanned = useRef(false); // 🔒 prevents multiple scans

  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
        },
        async (decodedText) => {
          // ❌ Ignore if already scanned
          if (hasScanned.current) return;

          hasScanned.current = true;

          try {
            await api.post("/events/events/scan-qr/", {
              qr_token: decodedText,
            });

            successToast("Attendance marked successfully ✔");

            // 🛑 Stop scanner completely
            await html5QrCode.stop();
            await html5QrCode.clear();

            // 🔁 Redirect back after short delay
            setTimeout(() => {
              navigate("/events/attendees");
            }, 1200);
          } catch (err) {
            hasScanned.current = false; // allow retry only on failure
            errorToast(
              err.response?.data?.error || "Invalid or already scanned QR"
            );
          }
        }
      )
      .catch(() => {
        errorToast("Camera access denied or unavailable");
      });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scan Attendee QR
          </h1>

          <p className="text-gray-600 mb-6">
            Align the QR code inside the frame
          </p>

          {/* Scanner Box */}
          <div className="relative">
            <div
              id="qr-reader"
              className="w-full rounded-xl overflow-hidden border border-gray-200"
            />

            {/* Overlay */}
            <div className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-indigo-500/30" />
          </div>

          {/* Helper text */}
          <p className="mt-4 text-sm text-gray-500">
            Scanner will automatically close after successful scan
          </p>
        </div>
      </div>
    </div>
  );
}
