import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Submissions() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    API.get("/submissions/mine")
      .then(({ data }) => {
        if (isCurrent) setItems(data.submissions);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.response?.data?.message || "Could not load your submission history.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const acceptedCount = items.filter(item => item.status === "Accepted").length;
  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter(item => {
      const matchesStatus = filter === "All" || item.status === filter;
      const matchesSearch = !search
        || item.problem?.title?.toLowerCase().includes(search)
        || item.language?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [filter, items, query]);

  return (
    <main className="page-shell history-page">
      <section className="history-hero">
        <div>
          <span className="eyebrow"><span className="dashboard-eyebrow-dot" /> YOUR JOURNEY</span>
          <h1>Submission history</h1>
          <p>Every attempt is a step forward. Review your solutions and see how far you have come.</p>
        </div>
        <Link className="btn btn-primary" to="/problems">Solve a problem <span aria-hidden="true">→</span></Link>
      </section>

      <section className="history-summary" aria-label="Submission summary">
        <HistoryStat label="All attempts" value={loading ? "—" : items.length} icon="⌘" tone="purple" />
        <HistoryStat label="Accepted" value={loading ? "—" : acceptedCount} icon="✓" tone="green" />
        <HistoryStat label="Keep going" value={loading || !items.length ? "—" : `${Math.round(acceptedCount / items.length * 100)}%`} icon="↗" tone="blue" />
      </section>

      <section className="history-card">
        <div className="history-toolbar">
          <div><span className="panel-kicker">ACTIVITY</span><h2>All submissions <span>{loading ? "" : items.length}</span></h2></div>
          <div className="history-controls">
            <label className="history-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search problem or language" aria-label="Search submissions" />
            </label>
            <label className="history-status-filter">
              <span className="visually-hidden">Filter by submission result</span>
              <select value={filter} onChange={event => setFilter(event.target.value)}>
                <option>All</option>
                <option>Accepted</option>
                <option>Wrong Answer</option>
                <option>Pending</option>
              </select>
            </label>
          </div>
        </div>

        {error && <div className="alert history-alert" role="alert">{error}</div>}

        <div className="history-table-wrap">
          <div className="history-table-head" aria-hidden="true">
            <span>Problem</span><span>Language</span><span>Result</span><span>Tests passed</span><span>Submitted</span>
          </div>
          {loading ? (
            <div className="history-empty" role="status"><span className="history-empty-icon">⌛</span><strong>Loading submissions...</strong><p>Your coding activity will be here in a moment.</p></div>
          ) : filteredItems.length ? (
            <div className="history-rows">
              {filteredItems.map(item => <SubmissionItem key={item._id} submission={item} />)}
            </div>
          ) : (
            <div className="history-empty">
              <span className="history-empty-icon" aria-hidden="true">{items.length ? "⌕" : "⌘"}</span>
              <strong>{items.length ? "No matching submissions" : "Your story starts with the first submission."}</strong>
              <p>{items.length ? "Try another search or change the result filter." : "Choose a coding challenge and submit your solution to build your history."}</p>
              {!items.length && <Link to="/problems">Explore problems <span aria-hidden="true">→</span></Link>}
            </div>
          )}
        </div>
        <div className="history-footer">
          <span>Showing {loading ? "…" : filteredItems.length} of {loading ? "…" : items.length} submissions</span>
          <Link to="/dashboard">Back to dashboard <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}

function HistoryStat({ label, value, icon, tone }) {
  return (
    <article className="history-stat">
      <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">{icon}</span>
      <span><small>{label}</small><strong>{value}</strong></span>
    </article>
  );
}

function SubmissionItem({ submission }) {
  const isAccepted = submission.status === "Accepted";
  const date = new Date(submission.createdAt);
  const dateLabel = Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <article className="history-row">
      <div className="history-problem-cell">
        <span className={`submission-result-icon${isAccepted ? " is-accepted" : " is-failed"}`} aria-hidden="true">{isAccepted ? "✓" : "!"}</span>
        <span>
          {submission.problem?.slug ? <Link to={`/problem/${submission.problem.slug}`}>{submission.problem.title}</Link> : <strong>{submission.problem?.title || "Unknown problem"}</strong>}
          <small>{submission.problem?.difficulty || "Coding challenge"}</small>
        </span>
      </div>
      <span className="history-language"><span className="language-dot" />{submission.language || "Unknown"}</span>
      <span><span className={`submission-status-pill${isAccepted ? " is-accepted" : " is-failed"}`}>{submission.status}</span></span>
      <span className="history-tests">{submission.passedTests ?? 0}<small> / {submission.totalTests ?? 0} tests</small></span>
      <time className="history-date" dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}>{dateLabel}</time>
    </article>
  );
}
