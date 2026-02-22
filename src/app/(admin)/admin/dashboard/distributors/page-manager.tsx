"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

interface BenefitItem {
  title: string;
  description: string;
}

interface StepItem {
  title: string;
  description: string;
}

interface PageData {
  hero: { title: string; subtitle: string; bannerImage: string };
  benefits: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: BenefitItem[];
  };
  requirements: {
    sectionTitle: string;
    sectionSubtitle: string;
    image: string;
    items: string[];
  };
  steps: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: StepItem[];
  };
  formSection: { title: string; subtitle: string };
}

const SUB_TABS = ["Hero", "Benefits", "Requirements", "Steps", "Form Section"] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function DistributorsPageManager() {
  const [pageData, setPageData] = useState<PageData>({
    hero: { title: "", subtitle: "", bannerImage: "" },
    benefits: { sectionTitle: "", sectionSubtitle: "", items: [] },
    requirements: { sectionTitle: "", sectionSubtitle: "", image: "", items: [] },
    steps: { sectionTitle: "", sectionSubtitle: "", items: [] },
    formSection: { title: "", subtitle: "" },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("Hero");

  async function loadPageData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/distributors-page", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      if (json?.success && json.data) {
        setPageData(json.data);
      }
    } catch {
      toast.error("Failed to load distributors page data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  async function handleImageUpload(
    field: "hero.bannerImage" | "requirements.image"
  ) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);
        const base = getBaseUrl();
        const res = await axios.post(`${base}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data.url) throw new Error("No URL returned");

        if (field === "hero.bannerImage") {
          setPageData((prev) => ({
            ...prev,
            hero: { ...prev.hero, bannerImage: res.data.url },
          }));
        } else {
          setPageData((prev) => ({
            ...prev,
            requirements: { ...prev.requirements, image: res.data.url },
          }));
        }
        toast.success("Image uploaded");
      } catch {
        toast.error("Failed to upload image");
      }
    };
    input.click();
  }

  function addBenefit() {
    setPageData((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        items: [...prev.benefits.items, { title: "", description: "" }],
      },
    }));
  }

  function updateBenefit(index: number, key: keyof BenefitItem, value: string) {
    setPageData((prev) => {
      const items = [...prev.benefits.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, benefits: { ...prev.benefits, items } };
    });
  }

  function removeBenefit(index: number) {
    setPageData((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        items: prev.benefits.items.filter((_, i) => i !== index),
      },
    }));
  }

  function addRequirement() {
    setPageData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        items: [...prev.requirements.items, ""],
      },
    }));
  }

  function updateRequirement(index: number, value: string) {
    setPageData((prev) => {
      const items = [...prev.requirements.items];
      items[index] = value;
      return { ...prev, requirements: { ...prev.requirements, items } };
    });
  }

  function removeRequirement(index: number) {
    setPageData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        items: prev.requirements.items.filter((_, i) => i !== index),
      },
    }));
  }

  function addStep() {
    setPageData((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        items: [...prev.steps.items, { title: "", description: "" }],
      },
    }));
  }

  function updateStep(index: number, key: keyof StepItem, value: string) {
    setPageData((prev) => {
      const items = [...prev.steps.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, steps: { ...prev.steps, items } };
    });
  }

  function removeStep(index: number) {
    setPageData((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        items: prev.steps.items.filter((_, i) => i !== index),
      },
    }));
  }

  async function savePageData() {
    if (!pageData.hero.title.trim()) {
      toast.error("Hero title is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/distributors-page", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      const json = await res.json();
      if (json?.success && json.data) {
        setPageData(json.data);
      }
      toast.success("Distributors page updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground text-lg">Loading page data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2">
        {SUB_TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeSubTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSubTab(tab)}
            className="cursor-pointer"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeSubTab === "Hero" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Hero Section</h2>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={pageData.hero.title}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
                placeholder="Become a Distributor"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                value={pageData.hero.subtitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                placeholder="Join our growing network..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Banner Image</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={pageData.hero.bannerImage}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, bannerImage: e.target.value },
                    }))
                  }
                  placeholder="Image URL or upload"
                />
                <Button
                  variant="outline"
                  onClick={() => handleImageUpload("hero.bannerImage")}
                  className="cursor-pointer shrink-0"
                >
                  <ImageIcon size={16} className="mr-1" /> Upload
                </Button>
              </div>
              {pageData.hero.bannerImage && (
                <img
                  src={pageData.hero.bannerImage}
                  alt="Banner preview"
                  className="mt-3 w-full h-48 object-cover rounded-lg border"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BENEFITS TAB */}
      {activeSubTab === "Benefits" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Benefits Section</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={pageData.benefits.sectionTitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      benefits: { ...prev.benefits, sectionTitle: e.target.value },
                    }))
                  }
                  placeholder="Partnership Benefits"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={pageData.benefits.sectionSubtitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      benefits: { ...prev.benefits, sectionSubtitle: e.target.value },
                    }))
                  }
                  placeholder="What you get when..."
                />
              </div>
            </div>

            <div className="space-y-3">
              {pageData.benefits.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-start p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateBenefit(i, "title", e.target.value)}
                      placeholder="Benefit title"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateBenefit(i, "description", e.target.value)}
                      placeholder="Benefit description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(i)}
                    className="cursor-pointer mt-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addBenefit} className="cursor-pointer">
              <Plus size={16} className="mr-1" /> Add Benefit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* REQUIREMENTS TAB */}
      {activeSubTab === "Requirements" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Requirements Section</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={pageData.requirements.sectionTitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        sectionTitle: e.target.value,
                      },
                    }))
                  }
                  placeholder="Partnership Requirements"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={pageData.requirements.sectionSubtitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        sectionSubtitle: e.target.value,
                      },
                    }))
                  }
                  placeholder="What we look for..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Requirements Image</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={pageData.requirements.image}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      requirements: { ...prev.requirements, image: e.target.value },
                    }))
                  }
                  placeholder="Image URL or upload"
                />
                <Button
                  variant="outline"
                  onClick={() => handleImageUpload("requirements.image")}
                  className="cursor-pointer shrink-0"
                >
                  <ImageIcon size={16} className="mr-1" /> Upload
                </Button>
              </div>
              {pageData.requirements.image && (
                <img
                  src={pageData.requirements.image}
                  alt="Requirements preview"
                  className="mt-3 w-full h-48 object-cover rounded-lg border"
                />
              )}
            </div>

            <div className="space-y-2">
              {pageData.requirements.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  <Input
                    value={item}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder="Requirement text"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(i)}
                    className="cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addRequirement} className="cursor-pointer">
              <Plus size={16} className="mr-1" /> Add Requirement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEPS TAB */}
      {activeSubTab === "Steps" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Steps Section</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={pageData.steps.sectionTitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      steps: { ...prev.steps, sectionTitle: e.target.value },
                    }))
                  }
                  placeholder="How It Works"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={pageData.steps.sectionSubtitle}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      steps: { ...prev.steps, sectionSubtitle: e.target.value },
                    }))
                  }
                  placeholder="Simple steps to become..."
                />
              </div>
            </div>

            <div className="space-y-3">
              {pageData.steps.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-start p-3 bg-muted rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateStep(i, "title", e.target.value)}
                      placeholder="Step title"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateStep(i, "description", e.target.value)}
                      placeholder="Step description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(i)}
                    className="cursor-pointer mt-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addStep} className="cursor-pointer">
              <Plus size={16} className="mr-1" /> Add Step
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FORM SECTION TAB */}
      {activeSubTab === "Form Section" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Form Section</h2>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={pageData.formSection.title}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    formSection: { ...prev.formSection, title: e.target.value },
                  }))
                }
                placeholder="Apply Now"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                value={pageData.formSection.subtitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    formSection: { ...prev.formSection, subtitle: e.target.value },
                  }))
                }
                placeholder="Fill out the form below..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* SAVE BUTTON */}
      <Button
        onClick={savePageData}
        disabled={submitting}
        className="w-full cursor-pointer text-base py-6"
      >
        {submitting ? "Saving..." : "Save Distributors Page"}
      </Button>
    </div>
  );
}
