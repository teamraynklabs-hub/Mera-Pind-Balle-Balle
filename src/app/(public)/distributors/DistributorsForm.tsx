"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function DistributorsForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",       // ← changed from "business"
    message: "",       // we'll decide what to do with this
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const base = getBaseUrl();

      // Only send fields that exist in the schema
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        website: form.website.trim() || undefined,   // optional
        // message → ignored / or store elsewhere (see alternatives below)
      };

      await axios.post(`${base}/api/distributors`, payload);

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", website: "", message: "" });
    } catch (err: any) {
      console.error("Distributor submit error:", err);
      setError(
        err.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-20 bg-accent p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Distributor Inquiry Form</h2>

      {submitted && (
        <p className="p-3 mb-6 bg-green-100 text-green-800 rounded-lg">
          Thank you! Your distributor request has been submitted successfully.
        </p>
      )}

      {error && (
        <p className="p-3 mb-6 bg-red-100 text-red-800 rounded-lg">
          {error}
        </p>
      )}

      <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-md bg-background"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address *</label>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-md bg-background"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number *</label>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-md bg-background"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Business / Company Website (optional)
          </label>
          <input
            type="url"
            placeholder="https://your-business.com"
            className="w-full p-3 border rounded-md bg-background"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        {/* Optional: keep message visible but don't send it to Distributor model */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Message / Additional Information (optional)
          </label>
          <textarea
            placeholder="Tell us more about your interest or business..."
            rows={4}
            className="w-full p-3 border rounded-md bg-background"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}