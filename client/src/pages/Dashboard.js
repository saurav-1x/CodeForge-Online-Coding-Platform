import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    API.get("/submissions/mine")
      .then(({ data }) => {
        if (isCurrent) setSubmissions(data.submissions);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.response?.data?.message || "Could not load your progress. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const acceptedSubmissions = submissions.filter(submission => submission.status === "Accepted");
  const solved = new Set(acceptedSubmissions.map(submission => submission.problem?._id).filter(Boolean)).size;
  const attempted = new Set(submissions.map(submission => submission.problem?._id).filter(Boolean)).size;
  const acceptanceRate = submissions.length ? Math.round(acceptedSubmissions.length / submissions.length * 100) : 0;
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "coder";

  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-hero">
        <div>
          <div className="eyebrow"><span className="dashboard-eyebrow-dot" /> YOUR DASHBOARD</div>
          <h1>Welcome back, {firstName} <span aria-hidden="true">✦</span></h1>
          <p>Every problem you solve is progress. Ready to keep going?</p>
        </div>
        <Link className="btn btn-primary dashboard-hero-action" to="/problems">Find your next challenge <span aria-hidden="true">→</span></Link>
      </section>

      {error && <div className="alert dashboard-alert" role="alert">{error}</div>}

      <section className="stats-grid dashboard-stats" aria-label="Your coding statistics">
        <Stat label="Problems solved" value={loading ? "—" : solved} icon="✓" tone="green" detail="Accepted challenges" />
        <Stat label="Problems tried" value={loading ? "—" : attempted} icon="⌁" tone="blue" detail="Unique challenges" />
        <Stat label="Total submissions" value={loading ? "—" : submissions.length} icon="⌘" tone="purple" detail="All your attempts" />
        <Stat label="Current streak" value={`${user?.streak || 0} days`} icon="✦" tone="orange" detail="Keep the momentum" />
      </section>

      <div className="dashboard-content-grid">
        <section className="dashboard-panel recent-panel">
          <div className="panel-head">
            <div><span className="panel-kicker">YOUR LATEST WORK</span><h2>Recent submissions</h2></div>
            <Link to="/submissions" className="panel-view-all">View history <span aria-hidden="true">→</span></Link>
          </div>

          {loading ? (
            <div className="dashboard-loading" role="status">Loading your activity...</div>
          ) : submissions.length ? (
            <div className="recent-submission-list">
              {submissions.slice(0, 5).map(submission => (
                <SubmissionRow key={submission._id} submission={submission} />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <span className="dashboard-empty-icon" aria-hidden="true">⌘</span>
              <strong>Your first solution is waiting.</strong>
              <p>Choose a challenge and your submission history will show up here.</p>
              <Link to="/problems">Browse problems <span aria-hidden="true">→</span></Link>
            </div>
          )}
        </section>

        <aside className="dashboard-side-column">
          <section className="dashboard-panel progress-panel">
            <div className="panel-kicker">YOUR MOMENTUM</div>
            <h2>Small steps add up.</h2>
            <p>Accepted submissions are a great sign of your progress. Keep practicing to build your streak.</p>
            <div className="progress-meter-heading"><span>Acceptance rate</span><strong>{loading ? "—" : `${acceptanceRate}%`}</strong></div>
            <div className="progress-track" role="progressbar" aria-label="Acceptance rate" aria-valuemin="0" aria-valuemax="100" aria-valuenow={loading ? 0 : acceptanceRate}>
              <span style={{ width: `${loading ? 0 : acceptanceRate}%` }} />
            </div>
            <div className="progress-footnote">{loading ? "Loading submissions..." : `${acceptedSubmissions.length} accepted of ${submissions.length} total submissions`}</div>
          </section>
          <section className="dashboard-challenge-card">
            <span className="challenge-sparkle" aria-hidden="true">✦</span>
            <span className="panel-kicker">DAILY PRACTICE</span>
            <h2>One challenge can change your day.</h2>
            <p>Pick a problem, give it a go, and keep your problem-solving skills sharp.</p>
            <Link to="/problems">Choose a problem <span aria-hidden="true">→</span></Link>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Stat({ label, value, icon, tone, detail }) {
  return (
    <article className="stat-card dashboard-stat-card">
      <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">{icon}</span>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </article>
  );
}

function SubmissionRow({ submission }) {
  const accepted = submission.status === "Accepted";
  const problemName = submission.problem?.title || "Problem";
  const submittedAt = new Date(submission.createdAt);
  const dateLabel = Number.isNaN(submittedAt.getTime())
    ? "Date unavailable"
    : submittedAt.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="recent-submission-row">
      <span className={`submission-result-icon${accepted ? " is-accepted" : " is-failed"}`} aria-hidden="true">{accepted ? "✓" : "!"}</span>
      <div className="recent-submission-main">
        {submission.problem?.slug ? <Link to={`/problem/${submission.problem.slug}`}>{problemName}</Link> : <strong>{problemName}</strong>}
        <span>{submission.language || "Unknown language"} <i /> {dateLabel}</span>
      </div>
      <span className={`submission-status-pill${accepted ? " is-accepted" : " is-failed"}`}>{submission.status}</span>
    </div>
  );
}
