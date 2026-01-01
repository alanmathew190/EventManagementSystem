import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-32">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative px-6 py-16 max-w-7xl mx-auto text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-extrabold">
                ES
              </div>
              <h2 className="text-xl font-bold">EventSphere</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              EventSphere helps you discover, host, and manage events with
              secure registrations, QR-based attendance, and real-time control.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link to="/events" className="hover:text-white">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>QR Code Attendance</li>
              <li>Paid & Free Events</li>
              <li>Admin Approvals</li>
              <li>Capacity Control</li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href="mailto:eventsphereconnect@gmail.com"
                  className="hover:text-white"
                >
                  Contact Admin
                </a>
              </li>
              <li>
                <a
                  href="mailto:eventsphereconnect@gmail.com?subject=EventSphere Support"
                  className="hover:text-white"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919446631601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} EventSphere. All rights reserved.</p>

          <div className="flex gap-6">
        
            <a
              href="https://instagram.com/alan.j.mathew"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/in/alan-j-mathew"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
