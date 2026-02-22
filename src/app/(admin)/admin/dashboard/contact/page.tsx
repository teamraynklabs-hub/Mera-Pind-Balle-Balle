"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Mail,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

/* ── Types ── */

interface ContactInfoItem {
  icon: string;
  title: string;
  lines: string[];
  href: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ContactPageData {
  hero: { title: string; subtitle: string; image: string };
  contactInfo: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: ContactInfoItem[];
  };
  formSection: { title: string; subtitle: string };
  faqs: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: FaqItem[];
  };
}

interface ContactLead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const EMPTY_DATA: ContactPageData = {
  hero: { title: "", subtitle: "", image: "" },
  contactInfo: { sectionTitle: "", sectionSubtitle: "", items: [] },
  formSection: { title: "", subtitle: "" },
  faqs: { sectionTitle: "", sectionSubtitle: "", items: [] },
};

type MainTab = "page-content" | "leads";
type ContentTab = "hero" | "contactInfo" | "formSection" | "faqs";

const CONTENT_TABS: { key: ContentTab; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "contactInfo", label: "Contact Info" },
  { key: "formSection", label: "Form" },
  { key: "faqs", label: "FAQs" },
];

export default function ContactDashboard() {
  /* ── State ── */
  const [mainTab, setMainTab] = useState<MainTab>("page-content");
  const [contentTab, setContentTab] = useState<ContentTab>("hero");
  const [data, setData] = useState<ContactPageData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [leadsFilter, setLeadsFilter] = useState<"all" | "pending" | "resolved">("all");
  const [leadsSearch, setLeadsSearch] = useState("");

  /* ── Fetch page content ── */
  async function fetchPageData() {
    try {
      const res = await fetch("/api/admin/contact-page", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.success && json.data) {
        setData({
          hero: {
            title: json.data.hero?.title ?? "",
            subtitle: json.data.hero?.subtitle ?? "",
            image: json.data.hero?.image ?? "",
          },
          contactInfo: {
            sectionTitle: json.data.contactInfo?.sectionTitle ?? "",
            sectionSubtitle: json.data.contactInfo?.sectionSubtitle ?? "",
            items: Array.isArray(json.data.contactInfo?.items)
              ? json.data.contactInfo.items.map((item: ContactInfoItem) => ({
                  icon: item.icon ?? "mail",
                  title: item.title ?? "",
                  lines: Array.isArray(item.lines) ? item.lines : [],
                  href: item.href ?? "",
                }))
              : [],
          },
          formSection: {
            title: json.data.formSection?.title ?? "",
            subtitle: json.data.formSection?.subtitle ?? "",
          },
          faqs: {
            sectionTitle: json.data.faqs?.sectionTitle ?? "",
            sectionSubtitle: json.data.faqs?.sectionSubtitle ?? "",
            items: Array.isArray(json.data.faqs?.items)
              ? json.data.faqs.items.map((item: FaqItem) => ({
                  question: item.question ?? "",
                  answer: item.answer ?? "",
                }))
              : [],
          },
        });
      }
    } catch {
      toast.error("Failed to load contact page data");
    } finally {
      setLoading(false);
    }
  }

  /* ── Fetch leads ── */
  async function fetchLeads() {
    try {
      const res = await fetch("/api/admin/contact-leads", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        setLeads(json.data);
      } else if (Array.isArray(json)) {
        setLeads(json);
      }
    } catch {
      toast.error("Failed to load contact leads");
    } finally {
      setLeadsLoading(false);
    }
  }

  useEffect(() => {
    fetchPageData();
    fetchLeads();
  }, []);

  /* ── Save page content ── */
  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Contact page saved!");
      } else {
        toast.error(json.message || "Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  /* ── Lead actions ── */
  async function toggleResolved(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/contact-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isResolved: !current }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(current ? "Marked as pending" : "Marked as resolved");
        setSelectedLead(null);
        fetchLeads();
      }
    } catch {
      toast.error("Failed to update lead");
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/contact-leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Lead deleted");
        setSelectedLead(null);
        fetchLeads();
      }
    } catch {
      toast.error("Failed to delete lead");
    }
  }

  /* ── Contact info item helpers ── */
  function addContactInfoItem() {
    setData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        items: [
          ...(prev.contactInfo.items || []),
          { icon: "mail", title: "", lines: [""], href: "" },
        ],
      },
    }));
  }

  function removeContactInfoItem(idx: number) {
    setData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        items: (prev.contactInfo.items || []).filter((_, i) => i !== idx),
      },
    }));
  }

  function updateContactInfoItem(
    idx: number,
    field: keyof ContactInfoItem,
    value: string | string[]
  ) {
    setData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        items: (prev.contactInfo.items || []).map((item, i) =>
          i === idx ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  /* ── FAQ helpers ── */
  function addFaqItem() {
    setData((prev) => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        items: [...(prev.faqs.items || []), { question: "", answer: "" }],
      },
    }));
  }

  function removeFaqItem(idx: number) {
    setData((prev) => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        items: (prev.faqs.items || []).filter((_, i) => i !== idx),
      },
    }));
  }

  function updateFaqItem(idx: number, field: keyof FaqItem, value: string) {
    setData((prev) => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        items: (prev.faqs.items || []).map((item, i) =>
          i === idx ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  /* ── Filtered leads ── */
  const filteredLeads = leads.filter((lead) => {
    if (leadsFilter === "pending" && lead.isResolved) return false;
    if (leadsFilter === "resolved" && !lead.isResolved) return false;
    if (leadsSearch.trim()) {
      const term = leadsSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.message.toLowerCase().includes(term) ||
        (lead.phone && lead.phone.includes(term))
      );
    }
    return true;
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ── RENDER ── */
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage contact page content and view submitted inquiries.
          </p>
        </div>
        {mainTab === "page-content" && (
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {/* ── Main Tabs ── */}
      <div className="flex gap-2 border-b pb-1">
        {(
          [
            { key: "page-content" as MainTab, label: "Page Content" },
            { key: "leads" as MainTab, label: `Contact Leads (${leads.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMainTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              mainTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          PAGE CONTENT TAB
         ══════════════════════════════════════════════════ */}
      {mainTab === "page-content" && (
        <>
          {/* Content Sub-Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CONTENT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setContentTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  contentTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Hero Tab ── */}
          {contentTab === "hero" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Hero Section</h2>
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    value={data.hero.title}
                    onChange={(e) =>
                      setData((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))
                    }
                    placeholder="Contact Us"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subtitle</label>
                  <Textarea
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))
                    }
                    placeholder="Have a question or want to collaborate?"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Hero Image URL (optional)
                  </label>
                  <Input
                    value={data.hero.image}
                    onChange={(e) =>
                      setData((p) => ({ ...p, hero: { ...p.hero, image: e.target.value } }))
                    }
                    placeholder="https://res.cloudinary.com/..."
                  />
                  {data.hero.image && (
                    <img
                      src={data.hero.image}
                      alt="Hero preview"
                      className="mt-3 w-full max-w-md h-40 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Contact Info Tab ── */}
          {contentTab === "contactInfo" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Contact Info Section</h2>

                <div className="flex items-center justify-between mt-6">
                  <h3 className="text-lg font-medium">Contact Info Cards</h3>
                  <Button size="sm" variant="outline" onClick={addContactInfoItem} className="cursor-pointer">
                    <Plus size={14} className="mr-1" /> Add Card
                  </Button>
                </div>

                {(data.contactInfo.items || []).map((item, idx) => (
                  <Card key={idx} className="border-dashed">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          Card {idx + 1}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeContactInfoItem(idx)}
                          className="cursor-pointer text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            Icon (map-pin, phone, mail, clock, etc.)
                          </label>
                          <Input
                            value={item.icon}
                            onChange={(e) =>
                              updateContactInfoItem(idx, "icon", e.target.value)
                            }
                            placeholder="map-pin"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Title</label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateContactInfoItem(idx, "title", e.target.value)
                            }
                            placeholder="Address"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            Link (optional, e.g. tel: or mailto:)
                          </label>
                          <Input
                            value={item.href}
                            onChange={(e) =>
                              updateContactInfoItem(idx, "href", e.target.value)
                            }
                            placeholder="tel:+911234567890"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">
                          Lines (one per line)
                        </label>
                        <Textarea
                          value={(item.lines || []).join("\n")}
                          onChange={(e) =>
                            updateContactInfoItem(
                              idx,
                              "lines",
                              e.target.value.split("\n")
                            )
                          }
                          placeholder={"123 Heritage Lane\nNew Delhi, India 110001"}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Form Section Tab ── */}
          {contentTab === "formSection" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Form Section</h2>
                <p className="text-sm text-muted-foreground">
                  These titles appear above the contact form on the user page.
                </p>
                <div>
                  <label className="text-sm font-medium mb-1 block">Form Title</label>
                  <Input
                    value={data.formSection.title}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        formSection: { ...p.formSection, title: e.target.value },
                      }))
                    }
                    placeholder="Send Us a Message"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Form Subtitle</label>
                  <Textarea
                    value={data.formSection.subtitle}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        formSection: { ...p.formSection, subtitle: e.target.value },
                      }))
                    }
                    placeholder="Fill out the form and our team will respond within 24 hours."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── FAQs Tab ── */}
          {contentTab === "faqs" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">FAQ Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Section Title</label>
                    <Input
                      value={data.faqs.sectionTitle}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          faqs: { ...p.faqs, sectionTitle: e.target.value },
                        }))
                      }
                      placeholder="Quick Answers"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Section Subtitle</label>
                    <Input
                      value={data.faqs.sectionSubtitle}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          faqs: { ...p.faqs, sectionSubtitle: e.target.value },
                        }))
                      }
                      placeholder="Common questions we receive"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <h3 className="text-lg font-medium">FAQ Items</h3>
                  <Button size="sm" variant="outline" onClick={addFaqItem} className="cursor-pointer">
                    <Plus size={14} className="mr-1" /> Add FAQ
                  </Button>
                </div>

                {(data.faqs.items || []).map((faq, idx) => (
                  <Card key={idx} className="border-dashed">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          FAQ {idx + 1}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFaqItem(idx)}
                          className="cursor-pointer text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Question</label>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFaqItem(idx, "question", e.target.value)}
                          placeholder="What are your shipping times?"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Answer</label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFaqItem(idx, "answer", e.target.value)}
                          placeholder="We typically ship within 2-3 business days..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════
          CONTACT LEADS TAB
         ══════════════════════════════════════════════════ */}
      {mainTab === "leads" && (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MessageSquare
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={leadsSearch}
                onChange={(e) => setLeadsSearch(e.target.value)}
                placeholder="Search leads by name, email, message..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLeadsFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    leadsFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {f === "all"
                    ? `All (${leads.length})`
                    : f === "pending"
                    ? `Pending (${leads.filter((l) => !l.isResolved).length})`
                    : `Resolved (${leads.filter((l) => l.isResolved).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Grid */}
          {leadsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare size={40} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm">
                {leadsSearch || leadsFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No contact form submissions yet"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => (
                <Card
                  key={lead._id}
                  className="hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <CardContent className="p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User size={16} /> {lead.name}
                      </h3>
                      <Badge
                        className={
                          lead.isResolved
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-black"
                        }
                      >
                        {lead.isResolved ? "Resolved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} /> {lead.email}
                    </p>
                    {lead.phone && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Phone size={14} /> {lead.phone}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {lead.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lead Detail Modal */}
          {selectedLead && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="max-w-lg w-full shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">{selectedLead.name}</h2>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="cursor-pointer"
                    >
                      <X size={22} className="hover:text-primary" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />{" "}
                      {selectedLead.email}
                    </p>
                    {selectedLead.phone && (
                      <p className="text-sm flex items-center gap-2">
                        <Phone size={16} className="text-muted-foreground" />{" "}
                        {selectedLead.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted:{" "}
                      {new Date(selectedLead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() =>
                        toggleResolved(selectedLead._id, selectedLead.isResolved)
                      }
                      variant={selectedLead.isResolved ? "outline" : "default"}
                      className="cursor-pointer"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      {selectedLead.isResolved ? "Mark Pending" : "Mark Resolved"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteLead(selectedLead._id)}
                      className="cursor-pointer"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
