"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, X, Edit, Trash2, Settings } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt?: string;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services", { next: { tags: ["services"] } });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();

      // Handle both formats: array or object with data property
      const services = Array.isArray(data) ? data : data?.data;

      if (!Array.isArray(services)) {
        console.warn("Services API returned non-array:", data);
        toast.error("Server returned unexpected format");
        setServices([]);
        return;
      }

      setServices(services);
    } catch (err: any) {
      console.error("Failed to fetch services:", err?.message || err);
      toast.error("Could not load services. Please try again.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setSubmitting(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
        },
        body: uploadData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      if (data.url || data.secure_url) {
        const imageUrl = data.url || data.secure_url;
        setFormData((prev) => ({ ...prev, icon: imageUrl }));
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No URL in response");
      }
    } catch (err: any) {
      console.error("Image upload error:", err?.message || err);
      toast.error(err?.message || "Failed to upload image");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveService() {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSubmitting(true);

    try {
      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${errText}`);
      }

      toast.success(editing ? "Service updated" : "Service added");
      fetchServices();
      closeForm();
    } catch (err: any) {
      console.error("Save service error:", err);
      toast.error("Failed to save service");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service permanently?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      toast.success("Service deleted");
      fetchServices();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete service");
    }
  }

  function openEdit(service: Service) {
    setEditing(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData({ title: "", description: "", icon: "" });
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services Manager</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <p className="text-muted-foreground">
        Manage your village initiatives, programs, and support services.
      </p>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-muted rounded-md mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!Array.isArray(services) || services.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-10">
              No services yet. Click "Add Service" to create one.
            </p>
          ) : (
            services.map((service) => (
              <Card key={service._id} className="shadow-sm hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">
                  <div className="h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    {service.icon ? (
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Settings size={40} className="text-muted-foreground" />
                    )}
                  </div>

                  <h2 className="text-xl font-semibold line-clamp-2">{service.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteService(service._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full shadow-2xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editing ? "Edit Service" : "Add New Service"}
                </h2>
                <button onClick={closeForm} className="hover:text-primary transition">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    name="title"
                    placeholder="e.g. Women Empowerment Workshop"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    placeholder="Brief description of the service..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Service Image / Icon</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={submitting}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Or paste direct image URL after upload
                  </p>

                  {formData.icon && (
                    <div className="mt-3">
                      <img
                        src={formData.icon}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {formData.icon === "" && (
                  <Input
                    placeholder="Or paste direct image URL[](https://...)"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={saveService}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editing ? "Update Service" : "Add Service"}</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}