export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
        <svg
          className="h-10 w-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-6 4h6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

      <p className="text-gray-600 max-w-md mb-6">{description}</p>

      {/* Action */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
