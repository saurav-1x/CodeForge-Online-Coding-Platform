import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await register(form.name, form.email, form.password); navigate("/dashboard"); }
    catch (err) {
      setError(
        err.response?.data?.message ||
        "Cannot reach the server. Please check the API deployment and try again."
      );
    }
  };

  return (
    <div className="auth-page"><div className="auth-card">
      <div className="brand auth-brand"><span className="brand-mark">&lt;/&gt;</span> CodeForge</div>
      <h1>Create your account</h1><p>Start your coding journey today.</p>
      <form onSubmit={submit} className="auth-form">
        {error && <div className="alert">{error}</div>}
        <label>Full name<input value={form.name} onChange={e => setForm({...form,name:e.target.value})} required /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></label>
        <button className="btn btn-primary full">Create Account</button>
        <p className="auth-footer">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div></div>
  );
}
