"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function DistributorsPageManager() {
  const [pageData, setPageData] = useState<{
    _id?: string;
    bannerImage: string;
    benefits: string[];
    requirements: string[];
    isActive: boolean;
  }>({
    bannerImage: "",
    benefits: [],
    requirements: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  // LOAD PAGE DATA
  async function loadPageData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/distributors-page", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load page data");

      const data = await res.json();
      setPageData(data);
      setPreviewImage(data.bannerImage || "");
    } catch (error) {
      console.error("Load error:", error);
      alert("Failed to load distributors page data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  // HANDLE BANNER IMAGE UPLOAD
  async function handleBannerUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    // Upload using the app's /api/upload endpoint (like careers page does)
    const formData = new FormData();
    formData.append("file", file);

    try {
      const base = getBaseUrl();
      const res = await axios.post(`${base}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.url) {
        throw new Error("No image URL returned from upload");
      }

      console.log("Image uploaded successfully:", res.data.url);
      setPageData({ ...pageData, bannerImage: res.data.url });
      setPreviewImage(res.data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
      // Keep the preview image visible even if upload fails
      setPageData({ ...pageData, bannerImage: url });
    }
  }

  // ADD BENEFIT
  function addBenefit() {
    if (!newBenefit.trim()) return;
    setPageData({
      ...pageData,
      benefits: [...pageData.benefits, newBenefit.trim()],
    });
    setNewBenefit("");
  }

  // REMOVE BENEFIT
  function removeBenefit(index: number) {
    setPageData({
      ...pageData,
      benefits: pageData.benefits.filter((_, i) => i !== index),
    });
  }

  // ADD REQUIREMENT
  function addRequirement() {
    if (!newRequirement.trim()) return;
    setPageData({
      ...pageData,
      requirements: [...pageData.requirements, newRequirement.trim()],
    });
    setNewRequirement("");
  }

  // REMOVE REQUIREMENT
  function removeRequirement(index: number) {
    setPageData({
      ...pageData,
      requirements: pageData.requirements.filter((_, i) => i !== index),
    });
  }

  // SAVE PAGE DATA
  async function savePageData() {
    if (!pageData.bannerImage || !pageData.bannerImage.trim()) {
      alert("Banner image is required");
      return;
    }

    if (pageData.benefits.length === 0) {
      alert("Add at least one benefit");
      return;
    }

    if (pageData.requirements.length === 0) {
      alert("Add at least one requirement");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/distributors-page", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bannerImage: pageData.bannerImage,
          benefits: pageData.benefits,
          requirements: pageData.requirements,
          isActive: pageData.isActive,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      alert("Distributors page updated successfully!");
      await loadPageData();
    } catch (error) {
      console.error("Save error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Failed to save"}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <h1 className="text-3xl font-bold">Distributors Page Manager</h1>

      <p className="text-muted-foreground">
        Manage the content displayed on the public distributors page.
      </p>

      <div className="grid gap-6">
        {/* BANNER IMAGE SECTION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Banner Image</h2>

            <div>
              <label className="text-sm font-medium">Upload Banner</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="cursor-pointer"
              />
            </div>

            {previewImage && (
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* BENEFITS SECTION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Benefits</h2>

            <div className="space-y-2">
              {pageData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{benefit}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Enter a benefit..."
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
              />
              <Button
                onClick={addBenefit}
                variant="outline"
                className="cursor-pointer"
              >
                <Plus size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* REQUIREMENTS SECTION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Distributor Requirements</h2>

            <div className="space-y-2">
              {pageData.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{requirement}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Enter a requirement..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button
                onClick={addRequirement}
                variant="outline"
                className="cursor-pointer"
              >
                <Plus size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <Button
          onClick={savePageData}
          disabled={submitting}
          className="w-full cursor-pointer text-base py-6"
        >
          {submitting ? "Saving..." : "Save Distributors Page"}
        </Button>
      </div>
    </div>
  );
}
