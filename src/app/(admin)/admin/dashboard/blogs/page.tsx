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
import { Pencil, Trash2, Plus, Eye, EyeOff, Tag } from "lucide-react";
import { toast } from "sonner";

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string;
  image: File | null;
  isPublished: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "Mera Pind Balle Balle",
  tags: "",
  image: null,
  isPublished: true,
};

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  image?: string;
  isPublished: boolean;
  date?: string;
  createdAt?: string;
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [form, setForm] = useState<BlogForm>({ ...EMPTY_FORM });

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

      const json = await res.json();
      setBlogs(json.data ?? json ?? []);
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
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    setForm({ ...form, image: file });
    setPreviewImage(URL.createObjectURL(file));
  }

  function startEdit(blog: Blog) {
    setEditingBlog(blog);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "Mera Pind Balle Balle",
      tags: (blog.tags || []).join(", "),
      image: null,
      isPublished: blog.isPublished ?? true,
    });
    setPreviewImage(blog.image || "");
    setOpen(true);
  }

  function resetForm() {
    setEditingBlog(null);
    setForm({ ...EMPTY_FORM });
    setPreviewImage("");
  }

  // ================= CREATE / UPDATE =================
  async function handleSubmit() {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error("Title, excerpt, and content are required");
      return;
    }

    if (!editingBlog && !form.image) {
      toast.error("Image is required for new blog");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("author", form.author);
      fd.append("tags", form.tags);
      fd.append("isPublished", String(form.isPublished));

      if (form.image) fd.append("image", form.image);

      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : "/api/admin/blogs";

      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to save blog");
        return;
      }

      setOpen(false);
      resetForm();
      loadBlogs();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error("Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  // ================= DELETE =================
  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog? This cannot be undone.")) return;

    await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    loadBlogs();
  }

  // ================= FORMAT DATE =================
  function formatDate(d: string) {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // ================= UI =================
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Blogs Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {blogs.length} blog{blogs.length !== 1 ? "s" : ""} total
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
            <Button>
              <Plus size={18} className="mr-1" /> Add Blog
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Image */}
              <div className="space-y-2">
                <Label>Cover Image {!editingBlog && <span className="text-destructive">*</span>}</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  name="title"
                  placeholder="Blog title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  name="author"
                  placeholder="Author name"
                  value={form.author}
                  onChange={handleChange}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
                <Input
                  name="tags"
                  placeholder="e.g. handweaving, traditional crafts, rural women"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label>Excerpt <span className="text-destructive">*</span></Label>
                <Textarea
                  name="excerpt"
                  rows={2}
                  placeholder="Short summary of the blog"
                  value={form.excerpt}
                  onChange={handleChange}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Content <span className="text-destructive">*</span> <span className="text-xs text-muted-foreground">(HTML supported)</span></Label>
                <Textarea
                  name="content"
                  rows={8}
                  placeholder="Full blog content (HTML allowed)"
                  value={form.content}
                  onChange={handleChange}
                />
              </div>

              {/* Publish Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm({ ...form, isPublished: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium">Publish Blog</span>
              </label>

              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full"
              >
                {saving
                  ? "Saving..."
                  : editingBlog
                  ? "Save Changes"
                  : "Create Blog"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No blogs yet. Click &quot;Add Blog&quot; to create your first blog.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Image */}
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 w-full bg-muted/30 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">No Image</span>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{blog.author || "Unknown"}</span>
                    <span>&middot;</span>
                    <span>{formatDate(blog.date || blog.createdAt || "")}</span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {blog.isPublished ? (
                      <>
                        <Eye size={13} className="text-green-500" />
                        <span className="text-green-600">Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} className="text-yellow-500" />
                        <span className="text-yellow-600">Draft</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(blog)}
                      className="flex-1"
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBlog(blog._id)}
                      className="flex-1"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
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
