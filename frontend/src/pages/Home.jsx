import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { authTokens } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Event Management Platform</h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        Discover events, join workshops, and host your own events. Login or
        register to participate.
      </p>

      {!authTokens ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      ) : (
        <Link
          to="/events"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Go to Events
        </Link>
      )}
    </div>
  );
}
