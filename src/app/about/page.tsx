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
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/about`, {
      timeout: 10000, // 10 second timeout
    });

    // Handle both { success: true, data: {...} } and direct {...} response formats
    if (res.data?.success) {
      return res.data.data;
    }

    // If data is returned directly
    if (res.data?._id) {
      return res.data;
    }

    return null;
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
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">
          Unable to load About page data. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {data.hero?.title || "About Mera Pind Balle Balle"}
          </h1>

          <p className="text-lg text-muted-foreground max-w-prose">
            {data.hero?.description || 
              "Mera Pind Balle Balle is building sustainable village-level ecosystems by empowering artisans, farmers, and rural entrepreneurs with skills, market access, and fair compensation systems."}
          </p>
        </div>

        {data.hero?.image && (
          <div className="rounded-xl overflow-hidden shadow-lg bg-muted animate-fade-in">
            <img
              src={data.hero.image}
              alt={data.hero?.title || "About Mera Pind Balle Balle"}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}
      </section>

      {/* MISSION, VISION, VALUES */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        {/* MISSION */}
        {data.mission && (
          <div className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              {data.mission.title || "Our Mission"}
            </h3>
            <p className="text-muted-foreground">
              {data.mission.description}
            </p>
          </div>
        )}

        {/* VISION */}
        {data.vision && (
          <div className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              {data.vision.title || "Our Vision"}
            </h3>
            <p className="text-muted-foreground">
              {data.vision.description}
            </p>
          </div>
        )}

        {/* VALUES */}
        {data.values && (
          <div className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              {data.values.title || "Our Values"}
            </h3>
            <p className="text-muted-foreground">
              {data.values.description}
            </p>
          </div>
        )}
      </section>

      {/* WHY WE EXIST */}
      {data.whyWeExist && (
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6">Why We Exist</h2>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            {data.whyWeExist.description}
          </p>
        </section>
      )}

      {/* FOCUS AREAS */}
      {data.focusAreas && data.focusAreas.length > 0 && (
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {data.focusAreas.map((area: any, idx: number) => (
            <div
              key={idx}
              className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <p className="text-muted-foreground">{area.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* CORE TEAM */}
      {data.coreTeam && data.coreTeam.length > 0 && (
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6">Our Core Team</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {data.coreTeam.map((member: any, idx: number) => (
              <div
                key={idx}
                className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition animate-fade-in"
              >
                {/* TEAM IMAGE */}
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 bg-muted"
                    loading="lazy"
                  />
                )}

                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      {data.cta && (
        <section className="py-12 px-8 text-center bg-accent rounded-xl shadow-sm">
          <h3 className="text-2xl font-semibold mb-2">
            {data.cta.title || "Partner With Us"}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {data.cta.description || 
              "Whether you are an NGO, distributor, educator, or a passionate volunteer—your support can transform lives and fuel rural progress."}
          </p>

          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md text-sm shadow-md hover:opacity-90 transition"
          >
            {data.cta.buttonText || "Contact Us"}
          </a>
        </section>
      )}
    </main>
  );
}
