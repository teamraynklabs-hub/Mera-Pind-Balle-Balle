import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-20">

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center py-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Empowering Villages Through Innovation & Sustainable Products
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Mera Pind works with rural communities to create quality products, generate employment, and encourage sustainable growth.
          </p>

          <div className="mt-6 flex gap-4">
            <Button asChild>
              <Link href="/products">Explore Products</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/services">Our Initiatives</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow">
          <Image
            src="/hero.png"
            alt="Mera Pind Rural Development"
            width={700}
            height={500}
            className="object-cover h-full w-full"
          />
        </div>
      </section>

      {/* INITIATIVES PREVIEW */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Our Key Initiatives</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
            <p className="text-muted-foreground">
              Training villagers in craft, digital literacy, and modern entrepreneurship.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Women Empowerment</h3>
            <p className="text-muted-foreground">
              Helping rural women create self-sustaining micro-businesses.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Sustainable Products</h3>
            <p className="text-muted-foreground">
              Organic, handmade, eco-friendly items crafted by rural communities.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Popular Products</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition">
            <Image
              src="/products/sample1.jpg"
              alt="Product 1"
              width={400}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium">Organic Jaggery</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Pure village-made jaggery with no chemicals.
              </p>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition">
            <Image
              src="/products/sample1.jpg"
              alt="Product 2"
              width={400}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium">Handcrafted Baskets</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Made by skilled rural artisans using natural materials.
              </p>
            </div>
          </div>

          <div
            className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition">
            <Image
              src="/products/sample1.png"
              alt="Product 3"
              width={400}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium">Organic Honey</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Naturally sourced honey directly from beekeepers.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold mb-6">Our Community Impact</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl bg-card text-center shadow-sm">
            <h3 className="text-4xl font-bold text-primary">2500+</h3>
            <p className="mt-2 text-muted-foreground">Villagers Empowered</p>
          </div>

          <div className="p-6 border rounded-xl bg-card text-center shadow-sm">
            <h3 className="text-4xl font-bold text-primary">120+</h3>
            <p className="mt-2 text-muted-foreground">Women-Owned Units</p>
          </div>

          <div className="p-6 border rounded-xl bg-card text-center shadow-sm">
            <h3 className="text-4xl font-bold text-primary">65+</h3>
            <p className="mt-2 text-muted-foreground">Product Lines</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-3xl font-semibold mb-4">Want to Work With Us?</h2>
        <p className="text-muted-foreground mb-6">
          Join us as a distributor, volunteer, or partner NGO.
        </p>

        <Button asChild size="lg">
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </section>

    </main>
  );
}
