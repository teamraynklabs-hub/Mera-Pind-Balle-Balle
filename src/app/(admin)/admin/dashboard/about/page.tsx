"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface ImpactStat {
  number: string;
  label: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface AboutData {
  hero: { title: string; subtitle: string; image: string };
  mission: { title: string; description: string; image: string };
  vision: { title: string; description: string; image: string };
  values: { sectionTitle: string; sectionSubtitle: string; items: ValueItem[] };
  impact: { sectionTitle: string; sectionSubtitle: string; stats: ImpactStat[] };
  team: { sectionTitle: string; sectionSubtitle: string; members: TeamMember[] };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
}

const EMPTY_DATA: AboutData = {
  hero: { title: "", subtitle: "", image: "" },
  mission: { title: "", description: "", image: "" },
  vision: { title: "", description: "", image: "" },
  values: { sectionTitle: "", sectionSubtitle: "", items: [] },
  impact: { sectionTitle: "", sectionSubtitle: "", stats: [] },
  team: { sectionTitle: "", sectionSubtitle: "", members: [] },
  cta: { title: "", description: "", primaryButtonText: "", primaryButtonLink: "", secondaryButtonText: "", secondaryButtonLink: "" },
};

type Tab = "hero" | "mission" | "vision" | "values" | "impact" | "team" | "cta";

const TABS: { key: Tab; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "mission", label: "Mission" },
  { key: "vision", label: "Vision" },
  { key: "values", label: "Values" },
  { key: "impact", label: "Impact" },
  { key: "team", label: "Team" },
  { key: "cta", label: "CTA" },
];

const ICON_OPTIONS = [
  { value: "heart", label: "Heart" },
  { value: "shield", label: "Shield" },
  { value: "leaf", label: "Leaf" },
  { value: "users", label: "Users" },
  { value: "women", label: "Women" },
  { value: "villages", label: "Villages" },
  { value: "products", label: "Products" },
  { value: "customers", label: "Customers" },
  { value: "community", label: "Community" },
  { value: "sustainability", label: "Sustainability" },
  { value: "trust", label: "Trust" },
  { value: "families", label: "Families" },
];

