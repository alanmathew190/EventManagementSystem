import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";
import { successToast, errorToast } from "../utils/toast";

export default function ScanQR() {
  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            await api.post("/events/events/scan-qr/", {
              qr_token: decodedText,
            });

            successToast("Attendance marked successfully ✔");

            // Stop scanner after success
            html5QrCode.stop();
          } catch (err) {
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
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scan Attendee QR
          </h1>
          <p className="text-gray-600 mb-6">
            Point the camera at the attendee QR code
          </p>

          <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
        </div>
      </div>
    </div>
  );
}
