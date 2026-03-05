"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [confirmCurrentEmail, setConfirmCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrent() {
      try {
        const res = await fetch("/api/admin/admins/credentials", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCurrentEmail(data.email || null);
        }
      } catch (e) {
        // ignore
      }
    }
    fetchCurrent();
  }, []);

  function validate(): string | null {
    // must provide current password
    if (!currentPassword) return "Enter your current password";

    // confirm current email must match fetched email (if available)
    if (currentEmail && confirmCurrentEmail !== currentEmail) return "Confirmed current email does not match";

    // if changing password, validate
    if (newPassword) {
      if (newPassword.length < 8) return "New password must be at least 8 characters";
      if (newPassword !== confirmNewPassword) return "New password and confirmation do not match";
    }

    // if changing email, basic check
    if (newEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) return "Enter a valid new email";

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const clientValidation = validate();
    if (clientValidation) {
      setError(clientValidation);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/admins/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: newEmail || undefined,
          password: newPassword || undefined,
          currentPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Update failed");
      } else {
        setSuccess("Updated successfully");
        setNewPassword("");
        setConfirmNewPassword("");
        setCurrentPassword("");
        setConfirmCurrentEmail("");
        // refresh session / data
        router.refresh();
        // update displayed email if changed
        if (newEmail) setCurrentEmail(newEmail);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h1>Admin Settings</h1>

      <div style={{ marginBottom: 12 }}>
        <strong>Current email:</strong> {currentEmail ?? "(not available)"}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Confirm Current Email</label>
          <input
            type="email"
            value={confirmCurrentEmail}
            onChange={(e) => setConfirmCurrentEmail(e.target.value)}
            placeholder="type your current email to confirm"
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="required"
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>New Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="leave blank to keep current"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="leave blank to keep current"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="confirm new password"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {error && <p style={{ marginTop: 12, color: "#b91c1c" }}>{error}</p>}
      {success && <p style={{ marginTop: 12, color: "#0f766e" }}>{success}</p>}
    </div>
  );
}
