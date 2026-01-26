import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Mera Pind Balle Balle | Empowering Rural Communities",
  description:
    "Learn about Mera Pind Balle Balle's mission, vision, values, and rural empowerment approach.",
};

/* ------------------------
   BACKEND FETCH
------------------------ */
async function getAboutData() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`/api/about`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Fetch failed");
    const json = await res.json();

    if (json?.success) return json.data;
    if (json?._id) return json;

    return null;
  } catch (err) {
    console.error("ABOUT PAGE ERROR:", err);
    return null;
  }
}

/* ------------------------
      ABOUT PAGE
------------------------ */
export default async function AboutPage() {
  const data = await getAboutData();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">
          Unable to load About page data.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 space-y-20">

      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {data.hero?.title || "About Mera Pind Balle Balle"}
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0">
            {data.hero?.description}
          </p>
        </div>

        {/* IMAGE */}
        {data.hero?.image && (
          <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-md bg-muted">
            <img
              src={data.hero.image}
              alt={data.hero?.title}
              className="
                w-full
                h-[220px]
                sm:h-[280px]
                md:h-[320px]
                object-cover
              "
              loading="lazy"
            />
          </div>
        )}
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[data.mission, data.vision, data.values].map(
          (item: any, idx: number) =>
            item && (
              <div
                key={idx}
                className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            )
        )}
      </section>

      {/* WHY WE EXIST */}
      {data.whyWeExist && (
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Why We Exist
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {data.whyWeExist.description}
          </p>
        </section>
      )}

      {/* FOCUS AREAS */}
      {data.focusAreas?.length > 0 && (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.focusAreas.map((area: any, idx: number) => (
            <div
              key={idx}
              className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {area.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {area.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* CORE TEAM */}
      {data.coreTeam?.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
            Our Core Team
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.coreTeam.map((member: any, idx: number) => (
              <div
                key={idx}
                className="p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
              >
                {member.image && (
                  <div className="rounded-lg overflow-hidden mb-4 bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="
                        w-full
                        h-[180px]
                        object-cover
                      "
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-medium">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {data.cta && (
        <section className="text-center bg-accent rounded-xl py-12 px-6">
          <h3 className="text-2xl font-semibold mb-3">
            {data.cta.title}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {data.cta.description}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md text-sm hover:opacity-90 transition"
          >
            {data.cta.buttonText || "Contact Us"}
          </a>
        </section>
      )}
    </main>
  );
}