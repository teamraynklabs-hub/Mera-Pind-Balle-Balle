"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Plus,
  X,
  Settings,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function ServicesManager() {
  // TEMP SERVICES (Replace when backend connected)
  const [services, setServices] = useState<any[]>([
    {
      id: 1,
      title: "Skill Development Program",
      desc: "Training villagers in handicrafts, digital literacy, and entrepreneurship.",
      imageUrl: "",
    },
    {
      id: 2,
      title: "Women Empowerment Workshops",
      desc: "Providing tools and guidance for self-help groups.",
      imageUrl: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    imageUrl: "",
  });

  // Input Handler
  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Image Upload
  function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);

    setFormData({ ...formData, imageUrl: tempUrl });

    // TODO: Upload image to backend → POST /api/upload
  }

  // Save New or Update Existing
  function saveService() {
    if (!formData.title.trim()) {
      alert("Service title is required!");
      return;
    }

    // EDIT MODE
    if (editing) {
      const updated = services.map((item) =>
        item.id === editing.id ? { ...editing, ...formData } : item
      );

      // TODO: PATCH /api/services/:id
      setServices(updated);
      closeForm();
      return;
    }

    // ADD MODE
    const newService = {
      id: Date.now(),
      ...formData,
    };

    // TODO: POST /api/services
    setServices([newService, ...services]);
    closeForm();
  }

  // Delete Service
  function deleteService(id: number) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    // TODO: DELETE /api/services/:id
    const updated = services.filter((item) => item.id !== id);
    setServices(updated);
  }

  // Edit Mode
  function openEdit(item: any) {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  }

  // Reset Form
  function closeForm() {
    setEditing(null);
    setShowForm(false);
    setFormData({
      title: "",
      desc: "",
      imageUrl: "",
    });
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services Manager</h1>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <p className="text-muted-foreground">
        Manage your village initiatives, programs, and support services.
      </p>

      {/* SERVICE LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {services.map((service, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">

              {/* IMAGE / ICON */}
              <div className="h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Service Image"
                  />
                ) : (
                  <Settings size={40} className="text-muted-foreground" />
                )}
              </div>

              {/* TITLE */}
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings size={18} />
                {service.title}
              </h2>

              {/* DESC */}
              <p className="text-sm text-muted-foreground">{service.desc}</p>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => openEdit(service)}
                >
                  <Edit size={16} />
                </Button>

                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => deleteService(service.id)}
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
        <div
          className="
          fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          animate-fadeIn
        "
        >
          <Card className="max-w-lg w-full shadow-xl">
            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {editing ? "Edit Service" : "Add Service"}
                </h2>

                <button onClick={closeForm}>
                  <X size={22} className="hover:text-primary cursor-pointer" />
                </button>
              </div>

              {/* TITLE INPUT */}
              <Input
                name="title"
                placeholder="Service Title"
                value={formData.title}
                onChange={handleChange}
              />

              {/* DESCRIPTION INPUT */}
              <Textarea
                name="desc"
                placeholder="Short Description"
                rows={3}
                value={formData.desc}
                onChange={handleChange}
              />

              {/* IMAGE UPLOAD */}
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer mt-1"
                  onChange={handleImageUpload}
                />

                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    className="mt-3 h-32 w-full object-cover rounded-md border"
                  />
                )}
              </div>

              {/* SAVE BUTTON */}
              <Button className="w-full cursor-pointer" onClick={saveService}>
                {editing ? "Save Changes" : "Add Service"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
