"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ShoppingCart,
  User,
  Sun,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface NavLink {
  title: string;
  href: string;
  isVisible: boolean;
}

interface NavbarData {
  brandName: string;
  logoUrl: string;
  navLinks: NavLink[];
  showCart: boolean;
  showLogin: boolean;
  showThemeToggle: boolean;
}

const SUB_TABS = ["Brand", "Navigation Links", "Feature Toggles"] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function NavbarManager() {
  const [data, setData] = useState<NavbarData>({
    brandName: "",
    logoUrl: "",
    navLinks: [],
    showCart: true,
    showLogin: true,
    showThemeToggle: true,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("Brand");

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/navbar-settings", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
      }
    } catch {
      toast.error("Failed to load navbar settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function addLink() {
    setData((prev) => ({
      ...prev,
      navLinks: [
        ...prev.navLinks,
        { title: "New Link", href: "/", isVisible: true },
      ],
    }));
  }

  function updateLink(index: number, key: keyof NavLink, value: any) {
    setData((prev) => {
      const navLinks = [...prev.navLinks];
      navLinks[index] = { ...navLinks[index], [key]: value };
      return { ...prev, navLinks };
    });
  }

  function removeLink(index: number) {
    setData((prev) => ({
      ...prev,
      navLinks: prev.navLinks.filter((_, i) => i !== index),
    }));
  }

  function moveLink(from: number, to: number) {
    if (to < 0 || to >= data.navLinks.length) return;
    setData((prev) => {
      const navLinks = [...prev.navLinks];
      const [moved] = navLinks.splice(from, 1);
      navLinks.splice(to, 0, moved);
      return { ...prev, navLinks };
    });
  }

  async function saveData() {
    if (!data.brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("brandName", data.brandName);
      fd.append("navLinks", JSON.stringify(data.navLinks));
      fd.append("showCart", String(data.showCart));
      fd.append("showLogin", String(data.showLogin));
      fd.append("showThemeToggle", String(data.showThemeToggle));

      if (logoFile) {
        fd.append("logo", logoFile);
      }

      const res = await fetch("/api/admin/navbar-settings", {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
        setLogoFile(null);
      }
      toast.success("Navbar settings updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground text-lg">Loading navbar settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Navbar Manager</h1>
      </div>

      <p className="text-muted-foreground">
        Manage the navigation bar displayed across all public pages.
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
            <h2 className="text-xl font-semibold">Brand Settings</h2>

            <div>
              <label className="text-sm font-medium">Brand Name</label>
              <Input
                value={data.brandName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, brandName: e.target.value }))
                }
                placeholder="Mera Pind Balle Balle"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Logo</label>
              <div className="flex items-center gap-4 mt-2">
                {data.logoUrl && (
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.logoUrl}
                      alt="Current logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setLogoFile(file);
                    }}
                    className="cursor-pointer"
                  />
                  {logoFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      New logo selected: {logoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NAVIGATION LINKS TAB */}
      {activeSubTab === "Navigation Links" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Navigation Links ({data.navLinks.length})
                </h2>
                <Button
                  variant="outline"
                  onClick={addLink}
                  className="cursor-pointer"
                >
                  <Plus size={16} className="mr-1" /> Add Link
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Add, reorder, or toggle visibility of navigation links. Hidden
                links will not appear on the public navbar.
              </p>

              <div className="space-y-3">
                {data.navLinks.map((link, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg space-y-3 ${
                      link.isVisible ? "bg-muted" : "bg-muted/40 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveLink(i, i - 1)}
                          disabled={i === 0}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveLink(i, i + 1)}
                          disabled={i === data.navLinks.length - 1}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>

                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(i, "title", e.target.value)}
                        placeholder="Link title"
                        className="flex-1 font-medium"
                      />

                      <Input
                        value={link.href}
                        onChange={(e) => updateLink(i, "href", e.target.value)}
                        placeholder="/path"
                        className="flex-1"
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateLink(i, "isVisible", !link.isVisible)
                        }
                        className="cursor-pointer shrink-0"
                        title={link.isVisible ? "Hide link" : "Show link"}
                      >
                        {link.isVisible ? (
                          <Eye size={16} className="text-green-500" />
                        ) : (
                          <EyeOff size={16} className="text-muted-foreground" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(i)}
                        className="cursor-pointer shrink-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}

                {data.navLinks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No navigation links. Click &quot;Add Link&quot; to add one.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FEATURE TOGGLES TAB */}
      {activeSubTab === "Feature Toggles" && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold">Feature Toggles</h2>
            <p className="text-sm text-muted-foreground">
              Show or hide specific elements in the navbar.
            </p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showCart}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, showCart: e.target.checked }))
                }
                className="w-4 h-4 accent-primary"
              />
              <ShoppingCart size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Show Cart Icon</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showLogin}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, showLogin: e.target.checked }))
                }
                className="w-4 h-4 accent-primary"
              />
              <User size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Show Login / Logout Icon</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showThemeToggle}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    showThemeToggle: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-primary"
              />
              <Sun size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Show Theme Toggle</span>
            </label>
          </CardContent>
        </Card>
      )}

      {/* SAVE BUTTON */}
      <Button
        onClick={saveData}
        disabled={submitting}
        className="w-full cursor-pointer text-base py-6"
      >
        {submitting && <Loader2 size={16} className="mr-2 animate-spin" />}
        {submitting ? "Saving..." : "Save Navbar Settings"}
      </Button>
    </div>
  );
}
