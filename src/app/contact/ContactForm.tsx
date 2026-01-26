"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = getBaseUrl();
      await axios.post(`/api/contact`, form);

      setSent(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>

      {sent && (
        <p className="p-3 mb-6 bg-green-200 text-green-800 rounded-lg">
          Message sent successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-md bg-background"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 border rounded-md bg-background"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-md bg-background"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <textarea
          placeholder="Your Message"
          className="w-full p-3 border rounded-md bg-background"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 w-full bg-primary text-white rounded-md text-sm hover:opacity-90 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
