export default function ConfirmModal({
  open,
  title = "Confirm action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        className="relative w-full max-w-sm
                   bg-white/15 backdrop-blur-2xl
                   border border-white/25
                   rounded-2xl p-6
                   shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
      >
        {/* TITLE */}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

        {/* MESSAGE */}
        <p className="text-sm text-white/75 mb-6 leading-relaxed">{message}</p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl
                       bg-white/10 hover:bg-white/20
                       border border-white/25
                       text-white text-sm font-medium
                       transition active:scale-95
                       disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl
                       bg-indigo-500 hover:bg-indigo-600
                       text-white text-sm font-semibold
                       shadow
                       transition active:scale-95
                       disabled:opacity-60"
          >
            {loading ? "Processing…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
