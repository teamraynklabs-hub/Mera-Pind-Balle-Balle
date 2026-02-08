import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import CareersForm from "./CareersForm";

export const metadata: Metadata = {
  title: "Careers — Mera Pind Balle Balle",
  description:
    "Join Mera Pind Balle Balle to make a meaningful impact in rural development, empowerment, and sustainable community growth.",
};

async function getCareerData() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/careers`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Careers fetch failed: ${res.status}`);
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.error("CAREERS PAGE DATA ERROR:", err);
    return null;
  }
}
// disable caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CareersPage() {
  const data = await getCareerData();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">
          Unable to load careers information at the moment.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* BANNER */}
      {/* <section className="mb-16">
        <img
          src={data.bannerImage}
          alt="Careers at Mera Pind Balle Balle"
          className="w-full h-72 md:h-96 object-cover rounded-xl shadow-lg"
        />
      </section> */}

      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-5">Join Our Mission</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We're looking for passionate people who want to help transform rural communities
          through skill development, women's empowerment, and sustainable opportunities.
        </p>
      </section>

      {/* OPEN POSITIONS */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center md:text-left">
          Open Positions
        </h2>

        {data.jobs?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {data.jobs.map((job: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                    {job.type || "Full-time"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    📍 {job.location || "Remote / Punjab"}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No open positions at the moment. Check back soon!
          </p>
        )}
      </section>

      {/* APPLICATION FORM */}
      <CareersForm />
    </main>
  );
}