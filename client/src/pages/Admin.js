import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyProblem = {
  title: "",
  slug: "",
  difficulty: "Easy",
  tags: "",
  description: "",
  starterCode: { javascript: "", python: "" },
  examples: [{ input: "", output: "", explanation: "" }],
  testCases: [{ input: "", output: "", hidden: false }]
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("questions");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyProblem);

  const load = async (section = tab) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = section === "questions" ? "/admin/problems" : "/admin/users";
      const { data } = await API.get(endpoint);
      setItems(data.items || data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const openCreate = () => {
    setForm({
      ...emptyProblem,
      starterCode: { javascript: "", python: "" },
      examples: [{ input: "", output: "", explanation: "" }],
      testCases: [{ input: "", output: "", hidden: false }]
    });
    setNotice("");
    setError("");
    setModal("create");
  };

  const openEdit = (item) => {
    setForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      starterCode: item.starterCode || { javascript: "", python: "" },
      examples: item.examples?.length ? item.examples : emptyProblem.examples,
      testCases: item.testCases?.length ? item.testCases : emptyProblem.testCases
    });
    setNotice("");
    setError("");
    setModal("edit");
  };

  const saveQuestion = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === "string"
          ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : form.tags
      };

      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      if (modal === "edit") {
        await API.put(`/admin/problems/${form._id}`, payload);
      } else {
        await API.post("/admin/problems", payload);
      }

      setModal(null);
      setNotice(modal === "edit" ? "Question updated." : "Question added.");
      await load("questions");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the question.");
    }
  };

  const deleteQuestion = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await API.delete(`/admin/problems/${item._id}`);
      setNotice("Question deleted.");
      await load("questions");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the question.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setArrayField = (field, index, key, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry
      )
    }));
  };

  const filteredItems = items.filter((item) => {
    if (tab === "users") {
      return `${item.name || ""} ${item.email || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    }
    return `${item.title || ""} ${item.slug || ""} ${item.difficulty || ""} ${(item.tags || []).join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <main className="admin-page admin-minimal">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">&lt;/&gt;</span>
          <div><strong>CodeForge</strong><small>Admin</small></div>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          <button
            type="button"
            className={tab === "questions" ? "active" : ""}
            onClick={() => { setTab("questions"); setSearch(""); }}
          >
            <span>⌘</span> Questions
          </button>
          <button
            type="button"
            className={tab === "users" ? "active" : ""}
            onClick={() => { setTab("users"); setSearch(""); }}
          >
            <span>♙</span> Users
          </button>
        </nav>

        <div className="admin-account">
          <span className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase()}</span>
          <div><strong>{user?.name}</strong><small>Administrator</small></div>
          <button type="button" onClick={handleLogout} aria-label="Log out">↪</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">ADMIN</span>
            <h1>{tab === "questions" ? "Questions" : "Users"}</h1>
          </div>
          <div className="admin-header-actions">
            {tab === "questions" && (
              <button className="admin-primary" type="button" onClick={openCreate}>＋ Add question</button>
            )}
            <button className="admin-logout" type="button" onClick={handleLogout}>Log out</button>
          </div>
        </header>

        {notice && (
          <div className="admin-notice" role="status">
            <span>✓</span>{notice}
            <button type="button" onClick={() => setNotice("")}>×</button>
          </div>
        )}
        {error && (
          <div className="admin-error" role="alert">
            {error}
            <button type="button" onClick={() => setError("")}>×</button>
          </div>
        )}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <section className="admin-table-card">
            <div className="admin-table-toolbar">
              <div>
                <strong>{filteredItems.length} {tab}</strong>
                <small>{tab === "questions" ? "Manage coding questions" : "View user progress"}</small>
              </div>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${tab}...`}
              />
            </div>

            {tab === "questions" ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Difficulty</th>
                      <th>Tags</th>
                      <th>Test cases</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td><span className="table-title"><strong>{item.title}</strong><small>{item.slug}</small></span></td>
                        <td><span className={`difficulty ${String(item.difficulty).toLowerCase()}`}>{item.difficulty}</span></td>
                        <td>{(item.tags || []).join(", ") || "-"}</td>
                        <td>{item.testCases?.length || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" onClick={() => openEdit(item)}>Edit</button>
                            <button type="button" className="delete" onClick={() => deleteQuestion(item)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredItems.length === 0 && <div className="admin-empty">No questions found.</div>}
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Problems solved</th>
                      <th>Problems attempted</th>
                      <th>Streak</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <span className="table-user">
                            <b>{item.name?.charAt(0)?.toUpperCase()}</b>
                            <span><strong>{item.name}</strong><small>{item.email}</small></span>
                          </span>
                        </td>
                        <td><strong className="admin-solved-count">{item.solvedProblems?.length || 0}</strong></td>
                        <td>{item.attemptedProblems?.length || 0}</td>
                        <td>{item.streak || 0} days</td>
                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredItems.length === 0 && <div className="admin-empty">No users found.</div>}
              </div>
            )}
          </section>
        )}
      </section>

      {modal && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}
        >
          <form className="admin-modal" onSubmit={saveQuestion}>
            <header>
              <div>
                <span>{modal === "edit" ? "EDIT QUESTION" : "NEW QUESTION"}</span>
                <h2>{modal === "edit" ? "Update question" : "Add question"}</h2>
              </div>
              <button type="button" onClick={() => setModal(null)}>×</button>
            </header>

            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <label>Title
                  <input value={form.title || ""} onChange={(e) => setField("title", e.target.value)} required />
                </label>
                <label>Slug
                  <input value={form.slug || ""} onChange={(e) => setField("slug", e.target.value)} required />
                </label>
                <label>Difficulty
                  <select value={form.difficulty || "Easy"} onChange={(e) => setField("difficulty", e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>
                <label>Tags
                  <input value={form.tags || ""} onChange={(e) => setField("tags", e.target.value)} placeholder="Array, Hash Map" />
                </label>
                <label className="admin-full">Description
                  <textarea rows="5" value={form.description || ""} onChange={(e) => setField("description", e.target.value)} required />
                </label>
                <label>JavaScript starter code
                  <textarea
                    rows="6"
                    value={form.starterCode?.javascript || ""}
                    onChange={(e) => setField("starterCode", { ...form.starterCode, javascript: e.target.value })}
                  />
                </label>
                <label>Python starter code
                  <textarea
                    rows="6"
                    value={form.starterCode?.python || ""}
                    onChange={(e) => setField("starterCode", { ...form.starterCode, python: e.target.value })}
                  />
                </label>

                <fieldset className="admin-full">
                  <legend>Examples</legend>
                  {(form.examples || []).map((entry, index) => (
                    <div className="admin-repeat-row" key={index}>
                      <input placeholder="Input" value={entry.input || ""} onChange={(e) => setArrayField("examples", index, "input", e.target.value)} />
                      <input placeholder="Output" value={entry.output || ""} onChange={(e) => setArrayField("examples", index, "output", e.target.value)} />
                      <input placeholder="Explanation" value={entry.explanation || ""} onChange={(e) => setArrayField("examples", index, "explanation", e.target.value)} />
                    </div>
                  ))}
                </fieldset>

                <fieldset className="admin-full">
                  <legend>Test cases</legend>
                  {(form.testCases || []).map((entry, index) => (
                    <div className="admin-repeat-row" key={index}>
                      <input placeholder="Input" value={entry.input || ""} onChange={(e) => setArrayField("testCases", index, "input", e.target.value)} />
                      <input placeholder="Expected output" value={entry.output || ""} onChange={(e) => setArrayField("testCases", index, "output", e.target.value)} />
                      <label className="admin-check">
                        <input
                          type="checkbox"
                          checked={!!entry.hidden}
                          onChange={(e) => setArrayField("testCases", index, "hidden", e.target.checked)}
                        />
                        Hidden
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            </div>

            <footer>
              <button type="button" className="admin-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="admin-primary">
                {modal === "edit" ? "Save changes" : "Add question"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
