import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Home from "./pages/Home";
import EventList from "./events/EventList";
import EventDetail from "./events/EventDetail";
import CreateEvent from "./host/CreateEvent";

import MyEvents from "./events/MyEvents";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import HostedEvents from "./host/HostedEvents";
import ScanEventQR from "./host/ScanEventQR";
import EventAttendees from "./host/EventAttendees";
import AdminDashboard from "./admin/AdminDashboard";
import GoogleSuccess from "./pages/GoogleSuccess";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ✅ PUBLIC HOME PAGE */}
        <Route path="/" element={<Home />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
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
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
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
          path="/hosted-events"
          element={
            <ProtectedRoute>
              <HostedEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host/scan/:eventId"
          element={
            <ProtectedRoute>
              <ScanEventQR />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hosted-events/:eventId/attendees"
          element={
            <ProtectedRoute>
              <EventAttendees />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
