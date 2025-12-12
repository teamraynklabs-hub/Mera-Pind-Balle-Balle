"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  Trash2,
  Edit,
  Image as ImageIcon
} from "lucide-react";

export default function DistributorsManager() {
  // TEMPORARY DATA – backend developer will replace later
  const [distributors, setDistributors] = useState<any[]>([
    {
      id: 1,
      name: "Punjab Agro Distributors",
      email: "punjabdistributors@gmail.com",
      phone: "9876543210",
      website: "https://punjabagro.com",
      image: "",
    },
    {
      id: 2,
      name: "North India Supplies",
      email: "northsupplies@gmail.com",
      phone: "9123456700",
      website: "",
      image: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    image: "",
  });

  // HANDLE INPUT CHANGE
  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // IMAGE UPLOAD (LOCAL PREVIEW ONLY)
  function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFormData({ ...formData, image: url });

    // TODO: Replace with real backend file upload (POST /upload)
  }

  // SAVE DISTRIBUTOR (ADD OR EDIT)
  function saveDistributor() {
    if (!formData.name.trim()) {
      alert("Distributor name is required.");
      return;
    }

    // EDIT MODE
    if (editing) {
      const updated = distributors.map((item) =>
        item.id === editing.id ? { ...editing, ...formData } : item
      );

      // TODO: Backend update (PATCH /api/distributors/:id)
      setDistributors(updated);
      setEditing(null);
      setShowForm(false);
      return;
    }

    // ADD NEW MODE
    const newDistributor = {
      id: Date.now(),
      ...formData,
    };

    // TODO: Backend save (POST /api/distributors)
    setDistributors([newDistributor, ...distributors]);

    setShowForm(false);
  }

  // DELETE DISTRIBUTOR
  function deleteDistributor(id: number) {
    if (!confirm("Are you sure you want to delete this distributor?")) return;

    const updated = distributors.filter((item) => item.id !== id);

    // TODO: Backend delete (DELETE /api/distributors/:id)
    setDistributors(updated);
  }

  // OPEN EDIT FORM
  function openEdit(item: any) {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  }

  // RESET FORM
  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      image: "",
    });
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Distributors Manager</h1>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> Add Distributor
        </Button>
      </div>

      <p className="text-muted-foreground">
        Manage all distributors from across India.
      </p>

      {/* LIST OF DISTRIBUTORS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {distributors.map((item, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">

              {/* IMAGE */}
              <div className="h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    className="object-cover w-full h-full"
                    alt="Distributor"
                  />
                ) : (
                  <ImageIcon size={40} className="text-muted-foreground" />
                )}
              </div>

              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building size={18} /> {item.name}
              </h2>

              <p className="text-sm flex items-center gap-2">
                <Mail size={16} /> {item.email}
              </p>

              <p className="text-sm flex items-center gap-2">
                <Phone size={16} /> {item.phone}
              </p>

              {item.website && (
                <p className="text-sm flex items-center gap-2">
                  <Globe size={16} />
                  <a
                    href={item.website}
                    target="_blank"
                    className="text-primary underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}

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
                  onClick={() => deleteDistributor(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {showForm && (
        <div className="
          fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          animate-fadeIn
        ">
          <Card className="max-w-lg w-full shadow-xl">
            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {editing ? "Edit Distributor" : "Add Distributor"}
                </h2>

                <button onClick={closeForm}>
                  <X size={22} className="hover:text-primary cursor-pointer" />
                </button>
              </div>

              {/* FORM FIELDS */}

              <Input
                placeholder="Distributor Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                placeholder="Website URL (optional)"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />

              {/* IMAGE UPLOAD */}
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />

                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-3 h-28 w-full object-cover rounded-md border"
                  />
                )}
              </div>

              {/* SAVE BUTTON */}
              <Button
                className="w-full cursor-pointer"
                onClick={saveDistributor}
              >
                {editing ? "Save Changes" : "Add Distributor"}
              </Button>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
