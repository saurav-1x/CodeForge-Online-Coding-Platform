import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const avatarText = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="CodeForge home">
        <span className="brand-mark">&lt;/&gt;</span>
        <span>CodeForge</span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {user ? (
          <>
            <Link to="/problems">Problems</Link>
            <Link to="/submissions">Submissions</Link>
            <div className="profile-menu" ref={menuRef}>
              <button
                className="profile-trigger"
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label="Open profile menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="profile-avatar">{avatarText}</span>
                <span className="profile-trigger-name">{user.name}</span>
                <span className={`profile-chevron${menuOpen ? " is-open" : ""}`} aria-hidden="true">⌄</span>
              </button>
              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-user">
                    <span className="profile-avatar profile-avatar-large">{avatarText}</span>
                    <span><strong>{user.name}</strong><small>{user.email}</small></span>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <Link className="profile-dropdown-link" to="/dashboard"><span aria-hidden="true">▦</span> Dashboard</Link>
                  <Link className="profile-dropdown-link" to="/profile"><span aria-hidden="true">⚙</span> Profile settings</Link>
                  <button className="profile-dropdown-link profile-logout" type="button" onClick={handleLogout}>
                    <span aria-hidden="true">↪</span> Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="btn btn-primary small" to="/register">Get Started</Link>
          </>
        )}
      </nav>
    </header>
  );
}
