"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function CareersForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = getBaseUrl();
      await axios.post(`${base}/api/careers`, form);
      setSent(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
    } catch (error) {
      console.error("CAREERS FORM ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-accent p-8 rounded-xl shadow mb-20">
      <h2 className="text-2xl font-semibold mb-4">
        Submit Your Application
      </h2>

      {sent && (
        <p className="p-3 mb-6 bg-green-200 text-green-800 rounded-lg">
          Application submitted successfully!
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
        />

        <input
          type="text"
          placeholder="Position Applying For"
          className="p-3 border rounded-md bg-background"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        />

        <textarea
          placeholder="Your Message"
          rows={4}
          className="md:col-span-2 p-3 border rounded-md bg-background"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-md text-sm hover:opacity-90 transition md:col-span-2"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

      </form>
    </section>
  );
}
