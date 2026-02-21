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

export default function StoriesManager() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);

  const [previewImage, setPreviewImage] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    image: null as File | null,
  });

  /* =========================
     LOAD STORIES (BACKEND)
  ========================== */
  async function loadStories() {
    try {
      const res = await fetch("/api/admin/stories", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setStories(Array.isArray(data) ? data : []);
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

  /* =========================
     FORM HANDLERS
  ========================== */
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setForm({ ...form, image: file });
  }

  function startEdit(item: any) {
    setEditingStory(item);
    setForm({
      title: item.title,
      author: item.author || "",
      content: item.content,
      image: null,
    });
    setPreviewImage(item.image);
    setOpen(true);
  }

  function resetForm() {
    setEditingStory(null);
    setForm({
      title: "",
      author: "",
      content: "",
      image: null,
    });
    setPreviewImage("");
  }

  /* =========================
     CREATE / UPDATE (BACKEND)
  ========================== */
  async function handleSubmit() {
    if (!form.title || !form.content) {
      alert("Title and content are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("author", form.author || "Admin");
    fd.append("content", form.content);
    fd.append("excerpt", form.content.slice(0,60));

    if (form.image) {
      fd.append("image", form.image);
    }

    const url = editingStory
      ? `/api/admin/stories/${editingStory._id}`
      : "/api/admin/stories";

    const method = editingStory ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: fd,
      credentials: "include",
    });

    setOpen(false);
    resetForm();
    await loadStories(); // 🔑 backend truth
  }

  /* =========================
     DELETE (DB + CLOUDINARY)
  ========================== */
  async function deleteStory(id: string) {
    if (!confirm("Delete this story?")) return;

    await fetch(`/api/admin/stories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await loadStories();
  }

  /* =========================
     UI (UNCHANGED)
  ========================== */
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

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? "Edit Story" : "Add New Story"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Upload Image</Label>
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
                  className="w-full h-40 object-cover rounded-md border"
                />
              )}

              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Story title"
                />
              </div>

              <div className="grid gap-2">
                <Label>Author</Label>
                <Input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Content</Label>
                <Textarea
                  name="content"
                  rows={4}
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write the story content..."
                />
              </div>

              <Button className="mt-3 cursor-pointer" onClick={handleSubmit}>
                {editingStory ? "Save Changes" : "Add Story"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading stories...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(stories) ? stories : []).map((story, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 space-y-3">
                <div className="rounded-md overflow-hidden h-40 bg-muted">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold">{story.title}</h3>
            

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {story.excerpt}...
                </p>

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
