"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, Mail, User, Phone, Trash2 } from "lucide-react";

export default function ContactLeadsManager() {
  // Temporary dummy data before backend connection
  const [leads, setLeads] = useState<any[]>([
    {
      id: 1,
      name: "Rohit Kumar",
      email: "rohit@example.com",
      phone: "9876543210",
      message: "I want to become a distributor. Please contact.",
      resolved: false,
    },
    {
      id: 2,
      name: "Anita Sharma",
      email: "anita@example.com",
      phone: "9123456780",
      message: "Need information about organic jaggery bulk purchase.",
      resolved: true,
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // MARK LEAD AS RESOLVED
  function markResolved(id: number) {
    const updated = leads.map((lead) =>
      lead.id === id ? { ...lead, resolved: true } : lead
    );

    // TODO: Backend update (PATCH /api/contact/:id)

    setLeads(updated);
  }

  // DELETE LEAD
  function deleteLead(id: number) {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    const updated = leads.filter((lead) => lead.id !== id);

    // TODO: Backend delete (DELETE /api/contact/:id)

    setLeads(updated);
    setSelectedLead(null);
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <h1 className="text-3xl font-bold">Contact Leads Manager</h1>
      <p className="text-muted-foreground">
        View and manage all inquiries submitted from the website.
      </p>

      {/* LEADS LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {leads.map((lead, index) => (
          <Card
            key={index}
            className="shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedLead(lead)}
          >
            <CardContent className="p-4 space-y-2">

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User size={18} /> {lead.name}
                </h2>

                {lead.resolved ? (
                  <Badge className="bg-green-600">Resolved</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>

              <p className="text-sm flex items-center gap-2">
                <Mail size={16} /> {lead.email}
              </p>

              <p className="text-sm flex items-center gap-2">
                <Phone size={16} /> {lead.phone}
              </p>

              <p className="text-muted-foreground text-sm line-clamp-2">
                {lead.message}
              </p>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* SELECTED LEAD POPUP */}
      {selectedLead && (
        <div className="
          fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          animate-fadeIn
        ">
          <Card className="max-w-lg w-full shadow-xl">
            <CardContent className="p-6 space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{selectedLead.name}</h2>

                <button onClick={() => setSelectedLead(null)}>
                  <X size={22} className="hover:text-primary cursor-pointer" />
                </button>
              </div>

              <p className="text-sm flex items-center gap-2">
                <Mail size={16} /> {selectedLead.email}
              </p>

              <p className="text-sm flex items-center gap-2">
                <Phone size={16} /> {selectedLead.phone}
              </p>

              <p className="text-muted-foreground text-sm pt-2">
                {selectedLead.message}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-4">

                {!selectedLead.resolved && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => markResolved(selectedLead.id)}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Mark as Resolved
                  </Button>
                )}

                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => deleteLead(selectedLead.id)}
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Lead
                </Button>

              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
