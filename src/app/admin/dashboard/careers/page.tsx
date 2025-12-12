"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit3, Save, X } from "lucide-react";

export default function CareersManager() {
  // Dummy state before backend is connected
  const [careers, setCareers] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    salary: "",
    image: null as File | null,
  });

  // Handle input changes
  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle file uploads (Image / PDF)
  function handleFileUpload(e: any) {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
  }

  // Add new job
  function handleAdd() {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill required fields.");
      return;
    }

    const newCareer = { ...form, id: Date.now() };

    // Backend will require API POST here
    setCareers((prev) => [...prev, newCareer]);

    resetForm();
  }

  // Edit job
  function handleEdit(index: number) {
    setEditingIndex(index);
    setForm(careers[index]);
  }

  // Save edited job
  function handleSave() {
    if (editingIndex === null) return;

    const updatedList = [...careers];
    updatedList[editingIndex] = form;

    // Backend will require API PUT here
    setCareers(updatedList);

    resetForm();
    setEditingIndex(null);
  }

  // Delete job
  function handleDelete(index: number) {
    if (!confirm("Are you sure?")) return;

    const updatedList = careers.filter((_, i) => i !== index);

    // Backend will require API DELETE here
    setCareers(updatedList);
  }

  // Reset form
  function resetForm() {
    setForm({
      title: "",
      location: "",
      description: "",
      salary: "",
      image: null,
    });
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <h1 className="text-3xl font-bold">Careers Manager</h1>
      <p className="text-muted-foreground">Add, edit, and manage all job openings.</p>

      {/* Form Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">

          <div>
            <label className="font-medium">Job Title *</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Location</label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Bengaluru, India"
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Salary</label>
            <Input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="₹40,000 / month"
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Description *</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Job responsibilities, required skills..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <label className="font-medium">Upload Image / PDF</label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="cursor-pointer mt-1"
            />
          </div>

          {/* Action Button */}
          {editingIndex === null ? (
            <Button
              className="mt-2 cursor-pointer"
              onClick={handleAdd}
            >
              <PlusCircle size={18} className="mr-2" /> Add Job
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button className="cursor-pointer" onClick={handleSave}>
                <Save size={18} className="mr-2" /> Save Changes
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setEditingIndex(null);
                }}
                className="cursor-pointer"
              >
                <X size={18} className="mr-2" /> Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Careers List */}
      <div className="grid md:grid-cols-2 gap-6">
        {careers.map((career, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">

              <h2 className="text-xl font-semibold">{career.title}</h2>

              <p className="text-sm text-muted-foreground">
                {career.location || "No location provided"}
              </p>

              <p className="text-sm">{career.description}</p>

              {career.salary && (
                <p className="text-primary font-medium">{career.salary}</p>
              )}

              {career.image && (
                <p className="text-xs text-muted-foreground">
                  File attached: {career.image?.name}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(index)}
                  className="cursor-pointer"
                >
                  <Edit3 size={16} className="mr-1" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                  className="cursor-pointer"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
