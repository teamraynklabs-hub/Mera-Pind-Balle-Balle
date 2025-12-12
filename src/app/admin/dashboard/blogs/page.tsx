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

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]); // ALWAYS ARRAY
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [previewImage, setPreviewImage] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
  });

  // ⭐ Temporary Frontend-Only Dummy Data (Backend will replace this)
  const dummyBlogs = [
    {
      id: 1,
      title: "First Blog Post",
      author: "Admin",
      description: "Short description about the blog...",
      image: "/placeholder-blog.jpg",
    },
  ];

  // LOAD BLOGS (Frontend only)
  async function loadBlogs() {
    try {
      // ⭐ When backend ready → replace this with fetch("/api/blogs")
      setBlogs(dummyBlogs);
    } catch (err) {
      console.error("BLOG LOAD ERROR:", err);
      setBlogs([]); // fallback
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBlogs();
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

    // ⭐ When backend ready → upload file to server/cloud
    setForm({ ...form, image: url });
  }

  // START EDIT
  function startEdit(item: any) {
    setEditingBlog(item);
    setForm({
      title: item.title,
      author: item.author,
      description: item.description,
      image: item.image,
    });
    setPreviewImage(item.image);
    setOpen(true);
  }

  // RESET FORM
  function resetForm() {
    setEditingBlog(null);
    setForm({
      title: "",
      author: "",
      description: "",
      image: "",
    });
    setPreviewImage("");
  }

  // SUBMIT ADD / EDIT
  async function handleSubmit() {
    if (!form.title) {
      alert("Title is required");
      return;
    }

    // ⭐ When backend is ready:
    // const method = editingBlog ? "PUT" : "POST";

    if (editingBlog) {
      // UPDATE LOCAL ARRAY (Frontend-only)
      const updated = blogs.map((b) =>
        b.id === editingBlog.id ? { ...editingBlog, ...form } : b
      );
      setBlogs(updated);
    } else {
      // ADD NEW BLOG LOCAL ONLY
      setBlogs([
        ...blogs,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setOpen(false);
    resetForm();
  }

  // DELETE BLOG
  async function deleteBlog(id: any) {
    if (!confirm("Delete this blog?")) return;

    // ⭐ When backend ready → call DELETE API
    setBlogs(blogs.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-8 animate-fadeUp">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Blogs Manager</h1>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={18} /> Add Blog
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog" : "Add New Blog"}
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
                  placeholder="Blog Title"
                />
              </div>

              <div className="grid gap-2">
                <Label>Author</Label>
                <Input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author Name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Blog description..."
                />
              </div>

              <Button className="mt-3 cursor-pointer" onClick={handleSubmit}>
                {editingBlog ? "Save Changes" : "Add Blog"}
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* BLOG LIST */}
      {loading ? (
        <p className="text-muted-foreground">Loading blogs...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {(Array.isArray(blogs) ? blogs : []).map((blog, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardContent className="p-4 space-y-3">

                <div className="rounded-md overflow-hidden h-40 bg-muted">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p className="text-sm text-primary">By {blog.author || "Admin"}</p>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.description}
                </p>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => startEdit(blog)}
                  >
                    <Pencil size={16} /> Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex gap-1 cursor-pointer"
                    onClick={() => deleteBlog(blog.id)}
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
