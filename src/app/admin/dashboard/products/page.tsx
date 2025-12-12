"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { Pencil, Trash2, Plus } from "lucide-react";

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [previewImage, setPreviewImage] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // LOAD PRODUCTS
  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("PRODUCT LOAD ERROR:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // INPUT HANDLER
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // FILE UPLOAD HANDLER
  function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    // When real backend is connected -> upload file & save URL
    setForm({ ...form, image: url });
  }

  // START EDIT
  function startEdit(item: any) {
    setEditingProduct(item);
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    });
    setPreviewImage(item.image);
    setOpen(true);
  }

  // RESET FORM
  function resetForm() {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
    });
    setPreviewImage("");
  }

  // SUBMIT ADD / EDIT
  async function handleSubmit() {
    if (!form.name || !form.price) {
      alert("Name & Price are required");
      return;
    }

    const method = editingProduct ? "PUT" : "POST";

    const url = editingProduct
      ? `/api/admin/products?id=${editingProduct.id}`
      : "/api/admin/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    setOpen(false);
    resetForm();
    loadProducts();
  }

  // DELETE PRODUCT
  async function deleteProduct(id: any) {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });

    loadProducts();
  }

  return (
    <div className="space-y-8 animate-fadeUp">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Products Manager</h1>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={18} /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">

              {/* IMAGE UPLOAD FIELD */}
              <div className="grid gap-2">
                <Label>Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              {/* IMAGE PREVIEW */}
              {previewImage && (
                <img
                  src={previewImage}
                  className="w-full h-40 object-cover rounded-md border"
                />
              )}

              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Price (₹)</Label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="100"
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product Description"
                />
              </div>

              <Button
                className="mt-3 cursor-pointer"
                onClick={handleSubmit}
              >
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </div>

          </DialogContent>
        </Dialog>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((item, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 space-y-4">

                {/* IMAGE */}
                <div className="rounded-md overflow-hidden h-40 bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="font-bold text-primary">₹{item.price}</p>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil size={16} /> Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => deleteProduct(item.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}
