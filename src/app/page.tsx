"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeUp = "opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards]";
const fadeIn = "opacity-0 animate-[fadeIn_1s_ease-out_forwards]";
const scaleUp =
  "hover:scale-[1.02] transition-transform duration-300 ease-out";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-20 px-4 md:px-8 lg:px-12">

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center pt-12">
        <div className={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Empowering Villages Through Innovation & Sustainable Products
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Mera Pind Balle Balle works with rural communities to create quality
            products, generate employment, and encourage sustainable growth.
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

        <div
          className={`${fadeIn} rounded-xl overflow-hidden shadow-lg w-full max-h-[350px] md:max-h-[450px]`}
        >
          <Image
            src="/hero.png"
            alt="Mera Pind Balle Balle Rural Development"
            width={700}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* INITIATIVES */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Our Key Initiatives</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Skill Development",
              desc: "Training villagers in craft, digital literacy, and entrepreneurship.",
            },
            {
              title: "Women Empowerment",
              desc: "Helping rural women build independent and sustainable businesses.",
            },
            {
              title: "Sustainable Products",
              desc: "Organic, handmade, eco-friendly items crafted by communities.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${scaleUp} p-6 border rounded-xl bg-card shadow-sm opacity-0 animate-[fadeUp_0.9s_ease-out_forwards]`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Popular Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Organic Jaggery",
              desc: "Pure village-made jaggery with no chemicals.",
              img: "/products/sample1.jpg",
            },
            {
              title: "Handcrafted Baskets",
              desc: "Made by artisans using natural materials.",
              img: "/products/sample1.jpg",
            },
            {
              title: "Organic Honey",
              desc: "Naturally sourced honey from rural beekeepers.",
              img: "/products/sample1.png",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${scaleUp} border rounded-xl overflow-hidden bg-card shadow-sm opacity-0 animate-[fadeUp_1s_ease-out_forwards]`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="w-full h-48 sm:h-52 md:h-56 overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-6">
        <h2 className="text-3xl font-semibold mb-6">Our Community Impact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { number: "2500+", label: "Villagers Empowered" },
            { number: "120+", label: "Women-Owned Units" },
            { number: "65+", label: "Product Lines" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${fadeUp} text-center p-6 border rounded-xl bg-card shadow-sm`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <h3 className="text-4xl font-bold text-primary">{stat.number}</h3>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className={`${fadeIn} py-12 text-center bg-accent rounded-xl shadow-sm`}
      >
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
