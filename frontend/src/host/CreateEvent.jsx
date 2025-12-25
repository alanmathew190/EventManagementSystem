import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "free",
    place_name: "",
    location: "",
    date: "",
    capacity: 50,
    price: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        price: form.category === "paid" ? form.price : null,
      };

      await api.post("/events/events/", payload);

      setMessage("✅ Event created successfully. Waiting for admin approval.");

      setTimeout(() => navigate("/events"), 2000);
    } catch {
      setError("Failed to create event. Please check the details.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Host an Event
          </h1>
          <p className="text-gray-600 mb-8">
            Create and publish your event on <strong>EventSphere</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="free">Free Event</option>
                <option value="paid">Paid Event</option>
              </select>
            </div>

            {/* Price */}
            {form.category === "paid" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upi_id"
                  placeholder="UPI ID (e.g. alan@okaxis)"
                  value={form.upi_id}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* Place Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue Name
              </label>
              <input
                type="text"
                name="place_name"
                placeholder="e.g. Lulu Mall, Kochi"
                value={form.place_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Google Maps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link
              </label>
              <input
                type="text"
                name="location"
                placeholder="Paste Google Maps share link"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Date & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Create Event
            </button>
          </form>

          {/* Messages */}
          {message && (
            <p className="mt-6 text-emerald-600 font-medium text-center">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-6 text-red-600 font-medium text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
