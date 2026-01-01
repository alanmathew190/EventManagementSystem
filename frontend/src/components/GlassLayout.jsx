import Footer from "./Footer";

// components/GlassLayout.jsx
export default function GlassLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] bg-indigo-500/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] bg-fuchsia-500/40 rounded-full blur-[160px]" />
      </div>

      <div className="relative">{children}</div>
     
    </div>
  );
}
