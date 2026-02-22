"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SectionItem {
  title: string;
  content: string;
}

interface PageData {
  hero: { title: string; subtitle: string };
  lastUpdated: string;
  sections: SectionItem[];
  contactEmail: string;
  contactPhone: string;
}

const SUB_TABS = ["General", "Sections", "Contact Info"] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function PrivacyPolicyManager() {
  const [pageData, setPageData] = useState<PageData>({
    hero: { title: "", subtitle: "" },
    lastUpdated: "",
    sections: [],
    contactEmail: "",
    contactPhone: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("General");

  async function loadPageData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/privacy-policy-page", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      if (json?.success && json.data) {
        setPageData(json.data);
      }
    } catch {
      toast.error("Failed to load privacy policy page data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  function addSection() {
    setPageData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: `${prev.sections.length + 1}. New Section`, content: "" },
      ],
    }));
  }

  function updateSection(index: number, key: keyof SectionItem, value: string) {
    setPageData((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [key]: value };
      return { ...prev, sections };
    });
  }

  function removeSection(index: number) {
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  function moveSection(from: number, to: number) {
    if (to < 0 || to >= pageData.sections.length) return;
    setPageData((prev) => {
      const sections = [...prev.sections];
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      return { ...prev, sections };
    });
  }

  async function savePageData() {
    if (!pageData.hero.title.trim()) {
      toast.error("Page title is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/privacy-policy-page", {
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
      toast.success("Privacy policy page updated successfully!");
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
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Privacy Policy Manager</h1>
      </div>

      <p className="text-muted-foreground">
        Manage all content displayed on the public Privacy Policy page.
      </p>

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

      {/* GENERAL TAB */}
      {activeSubTab === "General" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">General Settings</h2>

            <div>
              <label className="text-sm font-medium">Page Title</label>
              <Input
                value={pageData.hero.title}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
                placeholder="Privacy Policy"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Introduction / Subtitle
              </label>
              <Textarea
                value={pageData.hero.subtitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                placeholder="This Privacy Policy describes how..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Last Updated Date (displayed on page)
              </label>
              <Input
                type="date"
                value={pageData.lastUpdated}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    lastUpdated: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTIONS TAB */}
      {activeSubTab === "Sections" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Policy Sections ({pageData.sections.length})
                </h2>
                <Button
                  variant="outline"
                  onClick={addSection}
                  className="cursor-pointer"
                >
                  <Plus size={16} className="mr-1" /> Add Section
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Each section has a title and content. Use line breaks for
                paragraphs. Use &quot;- &quot; at the start of a line for bullet
                points.
              </p>

              <div className="space-y-4">
                {pageData.sections.map((section, i) => (
                  <div
                    key={i}
                    className="p-4 bg-muted rounded-lg space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveSection(i, i - 1)}
                          disabled={i === 0}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSection(i, i + 1)}
                          disabled={i === pageData.sections.length - 1}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(i, "title", e.target.value)
                        }
                        placeholder="Section title (e.g., 1. Information We Collect)"
                        className="flex-1 font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(i)}
                        className="cursor-pointer shrink-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <Textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(i, "content", e.target.value)
                      }
                      placeholder="Section content... Use line breaks for paragraphs. Start lines with '- ' for bullet points."
                      rows={6}
                    />
                  </div>
                ))}

                {pageData.sections.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No sections yet. Click &quot;Add Section&quot; to start
                    building your privacy policy.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONTACT INFO TAB */}
      {activeSubTab === "Contact Info" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              Displayed at the bottom of the privacy policy page.
            </p>

            <div>
              <label className="text-sm font-medium">Contact Email</label>
              <Input
                value={pageData.contactEmail}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                placeholder="support@merapind.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contact Phone</label>
              <Input
                value={pageData.contactPhone}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactPhone: e.target.value,
                  }))
                }
                placeholder="+91 98765 43210"
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
        {submitting ? "Saving..." : "Save Privacy Policy Page"}
      </Button>
    </div>
  );
}
