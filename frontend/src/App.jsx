import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Home from "./pages/Home";
import EventList from "./events/EventList";
import EventDetail from "./events/EventDetail";
import CreateEvent from "./host/CreateEvent";
import ScanQR from "./admin/ScanQR";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      {/* Navbar shown only when logged in (optional logic inside Navbar) */}
      <Navbar />

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/events" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/scan"
          element={
            <ProtectedRoute>
              <ScanQR />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
