"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DistributorsPageManager from "./page-manager";

import {
  Plus,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  Trash2,
  Edit,
  Image as ImageIcon
} from "lucide-react";

export default function DistributorsManager() {
  const [activeTab, setActiveTab] = useState<"submissions" | "page">("submissions");
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // FORM STATE
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    website: string;
    image: File | string | null;
  }>({
    name: "",
    email: "",
    phone: "",
    website: "",
    image: null,
  });

  // LOAD DISTRIBUTORS FROM BACKEND
  async function loadDistributors() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/distributors", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load distributors");

      const data = await res.json();
      setDistributors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load error:", error);
      alert("Failed to load distributors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDistributors();
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // IMAGE UPLOAD (LOCAL PREVIEW ONLY)
  function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setFormData({ ...formData, image: file });
  }

  // SAVE DISTRIBUTOR (ADD OR EDIT)
  async function saveDistributor() {
    if (!formData.name.trim()) {
      alert("Distributor name is required.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    // For new distributors, image is required
    if (!editing && !(formData.image instanceof File)) {
      alert("Image is required for new distributors.");
      return;
    }

    setSubmitting(true);

    try {
      const url = editing
        ? `/api/admin/distributors/${editing._id}`
        : "/api/admin/distributors";

      const method = editing ? "PATCH" : "POST";

      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("email", formData.email.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("website", formData.website.trim());

      // Append image only if it's a File object
      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: fd,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      // Reload all distributors from backend
      await loadDistributors();
      closeForm();
    } catch (error) {
      console.error("Save error:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to save"}`);
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE DISTRIBUTOR
  async function deleteDistributor(id: string) {
    if (!confirm("Are you sure you want to delete this distributor?")) return;

    try {
      const res = await fetch(`/api/admin/distributors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Reload all distributors from backend
      await loadDistributors();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete distributor");
    }
  }

  // OPEN EDIT FORM
  function openEdit(item: any) {
    setEditing(item);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      website: item.website || "",
      image: item.image || "",
    });
    setPreviewImage(item.image || "");
    setShowForm(true);
  }

  // RESET FORM
  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      image: null,
    });
    setPreviewImage("");
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Distributors Manager</h1>

        {activeTab === "submissions" && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} /> Add Distributor
          </Button>
        )}
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "submissions" ? "default" : "ghost"}
          onClick={() => setActiveTab("submissions")}
          className="cursor-pointer"
        >
          Distributor Submissions
        </Button>
        <Button
          variant={activeTab === "page" ? "default" : "ghost"}
          onClick={() => setActiveTab("page")}
          className="cursor-pointer"
        >
          Page Configuration
        </Button>
      </div>

      {/* SUBMISSIONS TAB */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Manage all distributors from across India.
          </p>

      {/* LIST OF DISTRIBUTORS */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground text-lg">Loading distributors...</p>
        </div>
      ) : distributors.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground text-lg">No distributors yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {distributors.map((item, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 space-y-3">

                {/* IMAGE */}
                <div className="h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {item.image && item.image.trim() ? (
                    <img
                      src={item.image}
                      className="object-cover w-full h-full"
                      alt={item.name}
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon size={40} className="text-muted-foreground" />
                  )}
                </div>

                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Building size={18} /> {item.name}
                </h2>

                <p className="text-sm flex items-center gap-2">
                  <Mail size={16} /> {item.email}
                </p>

                <p className="text-sm flex items-center gap-2">
                  <Phone size={16} /> {item.phone}
                </p>

                {item.website && item.website.trim() && (
                  <p className="text-sm flex items-center gap-2">
                    <Globe size={16} />
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:no-underline"
                    >
                      Visit Website
                    </a>
                  </p>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => openEdit(item)}
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => deleteDistributor(item._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </div>
      )}

      {/* PAGE CONFIGURATION TAB */}
      {activeTab === "page" && <DistributorsPageManager />}

      {/* ADD / EDIT FORM MODAL */}
      {showForm && activeTab === "submissions" && (
        <div className="
          fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          animate-fadeIn
        ">
          <Card className="max-w-lg w-full shadow-xl">
            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {editing ? "Edit Distributor" : "Add Distributor"}
                </h2>

                <button onClick={closeForm}>
                  <X size={22} className="hover:text-primary cursor-pointer" />
                </button>
              </div>

              {/* FORM FIELDS */}

              <Input
                placeholder="Distributor Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                placeholder="Website URL (optional)"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />

              {/* IMAGE UPLOAD */}
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />

                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-3 h-28 w-full object-cover rounded-md border"
                  />
                )}
              </div>

              {/* SAVE BUTTON */}
              <Button
                className="w-full cursor-pointer"
                onClick={saveDistributor}
                disabled={submitting}
              >
                {submitting ? "Saving..." : (editing ? "Save Changes" : "Add Distributor")}
              </Button>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