export default function AboutPageEditor() {
  const [data, setData] = useState<AboutData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  const [newValue, setNewValue] = useState<ValueItem>({ icon: "heart", title: "", description: "" });
  const [newStat, setNewStat] = useState<ImpactStat>({ number: "", label: "", icon: "users" });
  const [newMember, setNewMember] = useState<TeamMember>({ name: "", role: "", description: "", image: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const result = await res.json();
      const d = result.data || result;
      setData({
        hero: {
          title: d.hero?.title ?? "",
          subtitle: d.hero?.subtitle ?? d.hero?.description ?? "",
          image: d.hero?.image ?? "",
        },
        mission: {
          title: d.mission?.title ?? "",
          description: d.mission?.description ?? "",
          image: d.mission?.image ?? "",
        },
        vision: {
          title: d.vision?.title ?? "",
          description: d.vision?.description ?? "",
          image: d.vision?.image ?? "",
        },
        values: {
          sectionTitle: d.values?.sectionTitle ?? "",
          sectionSubtitle: d.values?.sectionSubtitle ?? "",
          items: Array.isArray(d.values?.items) ? d.values.items : [],
        },
        impact: {
          sectionTitle: d.impact?.sectionTitle ?? "",
          sectionSubtitle: d.impact?.sectionSubtitle ?? "",
          stats: Array.isArray(d.impact?.stats) ? d.impact.stats : [],
        },
        team: {
          sectionTitle: d.team?.sectionTitle ?? "",
          sectionSubtitle: d.team?.sectionSubtitle ?? "",
          members: Array.isArray(d.team?.members) ? d.team.members : [],
        },
        cta: {
          title: d.cta?.title ?? "",
          description: d.cta?.description ?? "",
          primaryButtonText: d.cta?.primaryButtonText ?? "",
          primaryButtonLink: d.cta?.primaryButtonLink ?? "",
          secondaryButtonText: d.cta?.secondaryButtonText ?? "",
          secondaryButtonLink: d.cta?.secondaryButtonLink ?? "",
        },
      });
    } catch {
      toast.error("Failed to load About page data");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      return result.url || result.secure_url || null;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    section: "hero" | "mission" | "vision",
    field: string = "image"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: url },
      }));
      toast.success("Image uploaded");
    }
  }

  async function handleTeamImageUpload(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setData((prev) => ({
        ...prev,
        team: {
          ...prev.team,
          members: (prev.team.members || []).map((m, i) => (i === idx ? { ...m, image: url } : m)),
        },
      }));
      toast.success("Image uploaded");
    }
  }

  function addValueItem() {
    if (!newValue.title.trim() || !newValue.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setData((prev) => ({
      ...prev,
      values: { ...prev.values, items: [...(prev.values.items || []), { ...newValue }] },
    }));
    setNewValue({ icon: "heart", title: "", description: "" });
    toast.success("Value added");
  }

  function removeValueItem(idx: number) {
    setData((prev) => ({
      ...prev,
      values: { ...prev.values, items: (prev.values.items || []).filter((_, i) => i !== idx) },
    }));
  }

  function updateValueItem(idx: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: (prev.values.items || []).map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
      },
    }));
  }

  function addImpactStat() {
    if (!newStat.number.trim() || !newStat.label.trim()) {
      toast.error("Number and label are required");
      return;
    }
    setData((prev) => ({
      ...prev,
      impact: { ...prev.impact, stats: [...(prev.impact.stats || []), { ...newStat }] },
    }));
    setNewStat({ number: "", label: "", icon: "users" });
    toast.success("Stat added");
  }

  function removeImpactStat(idx: number) {
    setData((prev) => ({
      ...prev,
      impact: { ...prev.impact, stats: (prev.impact.stats || []).filter((_, i) => i !== idx) },
    }));
  }

  function updateImpactStat(idx: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      impact: {
        ...prev.impact,
        stats: (prev.impact.stats || []).map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
      },
    }));
  }

  function addTeamMember() {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    setData((prev) => ({
      ...prev,
      team: { ...prev.team, members: [...(prev.team.members || []), { ...newMember }] },
    }));
    setNewMember({ name: "", role: "", description: "", image: "" });
    toast.success("Team member added");
  }

  function removeTeamMember(idx: number) {
    setData((prev) => ({
      ...prev,
      team: { ...prev.team, members: (prev.team.members || []).filter((_, i) => i !== idx) },
    }));
  }

  function updateTeamMember(idx: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        members: (prev.team.members || []).map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
      },
    }));
  }

  async function saveChanges() {
    if (!data.hero.title.trim()) {
      toast.error("Hero title is required");
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
      await fetchData();
    } catch {
      toast.error("Failed to save changes");
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
        <p className="text-muted-foreground mt-1">Manage all sections of the About page</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.key)}
            className="cursor-pointer"
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* ─── HERO TAB ─── */}
      {activeTab === "hero" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={data.hero.title}
                onChange={(e) => setData((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                placeholder="About page hero title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                value={data.hero.subtitle}
                onChange={(e) => setData((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                rows={4}
                placeholder="Short description below the title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Background Image (optional)</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "hero")} className="cursor-pointer mt-1" />
              {data.hero.image && (
                <div className="mt-3 h-40 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.hero.image} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── MISSION TAB ─── */}
      {activeTab === "mission" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Mission Section</h2>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={data.mission.title}
                onChange={(e) => setData((p) => ({ ...p, mission: { ...p.mission, title: e.target.value } }))}
                placeholder="Mission title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={data.mission.description}
                onChange={(e) => setData((p) => ({ ...p, mission: { ...p.mission, description: e.target.value } }))}
                rows={5}
                placeholder="Mission description"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mission Image</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "mission")} className="cursor-pointer mt-1" />
              {data.mission.image && (
                <div className="mt-3 h-40 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.mission.image} alt="Mission preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── VISION TAB ─── */}
      {activeTab === "vision" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Vision Section</h2>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={data.vision.title}
                onChange={(e) => setData((p) => ({ ...p, vision: { ...p.vision, title: e.target.value } }))}
                placeholder="Vision title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={data.vision.description}
                onChange={(e) => setData((p) => ({ ...p, vision: { ...p.vision, description: e.target.value } }))}
                rows={5}
                placeholder="Vision description"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Vision Image</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "vision")} className="cursor-pointer mt-1" />
              {data.vision.image && (
                <div className="mt-3 h-40 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.vision.image} alt="Vision preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── VALUES TAB ─── */}
      {activeTab === "values" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Values Section Settings</h2>
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={data.values.sectionTitle}
                  onChange={(e) => setData((p) => ({ ...p, values: { ...p.values, sectionTitle: e.target.value } }))}
                  placeholder="e.g. Our Core Values"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={data.values.sectionSubtitle}
                  onChange={(e) => setData((p) => ({ ...p, values: { ...p.values, sectionSubtitle: e.target.value } }))}
                  placeholder="e.g. The principles that guide everything we do"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Add Value</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  value={newValue.title}
                  onChange={(e) => setNewValue({ ...newValue, title: e.target.value })}
                  placeholder="Value title"
                />
                <select
                  value={newValue.icon}
                  onChange={(e) => setNewValue({ ...newValue, icon: e.target.value })}
                  className="border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <Textarea
                value={newValue.description}
                onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
                rows={3}
                placeholder="Value description"
              />
              <Button onClick={addValueItem} className="w-full cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Value
              </Button>
            </CardContent>
          </Card>

          {(data.values.items || []).map((item, idx) => (
            <Card key={idx}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{item.title || `Value ${idx + 1}`}</h3>
                  <Button size="sm" variant="destructive" onClick={() => removeValueItem(idx)} className="cursor-pointer">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    value={item.title}
                    onChange={(e) => updateValueItem(idx, "title", e.target.value)}
                    placeholder="Title"
                  />
                  <select
                    value={item.icon}
                    onChange={(e) => updateValueItem(idx, "icon", e.target.value)}
                    className="border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateValueItem(idx, "description", e.target.value)}
                  rows={3}
                  placeholder="Description"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── IMPACT TAB ─── */}
      {activeTab === "impact" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Impact Section Settings</h2>
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={data.impact.sectionTitle}
                  onChange={(e) => setData((p) => ({ ...p, impact: { ...p.impact, sectionTitle: e.target.value } }))}
                  placeholder="e.g. Our Impact"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={data.impact.sectionSubtitle}
                  onChange={(e) => setData((p) => ({ ...p, impact: { ...p.impact, sectionSubtitle: e.target.value } }))}
                  placeholder="e.g. Numbers that tell our story"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Add Impact Stat</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  value={newStat.number}
                  onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                  placeholder="e.g. 500+"
                />
                <Input
                  value={newStat.label}
                  onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  placeholder="e.g. Women Empowered"
                />
                <select
                  value={newStat.icon}
                  onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                  className="border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <Button onClick={addImpactStat} className="w-full cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Stat
              </Button>
            </CardContent>
          </Card>

          {(data.impact.stats || []).map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{stat.label || `Stat ${idx + 1}`}</h3>
                  <Button size="sm" variant="destructive" onClick={() => removeImpactStat(idx)} className="cursor-pointer">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    value={stat.number}
                    onChange={(e) => updateImpactStat(idx, "number", e.target.value)}
                    placeholder="Number"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateImpactStat(idx, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <select
                    value={stat.icon}
                    onChange={(e) => updateImpactStat(idx, "icon", e.target.value)}
                    className="border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── TEAM TAB ─── */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Team Section Settings</h2>
              <div>
                <label className="text-sm font-medium">Section Title</label>
                <Input
                  value={data.team.sectionTitle}
                  onChange={(e) => setData((p) => ({ ...p, team: { ...p.team, sectionTitle: e.target.value } }))}
                  placeholder="e.g. Meet Our Team"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Subtitle</label>
                <Input
                  value={data.team.sectionSubtitle}
                  onChange={(e) => setData((p) => ({ ...p, team: { ...p.team, sectionSubtitle: e.target.value } }))}
                  placeholder="e.g. Passionate individuals working to create meaningful change"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Add Team Member</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Member name"
                />
                <Input
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Role / Position"
                />
              </div>
              <Textarea
                value={newMember.description}
                onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                rows={3}
                placeholder="Short bio / description"
              />
              <Button onClick={addTeamMember} className="w-full cursor-pointer">
                <Plus size={18} className="mr-2" /> Add Team Member
              </Button>
            </CardContent>
          </Card>

          {(data.team.members || []).map((member, idx) => (
            <Card key={idx}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{member.name || `Member ${idx + 1}`}</h3>
                  <Button size="sm" variant="destructive" onClick={() => removeTeamMember(idx)} className="cursor-pointer">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
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
                    className="cursor-pointer mt-1"
                  />
                </div>
                {member.image && (
                  <div className="h-32 rounded-md overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── CTA TAB ─── */}
      {activeTab === "cta" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Call-to-Action Section</h2>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={data.cta.title}
                onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))}
                placeholder="e.g. Join Our Mission"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={data.cta.description}
                onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }))}
                rows={3}
                placeholder="CTA description"
                className="mt-1"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Primary Button Text</label>
                <Input
                  value={data.cta.primaryButtonText}
                  onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, primaryButtonText: e.target.value } }))}
                  placeholder="e.g. Shop Collection"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Primary Button Link</label>
                <Input
                  value={data.cta.primaryButtonLink}
                  onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, primaryButtonLink: e.target.value } }))}
                  placeholder="e.g. /products"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Secondary Button Text</label>
                <Input
                  value={data.cta.secondaryButtonText}
                  onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, secondaryButtonText: e.target.value } }))}
                  placeholder="e.g. Read Stories"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Secondary Button Link</label>
                <Input
                  value={data.cta.secondaryButtonLink}
                  onChange={(e) => setData((p) => ({ ...p, cta: { ...p.cta, secondaryButtonLink: e.target.value } }))}
                  placeholder="e.g. /stories"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SAVE BUTTON */}
      <Button onClick={saveChanges} disabled={saving} className="w-full py-6 text-base cursor-pointer">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
          </>
        ) : (
          <>
            <Save size={18} className="mr-2" /> Save All Changes
          </>
        )}
      </Button>
    </div>
  );
}
