"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Save, X, Loader2, Plus, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface FocusArea {
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface AboutData {
  hero: {
    title: string;
    description: string;
    image: string;
  };
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    description: string;
  };
  whyWeExist: {
    description: string;
  };
  focusAreas: FocusArea[];
  coreTeam: TeamMember[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export default function AboutPageEditor() {
  const [data, setData] = useState<AboutData>({
    hero: { title: "", description: "", image: "" },
    mission: { title: "", description: "" },
    vision: { title: "", description: "" },
    values: { title: "", description: "" },
    whyWeExist: { description: "" },
    focusAreas: [],
    coreTeam: [],
    cta: { title: "", description: "", buttonText: "" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"basic" | "team" | "focus">("basic");
  const [editingTeamIdx, setEditingTeamIdx] = useState<number | null>(null);
  const [editingFocusIdx, setEditingFocusIdx] = useState<number | null>(null);

  const [newTeam, setNewTeam] = useState<TeamMember>({ name: "", role: "", description: "", image: "" });
  const [newFocus, setNewFocus] = useState<FocusArea>({ title: "", description: "" });

  useEffect(() => {
    fetchAboutData();
  }, []);

  async function fetchAboutData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const result = await res.json();

      setData(result);
      setPreviewImage(result.hero?.image || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load About page data");
    } finally {
      setLoading(false);
    }
  }

  function handleBasicChange(
    section: "hero" | "mission" | "vision" | "values" | "whyWeExist" | "cta",
    field: string,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setPreviewImage(tempUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const uploadData = await res.json();
      const imageUrl = uploadData.url || uploadData.secure_url;

      if (imageUrl) {
        setData((prev) => ({
          ...prev,
          hero: { ...prev.hero, image: imageUrl },
        }));
        setPreviewImage(imageUrl);
        toast.success("Image uploaded");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
      setPreviewImage(data.hero.image);
    }
  }

  // FOCUS AREAS HANDLERS
  function addFocusArea() {
    if (!newFocus.title.trim() || !newFocus.description.trim()) {
      toast.error("Title and description required");
      return;
    }
    setData((prev) => ({
      ...prev,
      focusAreas: [...prev.focusAreas, { ...newFocus }],
    }));
    setNewFocus({ title: "", description: "" });
    toast.success("Focus area added");
  }

  function updateFocusArea(idx: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.map((fa, i) =>
        i === idx ? { ...fa, [field]: value } : fa
      ),
    }));
  }

  function deleteFocusArea(idx: number) {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== idx),
    }));
    toast.success("Focus area removed");
  }

  // TEAM HANDLERS
  function addTeamMember() {
    if (!newTeam.name.trim() || !newTeam.role.trim() || !newTeam.description.trim()) {
      toast.error("Name, role, and description required");
      return;
    }
    setData((prev) => ({
      ...prev,
      coreTeam: [...prev.coreTeam, { ...newTeam }],
    }));
    setNewTeam({ name: "", role: "", description: "", image: "" });
    toast.success("Team member added");
  }

  function updateTeamMember(idx: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      coreTeam: prev.coreTeam.map((tm, i) =>
        i === idx ? { ...tm, [field]: value } : tm
      ),
    }));
  }

  function deleteTeamMember(idx: number) {
    setData((prev) => ({
      ...prev,
      coreTeam: prev.coreTeam.filter((_, i) => i !== idx),
    }));
    toast.success("Team member removed");
  }

  async function handleTeamImageUpload(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const uploadData = await res.json();
      const imageUrl = uploadData.url || uploadData.secure_url;

      if (imageUrl) {
        updateTeamMember(idx, "image", imageUrl);
        toast.success("Image uploaded");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
    }
  }

  async function saveChanges() {
    if (!data.hero.title.trim() || !data.hero.description.trim()) {
      toast.error("Hero title and description required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("About page updated successfully!");
      await fetchAboutData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp pb-12">
      <div>
        <h1 className="text-3xl font-bold">About Page Manager</h1>
        <p className="text-muted-foreground mt-1">
          Manage all content sections of your About page
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "basic" ? "default" : "ghost"}
          onClick={() => setActiveTab("basic")}
          className="cursor-pointer"
        >
          Basic Info
        </Button>
        <Button
          variant={activeTab === "focus" ? "default" : "ghost"}
          onClick={() => setActiveTab("focus")}
          className="cursor-pointer"
        >
          Focus Areas
        </Button>
        <Button
          variant={activeTab === "team" ? "default" : "ghost"}
          onClick={() => setActiveTab("team")}
          className="cursor-pointer"
        >
          Core Team
        </Button>
      </div>

      {/* BASIC INFO TAB */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          {/* HERO SECTION */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Hero Section</h2>

              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={data.hero.title}
                  onChange={(e) => handleBasicChange("hero", "title", e.target.value)}
                  className="mt-1"
                  placeholder="About page title"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={data.hero.description}
                  onChange={(e) => handleBasicChange("hero", "description", e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="Hero description"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Banner Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer mt-2"
                />
                {previewImage && (
                  <div className="mt-3 h-40 rounded-md overflow-hidden border">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* MISSION VISION VALUES */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* MISSION */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Mission</h2>
                <Input
                  value={data.mission.title}
                  onChange={(e) => handleBasicChange("mission", "title", e.target.value)}
                  placeholder="Mission title"
                />
                <Textarea
                  value={data.mission.description}
                  onChange={(e) => handleBasicChange("mission", "description", e.target.value)}
                  rows={4}
                  placeholder="Mission description"
                />
              </CardContent>
            </Card>

            {/* VISION */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Vision</h2>
                <Input
                  value={data.vision.title}
                  onChange={(e) => handleBasicChange("vision", "title", e.target.value)}
                  placeholder="Vision title"
                />
                <Textarea
                  value={data.vision.description}
                  onChange={(e) => handleBasicChange("vision", "description", e.target.value)}
                  rows={4}
                  placeholder="Vision description"
                />
              </CardContent>
            </Card>

            {/* VALUES */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Values</h2>
                <Input
                  value={data.values.title}
                  onChange={(e) => handleBasicChange("values", "title", e.target.value)}
                  placeholder="Values title"
                />
                <Textarea
                  value={data.values.description}
                  onChange={(e) => handleBasicChange("values", "description", e.target.value)}
                  rows={4}
                  placeholder="Values description"
                />
              </CardContent>
            </Card>
          </div>

          {/* WHY WE EXIST */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Why We Exist</h2>
              <Textarea
                value={data.whyWeExist.description}
                onChange={(e) => handleBasicChange("whyWeExist", "description", e.target.value)}
                rows={4}
                placeholder="Why we exist description"
              />
            </CardContent>
          </Card>

          {/* CTA SECTION */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Call-to-Action</h2>
              <Input
                value={data.cta.title}
                onChange={(e) => handleBasicChange("cta", "title", e.target.value)}
                placeholder="CTA title"
              />
              <Textarea
                value={data.cta.description}
                onChange={(e) => handleBasicChange("cta", "description", e.target.value)}
                rows={3}
                placeholder="CTA description"
              />
              <Input
                value={data.cta.buttonText}
                onChange={(e) => handleBasicChange("cta", "buttonText", e.target.value)}
                placeholder="Button text"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* FOCUS AREAS TAB */}
      {activeTab === "focus" && (
        <div className="space-y-6">
          {/* ADD NEW FOCUS AREA */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Add Focus Area</h2>
              <Input
                value={newFocus.title}
                onChange={(e) => setNewFocus({ ...newFocus, title: e.target.value })}
                placeholder="Focus area title"
              />
              <Textarea
                value={newFocus.description}
                onChange={(e) => setNewFocus({ ...newFocus, description: e.target.value })}
                rows={3}
                placeholder="Focus area description"
              />
              <Button onClick={addFocusArea} className="w-full cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Focus Area
              </Button>
            </CardContent>
          </Card>

          {/* LIST FOCUS AREAS */}
          <div className="grid gap-4">
            {data.focusAreas.map((fa, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">Focus Area {idx + 1}</h3>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteFocusArea(idx)}
                      className="cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <Input
                    value={fa.title}
                    onChange={(e) => updateFocusArea(idx, "title", e.target.value)}
                    placeholder="Title"
                  />
                  <Textarea
                    value={fa.description}
                    onChange={(e) => updateFocusArea(idx, "description", e.target.value)}
                    rows={3}
                    placeholder="Description"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CORE TEAM TAB */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* ADD NEW TEAM MEMBER */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Add Team Member</h2>
              <Input
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Member name"
              />
              <Input
                value={newTeam.role}
                onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                placeholder="Role/Position"
              />
              <Textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                rows={3}
                placeholder="Bio/Description"
              />
              <Button onClick={addTeamMember} className="w-full cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Team Member
              </Button>
            </CardContent>
          </Card>

          {/* LIST TEAM MEMBERS */}
          <div className="grid gap-4">
            {data.coreTeam.map((member, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{member.name || `Team Member ${idx + 1}`}</h3>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTeamMember(idx)}
                      className="cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={member.name}
                      onChange={(e) => updateTeamMember(idx, "name", e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                      placeholder="Role"
                    />
                  </div>

                  <Textarea
                    value={member.description}
                    onChange={(e) => updateTeamMember(idx, "description", e.target.value)}
                    rows={2}
                    placeholder="Bio"
                  />

                  <div>
                    <label className="text-sm font-medium">Profile Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleTeamImageUpload(e, idx)}
                      className="cursor-pointer mt-2"
                    />
                  </div>

                  {member.image && (
                    <div className="h-32 rounded-md overflow-hidden border">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <Button
        onClick={saveChanges}
        disabled={saving}
        className="w-full py-6 text-base cursor-pointer"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save size={18} className="mr-2" />
            Save All Changes
          </>
        )}
      </Button>
    </div>
  );
}