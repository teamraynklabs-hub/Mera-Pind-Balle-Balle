import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Mera Pind Balle Balle",
  description:
    "Get in touch with Mera Pind Balle Balle for inquiries, support, partnerships, or distribution opportunities.",
};

export default function ContactPage() {
  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 py-12 w-full">

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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* LEFT INFO */}
        <div className="space-y-8">

          <div>
            <h3 className="text-2xl font-semibold mb-2">Office Address</h3>
            <p className="text-muted-foreground leading-relaxed">
              Village Development Office <br />
              Near Central Market <br />
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
            <p className="text-muted-foreground leading-relaxed">
              Monday – Saturday <br />
              10:00 AM – 6:00 PM
            </p>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="w-full">
          <ContactForm />
        </div>

      </section>
    </main>
  );
}
