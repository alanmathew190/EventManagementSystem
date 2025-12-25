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

      // optional redirect after 2 seconds
      setTimeout(() => navigate("/events"), 2000);
    } catch (err) {
      setError("Failed to create event");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {form.category === "paid" && (
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        )}

        <input
          type="text"
          name="place_name"
          placeholder="Place name (e.g., Lulu Mall Kochi)"
          value={form.place_name}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          type="text"
          name="location"
          placeholder="Google Maps link ( Open Google Maps → Share → Copy link )"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Create Event
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
