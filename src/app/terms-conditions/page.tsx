import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Mera Pind Balle Balle",
  description:
    "Review the official Terms & Conditions for using the Mera Pind Balle Balle website, services, and digital content.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>

      <p className="text-muted-foreground mb-10 max-w-3xl">
        By accessing and using the Mera Pind Balle Balle website, you agree to comply with
        the following Terms & Conditions. Please read them carefully.
      </p>

      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By using this website, you confirm that you have read, understood, and
          agreed to these Terms & Conditions. If you do not agree, you must stop
          using the website immediately.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">
          2. Use of Website & Content
        </h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>All content on this website is owned by Mera Pind Balle Balle.</li>
          <li>
            You may not copy, reproduce, or distribute any text, images, or
            media without written permission.
          </li>
          <li>
            Commercial use of website content is strictly prohibited unless
            approved.
          </li>
        </ul>
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">3. Product Information</h2>
        <p className="text-muted-foreground">
          We make every effort to display accurate product details, pricing, and
          availability. However, we do not guarantee that all information is
          always completely up to date.
        </p>
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">4. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          Mera Pind Balle Balle is not responsible for:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
          <li>Any errors or interruptions on the website.</li>
          <li>Loss of data or system damage caused by using the website.</li>
          <li>Third-party links, services, or content accessible through this website.</li>
        </ul>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">
          5. User Responsibilities
        </h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>You agree not to misuse the website in any unlawful manner.</li>
          <li>You must not attempt to hack, disrupt, or reverse-engineer systems.</li>
          <li>Providing false information in forms or requests is prohibited.</li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">
          6. Privacy & Data Protection
        </h2>
        <p className="text-muted-foreground">
          We follow strict data protection policies. For full details, please
          read our{" "}
          <a href="/privacy-policy" className="text-primary underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">
          7. Third-Party Services
        </h2>
        <p className="text-muted-foreground">
          This website may include links to third-party websites or services.
          Mera Pind Balle Balle is not responsible for their content, accuracy, or security.
        </p>
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We may update these Terms & Conditions at any time. Continued use of
          the website indicates acceptance of updated terms.
        </p>
      </section>

      {/* SECTION 9 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
        <p className="text-muted-foreground">
          If you have any questions about these Terms & Conditions, please
          contact us:
        </p>
        <p className="text-muted-foreground mt-2">
          📧 Email: support@merapind.com  
          <br /> 📞 Phone: +91 98765 43210
        </p>
      </section>
    </main>
  );
}
