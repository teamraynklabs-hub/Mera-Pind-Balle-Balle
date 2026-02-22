"use client";

import { useState, useEffect } from "react";
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
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Film,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  "Catalog",
  "Guide",
  "Education",
  "Report",
  "Stories",
  "Video",
  "Brand",
  "Other",
];

const FILE_TYPE_OPTIONS = ["pdf", "video", "image", "doc", "other"];

function getFileIcon(fileType: string) {
  switch (fileType?.toLowerCase()) {
    case "video":
      return Film;
    case "image":
      return ImageIcon;
    default:
      return FileText;
  }
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  size: string;
  isPublished: boolean;
  fileUrl?: string;
}

export default function ResourcesManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Guide",
    fileType: "pdf",
    size: "",
    isPublished: true,
    file: null as File | null,
  });

  /* ========================= LOAD ========================= */
  async function loadResources() {
    try {
      const res = await fetch("/api/admin/resources", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      setResources(json.success && Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("RESOURCES LOAD ERROR:", err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  /* ========================= FORM ========================= */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const name = target.name;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, file }));
  }

  function startEdit(item: Resource) {
    setEditing(item);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Guide",
      fileType: item.fileType || "pdf",
      size: item.size || "",
      isPublished: item.isPublished !== false,
      file: null,
    });
    setOpen(true);
  }

  function resetForm() {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      category: "Guide",
      fileType: "pdf",
      size: "",
      isPublished: true,
      file: null,
    });
  }

  /* ========================= SUBMIT ========================= */
  async function handleSubmit() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("fileType", form.fileType);
    fd.append("size", form.size);
    fd.append("isPublished", String(form.isPublished));

    if (form.file) {
      fd.append("file", form.file);
    }

    const url = editing
      ? `/api/admin/resources/${editing._id}`
      : "/api/admin/resources";
    const method = editing ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: fd, credentials: "include" });
      setOpen(false);
      resetForm();
      await loadResources();
    } catch (err) {
      console.error("RESOURCE SAVE ERROR:", err);
      toast.error("Failed to save resource");
    } finally {
      setSaving(false);
    }
  }

  /* ========================= DELETE ========================= */
  async function deleteResource(id: string) {
    if (!confirm("Delete this resource?")) return;

    await fetch(`/api/admin/resources/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await loadResources();
  }

  /* ========================= UI ========================= */
  return (
    <div className="space-y-8 animate-fadeUp">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Resources Manager</h1>
          <p className="text-muted-foreground mt-1">
            Upload catalogs, guides, and educational materials.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={18} /> Add Resource
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Resource" : "Add New Resource"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Title */}
              <div className="grid gap-2">
                <Label>
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Resource title"
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description of the resource..."
                />
              </div>

              {/* Category + File Type — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>File Type</Label>
                  <select
                    name="fileType"
                    value={form.fileType}
                    onChange={handleChange}
                    className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {FILE_TYPE_OPTIONS.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Size */}
              <div className="grid gap-2">
                <Label>File Size</Label>
                <Input
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="e.g. 12.5 MB"
                />
              </div>

              {/* File Upload */}
              <div className="grid gap-2">
                <Label>Upload File (PDF, DOC, Image, Video)</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*,video/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {form.file && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {form.file.name}
                  </p>
                )}
                {editing?.fileUrl && !form.file && (
                  <p className="text-xs text-muted-foreground">
                    Current file uploaded. Upload new to replace.
                  </p>
                )}
              </div>

              {/* Published toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                {form.isPublished ? (
                  <Eye size={16} className="text-green-500" />
                ) : (
                  <EyeOff size={16} className="text-muted-foreground" />
                )}
                <span className="text-sm">
                  {form.isPublished ? "Published" : "Draft"}
                </span>
              </label>

              <Button
                className="mt-3 cursor-pointer"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving && <Loader2 size={16} className="mr-2 animate-spin" />}
                {editing ? "Save Changes" : "Add Resource"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resources List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No resources yet. Add your first resource!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => {
            const Icon = getFileIcon(item.fileType);
            return (
              <Card
                key={item._id}
                className="shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Icon area */}
                  <div className="h-28 rounded-md bg-muted/50 flex items-center justify-center">
                    <Icon size={36} className="text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {item.title}
                    </h3>
                    {item.isPublished ? (
                      <Eye size={14} className="text-green-500 shrink-0" />
                    ) : (
                      <EyeOff
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                    )}
                  </div>

                  {/* Category + Type badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                      {item.fileType}
                    </span>
                    {item.size && (
                      <span className="text-[10px] text-muted-foreground">
                        {item.size}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* File link */}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Download size={12} /> View File
                    </a>
                  )}

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
                      onClick={() => deleteResource(item._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
