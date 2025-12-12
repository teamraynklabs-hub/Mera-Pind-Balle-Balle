"use client";

import { useState } from "react";
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
  // Temporary resources list (Replace with backend API later)
  const [resources, setResources] = useState<any[]>([
    {
      id: 1,
      title: "Government Rural Development Scheme",
      desc: "A complete guide to latest schemes available for rural communities.",
      fileUrl: "",
    },
    {
      id: 2,
      title: "Women Empowerment Toolkit",
      desc: "Training material and worksheets for self-help groups.",
      fileUrl: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    fileUrl: "",
  });

  // Input handling
  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // File Upload (PDF / DOC / Image)
  function handleFileUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setFormData({ ...formData, fileUrl: tempUrl });

    // TODO (BACKEND): Replace with file upload endpoint POST /api/upload
  }

  // Save (Add / Edit)
  function saveResource() {
    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }

    // EDIT MODE
    if (editing) {
      const updated = resources.map((item) =>
        item.id === editing.id ? { ...editing, ...formData } : item
      );

      // TODO: PATCH /api/resources/:id
      setResources(updated);
      closeForm();
      return;
    }

    // ADD MODE
    const newResource = {
      id: Date.now(),
      ...formData,
    };

    // TODO: POST /api/resources
    setResources([newResource, ...resources]);
    closeForm();
  }

  // Delete
  function deleteResource(id: number) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const updated = resources.filter((item) => item.id !== id);

    // TODO: DELETE /api/resources/:id
    setResources(updated);
  }

  // Edit
  function openEdit(item: any) {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  }

  // Reset
  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData({
      title: "",
      desc: "",
      fileUrl: "",
    });
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

      {/* RESOURCE LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {resources.map((item, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">

              {/* File Preview */}
              <div className="h-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                {item.fileUrl ? (
                  <iframe
                    src={item.fileUrl}
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

              <p className="text-sm text-muted-foreground">{item.desc}</p>

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
                  onClick={() => deleteResource(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

                {formData.fileUrl && (
                  <iframe
                    src={formData.fileUrl}
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
