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

      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (image) formData.append("image", image);

      await api.post("/events/events/", formData);

      successToast("Event submitted for admin approval 🎉");
      navigate("/hosted-events");
    } catch {
      errorToast("Failed to create event");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-fuchsia-500/40 rounded-full blur-[160px]" />
      </div>

      {/* 🛡 TOP DARK SHIELD */}
      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto pt-25 px-6 py-14">
        {/* GLASS FORM CARD */}
        <div
          className="bg-white/15 backdrop-blur-2xl
                     border border-white/25
                     rounded-3xl
                     shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                     p-8"
        >
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Host an Event
          </h1>
          <p className="text-white/70 mb-8">
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
              <label className="block text-sm font-medium text-white/80 mb-2">
                Event Poster
              </label>

              <div className="border-2 border-dashed border-white/30 rounded-xl p-4 text-center hover:border-indigo-400 transition">
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
                    <p className="text-white/60">
                      Click to upload event poster
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* INPUTS */}
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3
                         text-white placeholder-white/50
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <textarea
              name="description"
              rows="4"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3
                         text-white placeholder-white/50
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3
                         text-white focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="free">Free Event</option>
              <option value="paid">Paid Event</option>
            </select>

            {form.category === "paid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Ticket Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="rounded-xl bg-white/20 backdrop-blur-xl
                             border border-white/30 px-4 py-3
                             text-white placeholder-white/50 outline-none"
                />
                <input
                  type="text"
                  name="upi_id"
                  placeholder="UPI ID"
                  value={form.upi_id}
                  onChange={handleChange}
                  required
                  className="rounded-xl bg-white/20 backdrop-blur-xl
                             border border-white/30 px-4 py-3
                             text-white placeholder-white/50 outline-none"
                />
              </div>
            )}

            <input
              type="text"
              name="place_name"
              placeholder="Venue Name"
              value={form.place_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3
                         text-white placeholder-white/50 outline-none"
            />

            <input
              type="text"
              name="location"
              placeholder="Google Maps Link"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/20 backdrop-blur-xl
                         border border-white/30 px-4 py-3
                         text-white placeholder-white/50 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="rounded-xl bg-white/20 backdrop-blur-xl
                           border border-white/30 px-4 py-3
                           text-white outline-none"
              />
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="rounded-xl bg-white/20 backdrop-blur-xl
                           border border-white/30 px-4 py-3
                           text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600
                         text-white py-3 rounded-xl font-semibold
                         transition active:scale-95 disabled:opacity-60"
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
