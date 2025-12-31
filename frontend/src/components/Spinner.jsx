export default function Spinner({ size = "md", text }) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center
                    bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
    >
      {/* 🌈 SOFT BACKGROUND GLOW */}
      <div
        className="absolute -top-40 -left-40 
                      bg-indigo-500/30 rounded-full blur-[160px]"
      />
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />
      <div
        className="absolute top-1/2 -right-40 
                      bg-fuchsia-500/30 rounded-full blur-[160px]"
      />

      {/* 🔄 SPINNER */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`
            ${sizes[size]}
            rounded-full animate-spin
            border border-white/20
            border-t-indigo-400
            shadow-[0_0_25px_rgba(99,102,241,0.7)]
          `}
        />

        {text && (
          <p className="mt-4 text-sm text-white/70 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
}
