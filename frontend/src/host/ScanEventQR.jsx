import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";
import { successToast, errorToast } from "../utils/toast";

export default function ScanQR() {
  const hasScanned = useRef(false);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
        },
        async (decodedText) => {
          // 🔒 prevent rapid duplicate scans
          if (hasScanned.current) return;

          hasScanned.current = true;

          try {
            await api.post("/events/events/scan-qr/", {
              qr_token: decodedText,
            });

            successToast("Attendance marked successfully ✔");

            // ⏱ unlock for next QR
            setTimeout(() => {
              hasScanned.current = false;
            }, 2000);
          } catch (err) {
            errorToast(
              err.response?.data?.error || "Invalid or already scanned QR"
            );

            // allow retry after error
            setTimeout(() => {
              hasScanned.current = false;
            }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scan Attendee QR
          </h1>

          <p className="text-gray-600 mb-6">
            Scan one QR at a time — scanner stays active
          </p>

          {/* Scanner Frame */}
          <div className="relative rounded-2xl p-3 bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="relative rounded-xl overflow-hidden bg-black">
              <div id="qr-reader" className="w-full aspect-square" />

              {/* Overlay */}
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/60 pointer-events-none" />

              {/* Corner markers */}
              <span className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-white" />
              <span className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-white" />
              <span className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-white" />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Ready for next scan automatically
          </p>

          <span className="mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
            EventSphere Secure Scanner
          </span>
        </div>
      </div>
    </div>
  );
}
