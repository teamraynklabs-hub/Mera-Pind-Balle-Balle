"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function DistributorsForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = getBaseUrl();
      await axios.post(`${base}/api/distributors`, form);

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        business: "",
        message: "",
      });
    } catch (error) {
      console.error("DISTRIBUTOR SUBMIT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-20 bg-accent p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Distributor Inquiry Form</h2>

      {submitted && (
        <p className="p-3 mb-6 bg-green-200 text-green-800 rounded-lg">
          Request submitted successfully!
        </p>
      )}

      <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border rounded-md bg-background"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="p-3 border rounded-md bg-background"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="p-3 border rounded-md bg-background"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Business Name"
          className="p-3 border rounded-md bg-background"
          value={form.business}
          onChange={(e) => setForm({ ...form, business: e.target.value })}
          required
        />

        <textarea
          placeholder="Message (Optional)"
          rows={4}
          className="p-3 border rounded-md bg-background md:col-span-2"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-md text-sm hover:opacity-90 transition md:col-span-2"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
}
