import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const cancelEditing = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setError("");
    setNotice("");
    setIsEditing(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      await updateProfile(form);
      setIsEditing(false);
      setNotice("Your profile details have been updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile-page page-shell">
      <div className="profile-page-heading">
        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>Profile settings</h1>
          <p>Keep your account details up to date.</p>
        </div>
        <Link className="profile-back-link" to="/dashboard">← Back to dashboard</Link>
      </div>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div className="profile-identity">
            <span className="profile-avatar profile-page-avatar">{initial}</span>
            <span><strong>{user?.name}</strong><small>{user?.email}</small></span>
          </div>
          {!isEditing && (
            <button className="btn btn-secondary profile-edit-button" type="button" onClick={() => { setNotice(""); setIsEditing(true); }}>
              <span aria-hidden="true">✎</span> Edit profile
            </button>
          )}
        </div>

        <div className="profile-card-divider" />
        {error && <div className="alert profile-alert" role="alert">{error}</div>}
        {notice && <div className="profile-success" role="status"><span aria-hidden="true">✓</span> {notice}</div>}

        <form className="profile-form" onSubmit={saveProfile}>
          <div className="profile-form-heading">
            <h2>Personal information</h2>
            <p>Your name and email are shown with your CodeForge activity.</p>
          </div>
          <div className="profile-fields">
            <label htmlFor="profile-name">Full name
              <input id="profile-name" type="text" autoComplete="name" maxLength="50" value={form.name} disabled={!isEditing} onChange={event => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label htmlFor="profile-email">Email address
              <input id="profile-email" type="email" autoComplete="email" value={form.email} disabled={!isEditing} onChange={event => setForm({ ...form, email: event.target.value })} required />
            </label>
          </div>
          {isEditing && (
            <div className="profile-form-actions">
              <button className="btn btn-secondary" type="button" onClick={cancelEditing} disabled={isSaving}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</button>
            </div>
          )}
        </form>
      </section>

      <section className="profile-security-note">
        <span className="profile-security-icon" aria-hidden="true">◈</span>
        <div><strong>Your account is protected</strong><p>Your password is kept private and is never shown here.</p></div>
      </section>
    </main>
  );
}
