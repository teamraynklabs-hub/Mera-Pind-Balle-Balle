"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function CareersForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const base = getBaseUrl();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        position: form.position.trim(),
        message: form.message.trim() || undefined,
      };

      await axios.post(`${base}/api/careers`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSent(true);
      setForm({ name: "", email: "", phone: "", position: "", message: "" });
    } catch (err: any) {
      console.error("CAREERS FORM ERROR:", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to submit application. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-accent p-8 rounded-xl shadow mb-20">
      <h2 className="text-2xl font-semibold mb-6">Submit Your Application</h2>

      {sent && (
        <div className="p-4 mb-6 bg-green-100 border border-green-200 text-green-800 rounded-lg">
          Application submitted successfully! We'll get back to you soon.
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email Address *</label>
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Position Applying For *</label>
          <input
            type="text"
            placeholder="e.g. Field Coordinator, Marketing Executive"
            required
            className="w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">
            Cover Letter / Message (optional)
          </label>
          <textarea
            placeholder="Tell us about yourself, your experience, and why you'd like to join..."
            rows={5}
            className="w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-8 py-3 bg-primary text-white font-medium rounded-md
              transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}