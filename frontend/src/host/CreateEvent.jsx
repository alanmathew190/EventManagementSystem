import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "free",
    place_name: "",
    location: "",
    date: "",
    capacity: 50,
    price: "",
    upi_id: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form.category === "free" && (key === "price" || key === "upi_id"))
          return;
        formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);

      await api.post("/events/events/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Event created successfully. Waiting for admin approval.");
      setTimeout(() => navigate("/events"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to create event. Please check the details."
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-lg border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Host an Event
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your event poster and share the details with attendees.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* POSTER UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Poster
              </label>

              <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="posterUpload"
                />
                <label htmlFor="posterUpload" className="cursor-pointer">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-500">
                      Click to upload event poster
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Type
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="free">Free Event</option>
                <option value="paid">Paid Event</option>
              </select>
            </div>

            {/* PAID DETAILS */}
            {form.category === "paid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Ticket Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  name="upi_id"
                  placeholder="UPI ID"
                  value={form.upi_id}
                  onChange={handleChange}
                  required
                  className="border rounded-lg px-4 py-2"
                />
              </div>
            )}

            {/* LOCATION */}
            <input
              type="text"
              name="place_name"
              placeholder="Venue Name"
              value={form.place_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="location"
              placeholder="Google Maps Link"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* DATE & CAPACITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />
            </div>

            {/* SUBMIT */}
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
              Create Event
            </button>
          </form>

          {message && (
            <p className="mt-6 text-green-600 text-center">{message}</p>
          )}
          {error && <p className="mt-6 text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
