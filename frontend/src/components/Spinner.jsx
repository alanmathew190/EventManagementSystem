export default function Spinner({ size = "md" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${sizes[size]} border-indigo-600 mt-45 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
