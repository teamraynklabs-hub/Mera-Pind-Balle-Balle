"use server";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientImage from "@/components/ClientImage";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

const fadeUp =
  "opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards]";
const fadeIn =
  "opacity-0 animate-[fadeIn_1s_ease-out_forwards]";
const scaleUp =
  "hover:scale-[1.02] transition-transform duration-300 ease-out";

export default async function HomePage() {
  await connectDB();
  const dashboard = await Dashboard.findOne({ isActive: true }).lean();

  if (!dashboard) {
    return (
      <main className="flex flex-col gap-20 px-4 md:px-8 lg:px-12">
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            Unable to load dashboard data
          </p>
        </div>
      </main>
    );
  }

  const initiatives = dashboard.initiatives || [];
  const products = dashboard.popularProducts || [];
  const impact = dashboard.impact || [];

  return (
    <main className="flex flex-col gap-20 px-4 md:px-8 lg:px-12">

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center pt-12">
        <div className={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-bold">
            {dashboard.hero?.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {dashboard.hero?.subtitle}
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <Button asChild>
              <Link href="/products">Explore Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services">Our Initiatives</Link>
            </Button>
          </div>
        </div>

        {dashboard.hero?.image && (
          <div className={`${fadeIn} rounded-xl overflow-hidden shadow-lg`}>
            <ClientImage
              src={dashboard.hero.image}
              alt="Mera Pind Balle Balle Rural Development"
              width={700}
              height={500}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}
      </section>

      {/* INITIATIVES */}
      {initiatives.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6">
            Our Key Initiatives
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((item: any, i: number) => (
              <div
                key={i}
                className={`${scaleUp} p-6 border rounded-xl bg-card shadow-sm opacity-0 animate-[fadeUp_0.9s_ease-out_forwards]`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.desc || item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6">
            Popular Products
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item: any, i: number) => (
              <div
                key={i}
                className={`${scaleUp} border rounded-xl overflow-hidden bg-card shadow-sm opacity-0 animate-[fadeUp_1s_ease-out_forwards]`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {(item.img || item.image) && (
                  <ClientImage
                    src={item.img || item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-lg font-medium">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.desc || item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IMPACT */}
      {impact.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6">
            Our Community Impact
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {impact.map((stat: any, i: number) => (
              <div
                key={i}
                className={`${fadeUp} text-center p-6 border rounded-xl bg-card shadow-sm`}
              >
                <h3 className="text-4xl font-bold text-primary">
                  {stat.number || stat.value}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {dashboard.cta && (
        <section className={`${fadeIn} py-12 text-center bg-accent rounded-xl`}>
          <h2 className="text-3xl font-semibold mb-4">
            {dashboard.cta.title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {dashboard.cta.description}
          </p>
          <Button asChild size="lg">
            <Link href={dashboard.cta.link || "/contact"}>
              {dashboard.cta.buttonText}
            </Link>
          </Button>
        </section>
      )}
    </main>
  );
}
