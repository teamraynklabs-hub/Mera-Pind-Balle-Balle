import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Mera Pind Balle Balle | Empowering Rural Communities",
  description:
    "Learn about Mera Pind Balle Balle's mission, vision, values, rural empowerment approach, and the team behind sustainable change.",
};

/* ------------------------
      BACKEND FETCH
------------------------ */
async function getAboutData() {
  try {
    const base = getBaseUrl(); // SSR safe
    const res = await axios.get(`${base}/api/about`);
    return res.data;
  } catch (error) {
    console.error("ABOUT PAGE ERROR:", error);
    return null;
  }
}

/* ------------------------
      ABOUT PAGE VIEW
------------------------ */
export default async function AboutPage() {
  const data = await getAboutData();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">
          Unable to load backend data.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* -------------------------------------
               HERO SECTION
      -------------------------------------- */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            About Mera Pind Balle Balle
          </h1>

          <p className="text-lg text-muted-foreground max-w-prose">
            Mera Pind Balle Balle is building sustainable village-level ecosystems by
            empowering artisans, farmers, and rural entrepreneurs with skills,
            market access, and fair compensation systems.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={data.heroImage}
            alt="About Mera Pind Balle Balle"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* -------------------------------------
               OUR MISSION, VISION, VALUES
      -------------------------------------- */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-muted-foreground">
            Empower rural communities through training, fair trade, and
            sustainable development while ensuring long-term socio-economic
            growth.
          </p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-muted-foreground">
            A future where every village becomes self-reliant, prosperous, and
            globally connected through authentic handmade products and organic
            produce.
          </p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Our Values</h3>
          <p className="text-muted-foreground">
            Transparency, Fair Pricing, Sustainability, Community-Driven
            Decisions, and Ethical Market Practices.
          </p>
        </div>
      </section>

      {/* -------------------------------------
               WHY WE EXIST
      -------------------------------------- */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-6">Why We Exist</h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          Villages hold timeless knowledge, craft traditions, and agricultural
          expertise—but lack the right opportunities and market exposure. Mera
          Pind exists to bridge this gap by connecting rural talent with
          sustainable markets, modern skill training, and digital tools to help
          communities grow with dignity and independence.
        </p>
      </section>

      {/* -------------------------------------
               OUR APPROACH
      -------------------------------------- */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
          <p className="text-muted-foreground">
            We conduct hands-on workshops for artisans, farmers, and women
            entrepreneurs covering craft enhancement, product standardization,
            modern tools, and packaging skills.
          </p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Market Access</h3>
          <p className="text-muted-foreground">
            Products are showcased through partnerships, distributors, and
            digital channels, ensuring fair pricing and consistent demand.
          </p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Community Development</h3>
          <p className="text-muted-foreground">
            We work closely with NGOs and village councils to support education,
            health programs, and local entrepreneurship ecosystems.
          </p>
        </div>
      </section>

      {/* -------------------------------------
               OUR TEAM
      -------------------------------------- */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-6">Our Core Team</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.team.map((m: any) => (
            <div key={m.name} className="p-6 bg-card border rounded-xl shadow-sm">
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <h3 className="text-xl font-semibold">{m.name}</h3>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="text-sm text-muted-foreground mt-2">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------
               CTA
      -------------------------------------- */}
      <section className=" py-10 text-center bg-accent rounded-xl shadow-sm">
        <h3 className="text-2xl font-semibold mb-2">Partner With Us</h3>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Whether you are an NGO, distributor, educator, or a passionate
          volunteer—your support can transform lives and fuel rural progress.
        </p>

        <a
          href="/contact"
          className="px-8 py-3 bg-primary text-white rounded-md text-sm shadow-md hover:opacity-90 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
