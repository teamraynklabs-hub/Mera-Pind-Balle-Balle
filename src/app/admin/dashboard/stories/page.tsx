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
    image: "",
  });

  // ⭐ Dummy data (use until backend is connected)
  const dummyStories = [
    {
      id: 1,
      title: "Empowering Women in Rural Punjab",
      author: "Admin",
      content: "A story of transformation and empowerment in rural India.",
      image: "/placeholder-story.jpg",
    },
  ];

  // LOAD STORIES
  async function loadStories() {
    try {
      // ⭐ Replace with -> const res = await fetch("/api/stories")
      setStories(dummyStories);
    } catch (err) {
      console.error("STORIES LOAD ERROR:", err);
      setStories([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStories();
  }, []);

  // FORM INPUT HANDLER
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // FILE UPLOAD HANDLER
  function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    setForm({ ...form, image: url }); // Backend will replace this
  }

  // START EDIT
  function startEdit(item: any) {
    setEditingStory(item);
    setForm({
      title: item.title,
      author: item.author,
      content: item.content,
      image: item.image,
    });
    setPreviewImage(item.image);
    setOpen(true);
  }

  // RESET FORM
  function resetForm() {
    setEditingStory(null);
    setForm({
      title: "",
      author: "",
      content: "",
      image: "",
    });
    setPreviewImage("");
  }

  // SUBMIT (ADD + EDIT)
  async function handleSubmit() {
    if (!form.title) {
      alert("Title is required");
      return;
    }

    // ⭐ Backend integration (POST / PUT) will be added later

    if (editingStory) {
      // UPDATE LOCAL
      const updated = stories.map((s) =>
        s.id === editingStory.id ? { ...editingStory, ...form } : s
      );
      setStories(updated);
    } else {
      // ADD NEW LOCAL
      setStories([
        ...stories,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setOpen(false);
    resetForm();
  }

  // DELETE STORY
  async function deleteStory(id: number) {
    if (!confirm("Delete this story?")) return;

    // ⭐ Replace with backend DELETE later
    setStories(stories.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-8 animate-fadeUp">

      {/* HEADER */}
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

              {/* IMAGE UPLOAD */}
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

      {/* STORIES LIST */}
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
                <p className="text-sm text-primary">By {story.author || "Admin"}</p>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {story.content}
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
                    onClick={() => deleteStory(story.id)}
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
