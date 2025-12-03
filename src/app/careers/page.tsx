import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import CareersForm from "./CareersForm";

export const metadata: Metadata = {
  title: "Careers — Mera Pind",
  description:
    "Join Mera Pind to make a meaningful impact in rural development, empowerment, and sustainable community growth.",
};

// SSR fetch
async function getCareerData() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/careers`);
    return res.data;
  } catch (err) {
    console.error("CAREERS API ERROR:", err);
    return null;
  }
}

export default async function CareersPage() {
  const data = await getCareerData();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Unable to load careers data.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">

      {/* BANNER */}
      <section className="mb-16">
        <img
          src={data.bannerImage}
          alt="Careers"
          className="w-full h-72 object-cover rounded-xl shadow"
        />
      </section>

      {/* PAGE HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Mission</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We are looking for passionate individuals who want to help transform
          rural communities through skill development, empowerment, and meaningful work.
        </p>
      </section>

      {/* JOB LISTINGS */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-6">Open Positions</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.jobs.map((job: any, index: number) => (
            <div
              key={index}
              className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-primary mb-1">{job.type}</p>
              <p className="text-sm text-muted-foreground mb-3">
                Location: {job.location}
              </p>

              <p className="text-muted-foreground mb-4">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <CareersForm />

    </main>
  );
}
