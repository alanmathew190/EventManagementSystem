import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { successToast, errorToast } from "../utils/toast";

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submitEvent = async () => {
    setLoading(true);

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

      successToast("Event created successfully 🎉 Waiting for admin approval");
      setConfirmOpen(false);

      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      errorToast(
        err.response?.data?.error ||
          "Failed to create event. Please check the details."
      );
    } finally {
      setLoading(false);
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
            className="space-y-6"
          >
            {/* POSTER */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Poster
              </label>

              <div className="border-2 border-dashed rounded-xl p-4 text-center hover:border-indigo-500 transition">
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
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              rows="4"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* CATEGORY */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="free">Free Event</option>
              <option value="paid">Paid Event</option>
            </select>

            {/* PAID */}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Create Event"
        message="Are you sure you want to create this event? It will be sent for admin approval."
        confirmText="Create Event"
        onConfirm={submitEvent}
        onCancel={() => setConfirmOpen(false)}
        loading={loading}
      />
    </div>
  );
}
