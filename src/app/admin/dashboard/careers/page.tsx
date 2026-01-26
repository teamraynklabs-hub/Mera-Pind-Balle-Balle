"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit3, Save, X, Upload } from "lucide-react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl"; // ← assuming you have this

interface Job {
  _id?: string;
  title: string;
  location?: string;
  type?: string;
  description: string;
  salary?: string;
  image?: string;
}

export default function CareersManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Job & { file?: File }>({
    title: "",
    location: "",
    description: "",
    salary: "",
    image: "",
    file: undefined,
  });

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

async function loadJobs() {
  try {
    setLoading(true);
    setError(null);
    const base = getBaseUrl();
    const res = await axios.get(`/api/admin/careers`, {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data.data || res.data;
    const jobsArray = Array.isArray(data.jobs) ? data.jobs : [];
    setJobs(jobsArray);
  } catch (err: any) {
    console.error("Load jobs failed:", err);
    setError(
      err.response?.data?.error || "Could not load job listings. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, file }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base = getBaseUrl();
      const isEdit = !!editingId;

      let imageUrl = form.image && typeof form.image === "string" ? form.image : undefined;

      // Upload file if it's a new File object
      if (form.file instanceof File) {
        const uploadForm = new FormData();
        uploadForm.append("file", form.file);

        try {
          const uploadRes = await axios.post(`/api/upload`, uploadForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          setError("Failed to upload image. Continuing without image.");
        }
      }

      const payload = {
        title: form.title.trim(),
        location: form.location?.trim() || "",
        description: form.description.trim(),
        salary: form.salary?.trim() || "",
        type: "Full-time",
        ...(imageUrl && { image: imageUrl }),
      };

      if (isEdit) {
        // UPDATE
        await axios.put(`/api/admin/careers/${editingId}`, payload);
      } else {
        // CREATE
        await axios.post(`/api/admin/careers`, payload);
      }

      resetForm();
      await loadJobs(); // refresh list
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(job: Job) {
    setEditingId(job._id || null);
    setForm({
      _id: job._id,
      title: job.title,
      location: job.location || "",
      type: job.type,
      description: job.description,
      salary: job.salary || "",
      image: job.image || "",
      file: undefined,
    });
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm("Delete this job permanently?")) return;

    try {
      setLoading(true);
      const base = getBaseUrl();
      await axios.delete(`/api/careers/${id}`);
      await loadJobs();
    } catch (err) {
      setError("Failed to delete job");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      title: "",
      location: "",
      description: "",
      salary: "",
      image: "",
      file: undefined,
    });
    setEditingId(null);
    setError(null);
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Careers Manager</h1>
        <p className="text-muted-foreground mt-1">
          Create, update and manage job openings shown on the Careers page
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md border border-destructive/30">
          {error}
        </div>
      )}

      {/* Form */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <label className="font-medium">Job Title *</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Field Sales Executive"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <label className="font-medium">Location</label>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ludhiana / Remote / Punjab"
                />
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Salary (optional)</label>
                <Input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="₹25,000 – ₹40,000 / month"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="font-medium">Job Description *</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Responsibilities, qualifications, what we offer..."
                rows={6}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="font-medium">Job Image / Banner (optional)</label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {form.file && (
                  <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {form.file.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: 1200×600 px banner or logo
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Saving..."
                ) : editingId ? (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Update Job
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Job
                  </>
                )}
              </Button>

              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Current Openings</h2>

        {loading && jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/40">
            No jobs added yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
                {job.image && (
                  <div className="h-40 bg-muted relative">
                    <img
                      src={job.image}
                      alt={job.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
                  {job.location && (
                    <p className="text-sm text-muted-foreground">📍 {job.location}</p>
                  )}
                  {job.salary && (
                    <p className="text-sm font-medium text-primary">{job.salary}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(job._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}