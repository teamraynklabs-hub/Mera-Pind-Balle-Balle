"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

/* ── Types ── */

interface LinkItem {
  label: string;
  link: string;
}

interface SocialLink {
  platform: string;
  link: string;
}

interface PageData {
  brand: { description: string };
  quickLinks: { columnTitle: string; items: LinkItem[] };
  supportLinks: { columnTitle: string; items: LinkItem[] };
  contactInfo: {
    columnTitle: string;
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: SocialLink[];
  legalLinks: LinkItem[];
  copyrightText: string;
}

const PLATFORM_OPTIONS = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "linkedin",
];

const SUB_TABS = [
  "Brand",
  "Quick Links",
  "Support Links",
  "Contact Info",
  "Social Links",
  "Legal Links",
] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function FooterManager() {
  const [pageData, setPageData] = useState<PageData>({
    brand: { description: "" },
    quickLinks: { columnTitle: "", items: [] },
    supportLinks: { columnTitle: "", items: [] },
    contactInfo: { columnTitle: "", address: "", phone: "", email: "" },
    socialLinks: [],
    legalLinks: [],
    copyrightText: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("Brand");

  async function loadPageData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/footer-page", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      if (json?.success && json.data) {
        setPageData(json.data);
      }
    } catch {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  /* ── Quick Links helpers ── */

  function addQuickLink() {
    setPageData((prev) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        items: [...prev.quickLinks.items, { label: "", link: "" }],
      },
    }));
  }

  function updateQuickLink(i: number, key: keyof LinkItem, value: string) {
    setPageData((prev) => {
      const items = [...prev.quickLinks.items];
      items[i] = { ...items[i], [key]: value };
      return { ...prev, quickLinks: { ...prev.quickLinks, items } };
    });
  }

  function removeQuickLink(i: number) {
    setPageData((prev) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        items: prev.quickLinks.items.filter((_, idx) => idx !== i),
      },
    }));
  }

  /* ── Support Links helpers ── */

  function addSupportLink() {
    setPageData((prev) => ({
      ...prev,
      supportLinks: {
        ...prev.supportLinks,
        items: [...prev.supportLinks.items, { label: "", link: "" }],
      },
    }));
  }

  function updateSupportLink(i: number, key: keyof LinkItem, value: string) {
    setPageData((prev) => {
      const items = [...prev.supportLinks.items];
      items[i] = { ...items[i], [key]: value };
      return { ...prev, supportLinks: { ...prev.supportLinks, items } };
    });
  }

  function removeSupportLink(i: number) {
    setPageData((prev) => ({
      ...prev,
      supportLinks: {
        ...prev.supportLinks,
        items: prev.supportLinks.items.filter((_, idx) => idx !== i),
      },
    }));
  }

  /* ── Social Links helpers ── */

  function addSocialLink() {
    setPageData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "facebook", link: "" }],
    }));
  }

  function updateSocialLink(
    i: number,
    key: keyof SocialLink,
    value: string
  ) {
    setPageData((prev) => {
      const links = [...prev.socialLinks];
      links[i] = { ...links[i], [key]: value };
      return { ...prev, socialLinks: links };
    });
  }

  function removeSocialLink(i: number) {
    setPageData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, idx) => idx !== i),
    }));
  }

  /* ── Legal Links helpers ── */

  function addLegalLink() {
    setPageData((prev) => ({
      ...prev,
      legalLinks: [...prev.legalLinks, { label: "", link: "" }],
    }));
  }

  function updateLegalLink(i: number, key: keyof LinkItem, value: string) {
    setPageData((prev) => {
      const items = [...prev.legalLinks];
      items[i] = { ...items[i], [key]: value };
      return { ...prev, legalLinks: items };
    });
  }

  function removeLegalLink(i: number) {
    setPageData((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.filter((_, idx) => idx !== i),
    }));
  }

  /* ── Save ── */

  async function savePageData() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/footer-page", {
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
      toast.success("Footer updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground text-lg">Loading footer data...</p>
      </div>
    );
  }

  /* ── Reusable link list editor ── */
  function LinkListEditor({
    items,
    onAdd,
    onUpdate,
    onRemove,
    addLabel,
  }: {
    items: LinkItem[];
    onAdd: () => void;
    onUpdate: (i: number, key: keyof LinkItem, value: string) => void;
    onRemove: (i: number) => void;
    addLabel: string;
  }) {
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item.label}
              onChange={(e) => onUpdate(i, "label", e.target.value)}
              placeholder="Label"
              className="flex-1"
            />
            <Input
              value={item.link}
              onChange={(e) => onUpdate(i, "link", e.target.value)}
              placeholder="/path or https://..."
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(i)}
              className="cursor-pointer shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No links yet.
          </p>
        )}

        <Button
          variant="outline"
          onClick={onAdd}
          className="cursor-pointer"
        >
          <Plus size={16} className="mr-1" /> {addLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Footer Manager</h1>
      </div>

      <p className="text-muted-foreground">
        Manage the footer content displayed on every page of the website.
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

      {/* BRAND TAB */}
      {activeSubTab === "Brand" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Brand & Copyright</h2>
            <p className="text-sm text-muted-foreground">
              Brand description shown below the logo and copyright text at the
              bottom.
            </p>

            <div>
              <label className="text-sm font-medium">Brand Description</label>
              <Textarea
                value={pageData.brand.description}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, description: e.target.value },
                  }))
                }
                placeholder="Empowering rural women artisans through traditional crafts..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Copyright Text</label>
              <Input
                value={pageData.copyrightText}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    copyrightText: e.target.value,
                  }))
                }
                placeholder="Mera Pind Balle Balle. All rights reserved."
              />
              <p className="text-xs text-muted-foreground mt-1">
                The year is added automatically before this text.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QUICK LINKS TAB */}
      {activeSubTab === "Quick Links" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Quick Links Column</h2>

            <div>
              <label className="text-sm font-medium">Column Title</label>
              <Input
                value={pageData.quickLinks.columnTitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    quickLinks: {
                      ...prev.quickLinks,
                      columnTitle: e.target.value,
                    },
                  }))
                }
                placeholder="Quick Links"
              />
            </div>

            <h3 className="text-lg font-medium pt-2">
              Links ({pageData.quickLinks.items.length})
            </h3>
            <LinkListEditor
              items={pageData.quickLinks.items}
              onAdd={addQuickLink}
              onUpdate={updateQuickLink}
              onRemove={removeQuickLink}
              addLabel="Add Quick Link"
            />
          </CardContent>
        </Card>
      )}

      {/* SUPPORT LINKS TAB */}
      {activeSubTab === "Support Links" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Support Links Column</h2>

            <div>
              <label className="text-sm font-medium">Column Title</label>
              <Input
                value={pageData.supportLinks.columnTitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    supportLinks: {
                      ...prev.supportLinks,
                      columnTitle: e.target.value,
                    },
                  }))
                }
                placeholder="Get Involved"
              />
            </div>

            <h3 className="text-lg font-medium pt-2">
              Links ({pageData.supportLinks.items.length})
            </h3>
            <LinkListEditor
              items={pageData.supportLinks.items}
              onAdd={addSupportLink}
              onUpdate={updateSupportLink}
              onRemove={removeSupportLink}
              addLabel="Add Support Link"
            />
          </CardContent>
        </Card>
      )}

      {/* CONTACT INFO TAB */}
      {activeSubTab === "Contact Info" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Contact Info Column</h2>

            <div>
              <label className="text-sm font-medium">Column Title</label>
              <Input
                value={pageData.contactInfo.columnTitle}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      columnTitle: e.target.value,
                    },
                  }))
                }
                placeholder="Contact Us"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={pageData.contactInfo.address}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      address: e.target.value,
                    },
                  }))
                }
                placeholder="123 Heritage Lane, New Delhi, India 110001"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={pageData.contactInfo.phone}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      phone: e.target.value,
                    },
                  }))
                }
                placeholder="+91 12345 67890"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={pageData.contactInfo.email}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      email: e.target.value,
                    },
                  }))
                }
                placeholder="hello@merapind.com"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* SOCIAL LINKS TAB */}
      {activeSubTab === "Social Links" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Social Links</h2>
            <p className="text-sm text-muted-foreground">
              Social media icons shown in the brand column.
            </p>

            <div className="space-y-3">
              {pageData.socialLinks.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={item.platform}
                    onChange={(e) =>
                      updateSocialLink(i, "platform", e.target.value)
                    }
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-[130px]"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={item.link}
                    onChange={(e) =>
                      updateSocialLink(i, "link", e.target.value)
                    }
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(i)}
                    className="cursor-pointer shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {pageData.socialLinks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No social links yet.
                </p>
              )}

              <Button
                variant="outline"
                onClick={addSocialLink}
                className="cursor-pointer"
              >
                <Plus size={16} className="mr-1" /> Add Social Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LEGAL LINKS TAB */}
      {activeSubTab === "Legal Links" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Legal Links</h2>
            <p className="text-sm text-muted-foreground">
              Shown at the very bottom of the footer next to the copyright text.
            </p>

            <LinkListEditor
              items={pageData.legalLinks}
              onAdd={addLegalLink}
              onUpdate={updateLegalLink}
              onRemove={removeLegalLink}
              addLabel="Add Legal Link"
            />
          </CardContent>
        </Card>
      )}

      {/* SAVE BUTTON */}
      <Button
        onClick={savePageData}
        disabled={submitting}
        className="w-full cursor-pointer text-base py-6"
      >
        {submitting ? "Saving..." : "Save Footer"}
      </Button>
    </div>
  );
}
