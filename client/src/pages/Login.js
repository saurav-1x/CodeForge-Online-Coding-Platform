import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page login-page">
      <section className="login-showcase" aria-label="CodeForge coding practice">
        <div className="showcase-kicker"><span className="badge-dot" /> YOUR NEXT SOLUTION STARTS HERE</div>
        <h1>Make your next<br /><span>idea executable.</span></h1>
        <p className="showcase-copy">
          Get back to the problems, sharpen your skills, and keep your momentum going.
        </p>
        <div className="showcase-editor">
          <div className="showcase-editor-bar">
            <div className="window-dots"><span /><span /><span /></div>
            <span>two-sum.js</span>
            <span className="editor-language">JavaScript</span>
          </div>
          <pre aria-label="Example code"><code><span className="code-muted">01</span>  <span className="code-purple">function</span> <span className="code-blue">twoSum</span>(nums, target) {"{"}{"\n"}<span className="code-muted">02</span>    <span className="code-purple">const</span> seen = <span className="code-purple">new</span> Map();{"\n"}<span className="code-muted">03</span>    <span className="code-purple">for</span> (<span className="code-purple">let</span> i = <span className="code-orange">0</span>; i &lt; nums.length; i++) {"{"}{"\n"}<span className="code-muted">04</span>      <span className="code-purple">const</span> need = target - nums[i];{"\n"}<span className="code-muted">05</span>      <span className="code-purple">if</span> (seen.has(need)) <span className="code-purple">return</span> [seen.get(need), i];{"\n"}<span className="code-muted">06</span>      seen.set(nums[i], i);{"\n"}<span className="code-muted">07</span>    {"}"}{"\n"}<span className="code-muted">08</span>  {"}"}</code></pre>
          <div className="showcase-result"><span>✓</span><div><strong>Ready when you are</strong><small>Pick up where you left off</small></div></div>
        </div>
        <div className="showcase-footnote"><span>⌘</span> Practice at your pace <i /> Track every improvement</div>
      </section>

      <section className="login-form-panel">
        <div className="auth-card">
          <Link className="brand auth-brand" to="/" aria-label="CodeForge home">
            <span className="brand-mark">&lt;/&gt;</span><span>CodeForge</span>
          </Link>
          <div className="login-heading">
            <span className="login-overline">WELCOME BACK</span>
            <h2>Sign in to CodeForge</h2>
            <p>Your next breakthrough is one session away.</p>
          </div>
          <form onSubmit={submit} className="auth-form">
            {error && <div className="alert" role="alert">{error}</div>}
            <label htmlFor="login-email">Email address
              <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label htmlFor="login-password">Password
              <span className="password-field">
                <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <button className="btn btn-primary full login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
            <p className="auth-footer">New to CodeForge? <Link to="/register">Create an account <span aria-hidden="true">→</span></Link></p>
          </form>
          <div className="login-secure-note"><span aria-hidden="true">◈</span> Your progress is saved securely to your account.</div>
        </div>
      </section>
    </main>
  );
}
