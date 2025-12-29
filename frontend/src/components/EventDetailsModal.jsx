export default function EventDetailsModal({
  open,
  event,
  confirmApprove,
  onClose,
  onApprove,
  loading,
}) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
        {/* 🖼 EVENT IMAGE */}
        {event.image ? (
          <div className="relative h-48 w-full">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h2 className="absolute bottom-3 left-4 right-4 text-lg font-bold text-white">
              {event.title}
            </h2>
          </div>
        ) : (
          <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
            No event poster uploaded
          </div>
        )}

        {/* 📄 CONTENT */}
        <div className="p-6">
          {/* DESCRIPTION */}
          <p className="text-gray-700 mb-4">{event.description}</p>

          {/* DETAILS */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>📍 {event.place_name}</p>
            <p>🗓 {new Date(event.date).toLocaleString()}</p>
            <p>👥 Capacity: {event.capacity}</p>

            {event.category === "paid" && (
              <>
                <p className="text-indigo-600 font-semibold">
                  💰 Paid Event – ₹{event.price}
                </p>
                <p className="font-mono text-gray-800">
                  UPI ID: <strong>{event.upi_id}</strong>
                </p>
              </>
            )}
          </div>

          {/* ⚠️ CONFIRMATION */}
          {confirmApprove && (
            <p className="mt-6 text-red-600 font-semibold text-center">
              ⚠️ Are you sure you want to approve this event?
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border py-2 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>

            {confirmApprove && (
              <button
                onClick={onApprove}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl"
              >
                {loading ? "Approving..." : "Yes, Approve"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
