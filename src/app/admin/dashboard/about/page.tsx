"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Save, X } from "lucide-react";

export default function AboutPageEditor() {
  // TEMP DATA — Replace with backend API later
  const [data, setData] = useState({
    title: "About Mera Pind Balle Balle",
    subtitle: "Empowering Rural Communities With Innovation & Support",
    description:
      "Mera Pind Balle Balle is committed to transforming rural India by supporting women entrepreneurs, promoting sustainability, and enabling skill development programs across Punjab and beyond.",
    imageUrl: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Input handler
  function handleChange(e: any) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // Image upload preview
  function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    // TODO: Upload image to backend → POST /api/upload
    // After upload, save URL to database
  }

  // Save changes
  function saveChanges() {
    // TODO: Send data to backend → PATCH /api/pages/about
    alert("About Page Updated Successfully!");
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold">About Page Editor</h1>
      <p className="text-muted-foreground">
        Modify the About section displayed on the public website.
      </p>

      <Card className="shadow-sm hover:shadow-md transition">
        <CardContent className="p-6 space-y-6">

          {/* TITLE */}
          <div>
            <label className="font-medium text-sm">Main Title</label>
            <Input
              name="title"
              value={data.title}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter About Title"
            />
          </div>

          {/* SUBTITLE */}
          <div>
            <label className="font-medium text-sm">Subtitle</label>
            <Input
              name="subtitle"
              value={data.subtitle}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter Subtitle"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium text-sm">Description</label>
            <Textarea
              name="description"
              rows={5}
              value={data.description}
              onChange={handleChange}
              className="mt-1"
              placeholder="Write detailed description..."
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-medium text-sm">Header Image</label>

            <Input
              type="file"
              accept="image/*"
              className="cursor-pointer mt-2"
              onChange={handleImageUpload}
            />

            <div className="mt-3 h-48 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
              {previewImage || data.imageUrl ? (
                <img
                  src={previewImage || data.imageUrl}
                  alt="About Page Header"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={40} className="text-muted-foreground" />
              )}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <Button onClick={saveChanges} className="w-full cursor-pointer flex items-center gap-2">
            <Save size={18} /> Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
