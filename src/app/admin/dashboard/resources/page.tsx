"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Plus,
  X,
  FileText,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function ResourcesManager() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    fileUrl: null as File | null,
  });

  // Load resources from API
  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/resources");
      if (!response.ok) throw new Error("Failed to fetch resources");
      const data = await response.json();
      console.log("Fetched resources:", data);
      setResources(Array.isArray(data) ? data : []);
      setError("");
    } catch (err: any) {
      console.error("Error loading resources:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Input handling
  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // File Upload (PDF / DOC / Image)
  function handleFileUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ ...formData, fileUrl: file });

    // Create preview URL for display
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
  }

  // Save (Add / Edit)
  async function saveResource() {
    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("desc", formData.desc);
      if (formData.fileUrl) {
        data.append("fileUrl", formData.fileUrl);
      }

      // EDIT MODE
      if (editing) {
        const response = await fetch(
          `/api/admin/resources/${editing._id}`,
          {
            method: "PATCH",
            body: data,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error || "Failed to update resource");
          return;
        }

        await loadResources();
        closeForm();
        return;
      }

      // ADD MODE
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create resource");
        return;
      }

      await loadResources();
      closeForm();
    } catch (err: any) {
      alert("Error saving resource: " + err.message);
    }
  }

  // Delete
  async function deleteResource(id: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete resource");
        return;
      }

      await loadResources();
    } catch (err: any) {
      alert("Error deleting resource: " + err.message);
    }
  }

  // Edit
  function openEdit(item: any) {
    setEditing(item);
    setFormData({
      title: item.title,
      desc: item.description,
      fileUrl: null,
    });
    setPreviewUrl(item.link);
    setShowForm(true);
  }

  // Reset
  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData({
      title: "",
      desc: "",
      fileUrl: null,
    });
    setPreviewUrl("");
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resources Manager</h1>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> Add Resource
        </Button>
      </div>

      <p className="text-muted-foreground">
        Upload training material, guides, and resources for villagers.
      </p>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="text-center py-8">Loading resources...</div>
      ) : (
        <>
          {/* RESOURCE LIST */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {resources.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No resources yet. Add one to get started!
              </div>
            ) : (
              resources.map((item) => (
                <Card key={item._id} className="shadow-sm hover:shadow-md transition">
                  <CardContent className="p-4 space-y-3">

                    {/* File Preview */}
                    <div className="h-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {item.link ? (
                        <iframe
                          src={item.link}
                          className="w-full h-full"
                          title="resource-preview"
                        ></iframe>
                      ) : (
                        <FileText size={40} className="text-muted-foreground" />
                      )}
                    </div>

                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FileText size={18} /> {item.title}
                    </h2>

                    <p className="text-sm text-muted-foreground">{item.description}</p>

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
                        onClick={() => deleteResource(item._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* ADD/EDIT MODAL */}
      {showForm && (
        <div className="
          fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          animate-fadeIn
        ">
          <Card className="max-w-lg w-full shadow-xl">
            <CardContent className="p-6 space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {editing ? "Edit Resource" : "Add Resource"}
                </h2>

                <button onClick={closeForm}>
                  <X size={22} className="hover:text-primary cursor-pointer" />
                </button>
              </div>

              <Input
                placeholder="Resource Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />

              <Textarea
                placeholder="Short Description"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows={3}
              />

              {/* FILE UPLOAD */}
              <div>
                <label className="text-sm font-medium">Upload File</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />

                {previewUrl && (
                  <iframe
                    src={previewUrl}
                    className="mt-3 w-full h-32 rounded-md border"
                  ></iframe>
                )}
              </div>

              <Button
                className="w-full cursor-pointer"
                onClick={saveResource}
              >
                {editing ? "Save Changes" : "Add Resource"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
