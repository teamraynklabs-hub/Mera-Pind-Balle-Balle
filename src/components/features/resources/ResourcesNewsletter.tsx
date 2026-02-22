"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function ResourcesNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      // TODO: Replace with POST /api/newsletter when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Subscribed! You'll receive updates on new resources.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/[0.03] via-transparent to-primary/[0.02]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stay Updated
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Subscribe to receive notifications when we add new resources,
              catalogs, and educational materials.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-11 px-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--gold)] text-[var(--gold-foreground)] font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_var(--gold)/30] hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-[var(--gold-foreground)]/30 border-t-[var(--gold-foreground)] rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
