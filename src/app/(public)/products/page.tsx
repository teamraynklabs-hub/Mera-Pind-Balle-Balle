import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Mera Pind Balle Balle",
  description:
    "Explore our authentic rural products including handcrafted items, organic food, natural produce and sustainable village-based goods.",
};

// Fetch products via backend
async function getProducts() {
  try {
    const base = getBaseUrl(); // SSR safe
    const res = await axios.get(`${base}/api/products`);

    //  IMPORTANT: extract array
    return res.data.data ?? [];
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return [];
  }
}


export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-12">
      {/* PAGE TITLE */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover authentic, handmade, natural and eco-friendly products crafted
          by rural artisans and farmers.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No products available at the moment.
          </p>
        ) : (
          products.map((item: any) => (
            <div
              key={item.name}
              className="bg-card border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">₹{item.price}</p>

                  <a
                    href="/contact"
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90 transition"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* CTA SECTION */}
      <section className="py-12 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Bulk Orders & Distribution</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          If you are a wholesaler, retailer, NGO or corporate organization, we
          offer custom and bulk order solutions.
        </p>

        <a
          href="/distributors"
          className="px-8 py-3 bg-primary text-white rounded-md text-sm shadow-md hover:opacity-90 transition"
        >
          Become a Distributor
        </a>
      </section>
    </main>
  );
}
