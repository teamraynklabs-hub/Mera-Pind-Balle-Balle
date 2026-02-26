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
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Story {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  name: string;
  author: string;
  location: string;
  tags: string[];
  featured: boolean;
  isPublished: boolean;
  image?: string;
}

export default function StoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    name: "",
    author: "",
    location: "",
    tags: "",
    featured: false,
    isPublished: true,
    image: null as File | null,
  });

  /* ========================= LOAD ========================= */
  async function loadStories() {
    try {
      const res = await fetch("/api/admin/stories", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      setStories(json.success && Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("STORIES LOAD ERROR:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStories();
  }, []);

  /* ========================= FORM ========================= */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target;
    const name = target.name;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, image: file }));
  }

  function startEdit(item: Story) {
    setEditingStory(item);
    setForm({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      name: item.name || "",
      author: item.author || "",
      location: item.location || "",
      tags: (item.tags || []).join(", "),
      featured: item.featured || false,
      isPublished: item.isPublished !== false,
      image: null,
    });
    setPreviewImage(item.image || "");
    setOpen(true);
  }

  function resetForm() {
    setEditingStory(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      name: "",
      author: "",
      location: "",
      tags: "",
      featured: false,
      isPublished: true,
      image: null,
    });
    setPreviewImage("");
  }

  /* ========================= SUBMIT ========================= */
  async function handleSubmit() {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error("Title, excerpt, and content are required");
      return;
    }
    if (!editingStory && !form.image) {
      toast.error("Image is required for new story");
      return;
    }

    setSaving(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("excerpt", form.excerpt);
    fd.append("content", form.content);
    fd.append("name", form.name);
    fd.append("author", form.author || "Mera Pind Balle Balle");
    fd.append("location", form.location);
    fd.append("tags", form.tags);
    fd.append("featured", String(form.featured));
    fd.append("isPublished", String(form.isPublished));

    if (form.image) {
      fd.append("image", form.image);
    }

    const url = editingStory
      ? `/api/admin/stories/${editingStory._id}`
      : "/api/admin/stories";
    const method = editingStory ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: fd, credentials: "include" });
      setOpen(false);
      resetForm();
      await loadStories();
    } catch (err) {
      console.error("STORY SAVE ERROR:", err);
      toast.error("Failed to save story");
    } finally {
      setSaving(false);
    }
  }

  /* ========================= DELETE ========================= */
  async function deleteStory(id: string) {
    if (!confirm("Delete this story?")) return;

    await fetch(`/api/admin/stories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await loadStories();
  }

  /* ========================= UI ========================= */
  return (
    <div className="space-y-8 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Stories Manager</h1>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={18} /> Add Story
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? "Edit Story" : "Add New Story"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Image Upload */}
              <div className="grid gap-2">
                <Label>
                  Upload Image{" "}
                  {!editingStory && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md border"
                />
              )}

              {/* Title */}
              <div className="grid gap-2">
                <Label>
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Story title"
                />
              </div>

              {/* Name (person) + Location — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Person Name</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Sunita Devi"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Assam, Northeast India"
                  />
                </div>
              </div>

              {/* Author */}
              <div className="grid gap-2">
                <Label>Author</Label>
                <Input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name (default: Mera Pind Balle Balle)"
                />
              </div>

              {/* Excerpt */}
              <div className="grid gap-2">
                <Label>
                  Excerpt <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  name="excerpt"
                  rows={2}
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary of the story..."
                />
              </div>

              {/* Content */}
              <div className="grid gap-2">
                <Label>
                  Content (HTML) <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  name="content"
                  rows={6}
                  value={form.content}
                  onChange={handleChange}
                  placeholder="<p>Write the full story content in HTML...</p>"
                />
              </div>

              {/* Tags */}
              <div className="grid gap-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. bamboo crafts, women empowerment"
                />
              </div>

              {/* Featured + Published toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  {form.isPublished ? (
                    <Eye size={16} className="text-primary" />
                  ) : (
                    <EyeOff size={16} className="text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </label>
              </div>

              <Button
                className="mt-3 cursor-pointer"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving && <Loader2 size={16} className="mr-2 animate-spin" />}
                {editingStory ? "Save Changes" : "Add Story"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-xl bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No stories yet. Add your first story!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card
              key={story._id}
              className="shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-4 space-y-3">
                <div className="rounded-md overflow-hidden h-40 bg-muted">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {story.featured && (
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    )}
                    {story.isPublished ? (
                      <Eye size={14} className="text-primary" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Name + Location */}
                {(story.name || story.location) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {story.name && <span>{story.name}</span>}
                    {story.name && story.location && <span>&middot;</span>}
                    {story.location && (
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {story.location}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {story.excerpt}
                </p>

                {/* Tags */}
                {story.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{story.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => startEdit(story)}
                  >
                    <Pencil size={16} /> Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => deleteStory(story._id)}
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
