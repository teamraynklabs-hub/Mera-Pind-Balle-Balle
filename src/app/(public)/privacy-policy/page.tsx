import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Mera Pind Balle Balle",
  description:
    "Read the Privacy Policy of Mera Pind Balle Balle to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-muted-foreground mb-10 max-w-3xl">
        This Privacy Policy describes how Mera Pind Balle Balle collects, uses, and protects
        your personal information when you visit or interact with our website.
        By using this website, you agree to the terms described here.
      </p>

      {/* SECTION 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="text-muted-foreground mb-3">
          We may collect the following types of information:
        </p>

        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>Personal details provided through forms (name, email, phone).</li>
          <li>Messages sent through our contact or inquiry forms.</li>
          <li>Automatically collected data such as IP address, browser type.</li>
          <li>Usage analytics for improving website performance.</li>
        </ul>
      </section>

      {/* SECTION 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>To respond to your inquiries or service requests.</li>
          <li>To provide updates, newsletters, or relevant communication.</li>
          <li>To improve website performance, user experience, and services.</li>
          <li>To comply with legal or regulatory requirements.</li>
        </ul>
      </section>

      {/* SECTION 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          3. Cookies & Tracking Technologies
        </h2>
        <p className="text-muted-foreground">
          We may use cookies, tracking pixels, and analytics tools to understand
          user behavior, website usage, and traffic patterns. You can disable
          cookies in your browser settings, but some features may not function
          properly.
        </p>
      </section>

      {/* SECTION 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          4. Sharing of Personal Information
        </h2>

        <p className="text-muted-foreground mb-3">
          We do not sell or trade your personal information. We may share data
          only in these cases:
        </p>

        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>With trusted service providers for website hosting and analytics.</li>
          <li>With legal authorities when required by law.</li>
          <li>With trusted partners for processing specific user requests.</li>
        </ul>
      </section>

      {/* SECTION 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
        <p className="text-muted-foreground">
          We implement strong technical and organizational measures to protect
          your data from unauthorized access, loss, or misuse. However, no
          online platform can guarantee 100% security.
        </p>
      </section>

      {/* SECTION 6 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">6. Third-Party Links</h2>
        <p className="text-muted-foreground">
          Our website may contain external links. We are not responsible for the
          privacy practices or content of third-party websites. We recommend
          reviewing their privacy policies separately.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">7. Children’s Privacy</h2>
        <p className="text-muted-foreground">
          Our website is not intended for children under the age of 13. We do
          not knowingly collect personal information from children.
        </p>
      </section>

      {/* SECTION 8 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          8. Changes to This Privacy Policy
        </h2>
        <p className="text-muted-foreground">
          We may update this Privacy Policy from time to time. Your continued
          use of the website indicates acceptance of the updated policy.
        </p>
      </section>

      {/* SECTION 9 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions or concerns regarding this Privacy Policy,
          you can contact us at:
        </p>

        <p className="text-muted-foreground mt-3">
          📧 Email: support@merapind.com  
          <br /> 📞 Phone: +91 98765 43210
        </p>
      </section>
    </main>
  );
}
