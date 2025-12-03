import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Mera Pind",
  description:
    "Get in touch with Mera Pind for inquiries, support, partnerships, or distribution opportunities.",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">

      {/* PAGE TITLE */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question or want to collaborate? Fill out the form below and our
          team will get back to you shortly.
        </p>
      </section>

      {/* GRID SECTION */}
      <section className="grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE INFO */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Office Address</h3>
            <p className="text-muted-foreground">
              Village Development Office<br />
              Near Central Market<br />
              Punjab, India
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">support@merapind.org</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground">+91 98765 43210</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Working Hours</h3>
            <p className="text-muted-foreground">
              Monday – Saturday<br />10:00 AM – 6:00 PM
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <ContactForm />

      </section>
    </main>
  );
}
