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
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose} // click outside to close
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // prevent close on modal click
      >
        {/* 🖼 EVENT IMAGE */}
        {event.image ? (
          <div className="relative h-52 w-full">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Title */}
            <h2 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">
              {event.title}
            </h2>

            {/* Badge */}
            <span className="absolute top-4 right-4 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
              {event.category === "paid" ? "Paid Event" : "Free Event"}
            </span>
          </div>
        ) : (
          <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-500">
            No event poster uploaded
          </div>
        )}

        {/* 📄 CONTENT */}
        <div className="p-6 space-y-5">
          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900">📍 Location</p>
              <p>{event.place_name}</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">🗓 Date & Time</p>
              <p>{new Date(event.date).toLocaleString()}</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">👥 Capacity</p>
              <p>{event.capacity} attendees</p>
            </div>

            {event.category === "paid" && (
              <div>
                <p className="font-medium text-gray-900">💰 Price</p>
                <p className="text-indigo-600 font-semibold">₹{event.price}</p>
              </div>
            )}
          </div>

          {/* UPI */}
          {event.category === "paid" && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm">
              <p className="font-semibold text-indigo-700 mb-1">
                Organizer UPI ID
              </p>
              <p className="font-mono text-gray-800">{event.upi_id}</p>
            </div>
          )}

          {/* ⚠️ CONFIRMATION */}
          {confirmApprove && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-red-600 font-semibold">
                ⚠️ Are you sure you want to approve this event?
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            {confirmApprove && (
              <button
                onClick={onApprove}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl transition disabled:opacity-60"
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
