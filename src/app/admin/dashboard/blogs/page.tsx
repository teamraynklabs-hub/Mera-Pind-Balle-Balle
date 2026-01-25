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
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [form, setForm] = useState<{
    title: string;
    excerpt: string;
    content: string;
    image: File | null;
  }>({
    title: "",
    excerpt: "",
    content: "",
    image: null,
  });

  // ================= LOAD BLOGS =================
async function loadBlogs() {
  try {
    const res = await fetch("/api/admin/blogs", {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      setBlogs([]);
      return;
    }

    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("BLOG LOAD ERROR:", err);
    setBlogs([]);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    loadBlogs();
  }, []);

  // ================= HANDLERS =================
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreviewImage(URL.createObjectURL(file));
  }

  function startEdit(blog: any) {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: null,
    });
    setPreviewImage(blog.image);
    setOpen(true);
  }

  function resetForm() {
    setEditingBlog(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      image: null,
    });
    setPreviewImage("");
  }

  // ================= CREATE / UPDATE =================
  async function handleSubmit() {
    if (!form.title || !form.excerpt || !form.content) {
      alert("Title, excerpt and content are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("excerpt", form.excerpt);
    fd.append("content", form.content);
    if (form.image) fd.append("image", form.image);

    const url = editingBlog
      ? `/api/admin/blogs/${editingBlog._id}`
      : "/api/admin/blogs";

    const method = editingBlog ? "PUT" : "POST";

    await fetch(url, {
      method,
      credentials: "include",
      body: fd,
    });

    setOpen(false);
    resetForm();
    loadBlogs();
  }

  // ================= DELETE =================
  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog?")) return;

    await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    loadBlogs();
  }

  // ================= UI =================
  return (
    <div className="space-y-8">
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
            <Button>
              <Plus size={18} /> Add Blog
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog" : "Add Blog"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />

              {previewImage && (
                <img
                  src={previewImage}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} />

              <Label>Excerpt (short summary)</Label>
              <Textarea
                name="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={handleChange}
              />

              <Label>Content (full blog)</Label>
              <Textarea
                name="content"
                rows={6}
                value={form.content}
                onChange={handleChange}
              />

              <Button onClick={handleSubmit}>
                {editingBlog ? "Save Changes" : "Create Blog"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id}>
              <CardContent className="space-y-3">
                <img
                  src={blog.image}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="font-semibold">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => startEdit(blog)}>
                    <Pencil size={16} /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteBlog(blog._id)}
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
