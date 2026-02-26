"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Pencil, Trash2, Plus, Loader2, Search, Package, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface ProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  sku: string;
  material: string;
  color: string;
  weight: string;
  story: string;
  careInstructions: string;
  socialImpact: string;
  isActive: boolean;
  isFeatured: boolean;
  image: File | string | null;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  stock: number;
  sku: string;
  material: string;
  color: string;
  weight: string;
  story: string;
  careInstructions: string;
  socialImpact: string;
  isActive: boolean;
  isFeatured: boolean;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  stock: "0",
  sku: "",
  material: "",
  color: "",
  weight: "",
  story: "",
  careInstructions: "",
  socialImpact: "",
  isActive: true,
  isFeatured: false,
  image: null,
};

/* ─── Category Manager Modal ─── */
function CategoryManager({
  categories,
  onReload,
}: {
  categories: Category[];
  onReload: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  async function addCategory() {
    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      toast.success("Category added");
      setNewName("");
      onReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setAdding(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category deleted");
      onReload();
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
        />
        <Button onClick={addCategory} disabled={adding} className="shrink-0 cursor-pointer">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={18} />}
        </Button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
        )}
        {categories.map((cat) => (
          <div key={cat._id} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-card">
            <span className="text-sm font-medium">{cat.name}</span>
            <Button size="sm" variant="ghost" onClick={() => deleteCategory(cat._id)} className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive">
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [open, setOpen] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [form, setForm] = useState<ProductForm>({ ...EMPTY_FORM });
  const [activeFormTab, setActiveFormTab] = useState<"basic" | "details" | "content">("basic");

  /* ── Loaders ── */
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      const json = await res.json();
      const list = json.data || json.products || json || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to load products");
    }
    setLoading(false);
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories", { credentials: "include" });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  /* ── Form Helpers ── */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file));
    setForm((p) => ({ ...p, image: file }));
  }

  function startEdit(item: Product) {
    setEditingProduct(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: String(item.price || ""),
      originalPrice: String(item.originalPrice || ""),
      category: item.category || "",
      stock: String(item.stock ?? 0),
      sku: item.sku || "",
      material: item.material || "",
      color: item.color || "",
      weight: item.weight || "",
      story: item.story || "",
      careInstructions: item.careInstructions || "",
      socialImpact: item.socialImpact || "",
      isActive: item.isActive !== false,
      isFeatured: item.isFeatured === true,
      image: item.image || null,
    });
    setPreviewImage(item.image || "");
    setActiveFormTab("basic");
    setOpen(true);
  }

  function resetForm() {
    setEditingProduct(null);
    setForm({ ...EMPTY_FORM });
    setPreviewImage("");
    setActiveFormTab("basic");
  }

  /* ── Submit ── */
  async function handleSubmit() {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    const isEdit = Boolean(editingProduct);
    if (!isEdit && !(form.image instanceof File)) {
      toast.error("Image is required for new products");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/admin/products/${editingProduct!._id}`
        : "/api/admin/products";

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("originalPrice", form.originalPrice);
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      fd.append("sku", form.sku);
      fd.append("material", form.material);
      fd.append("color", form.color);
      fd.append("weight", form.weight);
      fd.append("story", form.story);
      fd.append("careInstructions", form.careInstructions);
      fd.append("socialImpact", form.socialImpact);
      fd.append("isActive", String(form.isActive));
      fd.append("isFeatured", String(form.isFeatured));

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: fd,
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save product");

      toast.success(isEdit ? "Product updated!" : "Product created!");
      setOpen(false);
      resetForm();
      await loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Delete ── */
  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Product deleted");
      await loadProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  }

  /* ── Toggle Active/Featured ── */
  async function toggleField(id: string, field: "isActive" | "isFeatured", current: boolean) {
    try {
      const fd = new FormData();
      fd.append(field, String(!current));

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Product ${field === "isActive" ? (!current ? "activated" : "deactivated") : (!current ? "featured" : "unfeatured")}`);
      await loadProducts();
    } catch {
      toast.error("Failed to update product");
    }
  }

  /* ── Filtered products ── */
  const filtered = products.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!p.name?.toLowerCase().includes(term) && !p.description?.toLowerCase().includes(term)) return false;
    }
    return true;
  });

  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center",
    paddingRight: "40px",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products Manager</h1>
          <p className="text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          {/* Category Manager Dialog */}
          <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Package size={18} className="mr-2" /> Categories
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Categories</DialogTitle>
              </DialogHeader>
              <CategoryManager categories={categories} onReload={loadCategories} />
            </DialogContent>
          </Dialog>

          {/* Add Product Dialog */}
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>

              {/* Form Tabs */}
              <div className="flex gap-2 border-b pb-2 mb-4">
                {(["basic", "details", "content"] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant={activeFormTab === tab ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveFormTab(tab)}
                    className="cursor-pointer capitalize"
                  >
                    {tab === "basic" ? "Basic Info" : tab === "details" ? "Details" : "Content"}
                  </Button>
                ))}
              </div>

              {/* BASIC TAB */}
              {activeFormTab === "basic" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Product Image *</Label>
                    <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                  </div>
                  {previewImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded-md border" />
                  )}

                  <div className="grid gap-2">
                    <Label>Name *</Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Price (₹) *</Label>
                      <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="299" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Original Price (₹)</Label>
                      <Input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="499 (for discount)" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="h-10 px-3 rounded-md border border-border bg-background text-foreground appearance-none cursor-pointer text-sm"
                        style={selectArrowStyle}
                      >
                        <option value="">Select Category</option>
                        {categories.filter((c) => c.isActive).map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Stock</Label>
                      <Input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Description *</Label>
                    <Textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description" />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-primary" />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-primary" />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>
              )}

              {/* DETAILS TAB */}
              {activeFormTab === "details" && (
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>SKU</Label>
                      <Input name="sku" value={form.sku} onChange={handleChange} placeholder="MPBB-001" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Material</Label>
                      <Input name="material" value={form.material} onChange={handleChange} placeholder="Cotton, Bamboo, etc." />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Color</Label>
                      <Input name="color" value={form.color} onChange={handleChange} placeholder="Natural, Brown, etc." />
                    </div>
                    <div className="grid gap-2">
                      <Label>Weight</Label>
                      <Input name="weight" value={form.weight} onChange={handleChange} placeholder="250g, 1kg, etc." />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT TAB */}
              {activeFormTab === "content" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Product Story</Label>
                    <Textarea name="story" value={form.story} onChange={handleChange} rows={4} placeholder="The story behind this product..." />
                  </div>
                  <div className="grid gap-2">
                    <Label>Care Instructions</Label>
                    <Textarea name="careInstructions" value={form.careInstructions} onChange={handleChange} rows={3} placeholder="How to care for this product..." />
                  </div>
                  <div className="grid gap-2">
                    <Label>Social Impact</Label>
                    <Textarea name="socialImpact" value={form.socialImpact} onChange={handleChange} rows={3} placeholder="How this product impacts the community..." />
                  </div>
                </div>
              )}

              <Button onClick={handleSubmit} disabled={submitting} className="w-full mt-4 cursor-pointer">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                ) : (
                  editingProduct ? "Save Changes" : "Add Product"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-10 px-3 rounded-md border border-border bg-background text-foreground appearance-none cursor-pointer text-sm"
          style={selectArrowStyle}
        >
          <option value="all">All Categories</option>
          {categories.filter((c) => c.isActive).map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* ── PRODUCT LIST ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-muted-foreground text-sm">
            {searchTerm || filterCategory !== "all" ? "Try adjusting your filters" : "Click 'Add Product' to get started"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item._id} className={`shadow-sm hover:shadow-md transition overflow-hidden ${!item.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-44 bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-gold text-gold-foreground text-xs font-medium flex items-center gap-1">
                        <Star size={10} /> Featured
                      </span>
                    )}
                    {!item.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">Inactive</span>
                    )}
                  </div>
                  {item.category && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs">{item.category}</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    {item.originalPrice > 0 && item.originalPrice > item.price && (
                      <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                    )}
                    <span className="ml-auto text-sm text-muted-foreground">Stock: {item.stock ?? 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)} className="flex-1 cursor-pointer">
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleField(item._id, "isFeatured", item.isFeatured)}
                      className="cursor-pointer"
                      title={item.isFeatured ? "Remove from featured" : "Mark as featured"}
                    >
                      <Star size={14} className={item.isFeatured ? "fill-yellow-500 text-yellow-500" : ""} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleField(item._id, "isActive", item.isActive)}
                      className="cursor-pointer"
                      title={item.isActive ? "Deactivate" : "Activate"}
                    >
                      {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(item._id)} className="cursor-pointer">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
