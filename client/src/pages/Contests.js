import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const contests = [
  {
    title: "Weekly Sprint",
    type: "WEEKLY",
    date: "Sat, 30 Nov · 7:00 PM",
    duration: "90 minutes",
    participants: "2,480",
    difficulty: "Mixed difficulty",
    description: "A fast-paced set of algorithmic challenges to sharpen your problem-solving instincts.",
    accent: "pink",
    status: "UPCOMING",
  },
  {
    title: "Biweekly Battle",
    type: "BIWEEKLY",
    date: "Sun, 8 Dec · 6:00 PM",
    duration: "120 minutes",
    participants: "1,960",
    difficulty: "Intermediate",
    description: "Compete with the community, climb the leaderboard, and earn your next badge.",
    accent: "purple",
    status: "UPCOMING",
  },
  {
    title: "Frontend Focus",
    type: "SPECIAL",
    date: "Live now · Ends in 42 min",
    duration: "60 minutes",
    participants: "740",
    difficulty: "JavaScript & UI",
    description: "Build elegant interfaces and solve practical frontend tasks under pressure.",
    accent: "blue",
    status: "LIVE",
  },
  {
    title: "Autumn Algorithm Cup",
    type: "ARCHIVE",
    date: "Ended · 12 Nov",
    duration: "90 minutes",
    participants: "3,120",
    difficulty: "Advanced",
    description: "Revisit a community favourite and compare your solutions with the best performers.",
    accent: "orange",
    status: "PAST",
  },
];

const filters = ["All Contests", "Upcoming", "Live", "Past"];

export default function Contests() {
  const [contestData, setContestData] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [filter, setFilter] = useState("All Contests");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([API.get("/contests"), API.get("/contests/mine")])
      .then(([contestResponse, mineResponse]) => {
        if (!active) return;
        setContestData(contestResponse.data.contests || []);
        setJoinedIds((mineResponse.data.participations || []).map((item) => String(item.contest?._id || item.contest)));
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load contests.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const availableContests = contestData.length
    ? contestData.map((contest) => ({
      ...contest,
      status: contest.status === "Active" ? "LIVE" : contest.status === "Ended" ? "PAST" : "UPCOMING",
      participants: contest.participants?.length || 0,
      date: `${new Date(contest.startTime).toLocaleDateString()} · ${new Date(contest.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      duration: `${Math.max(1, Math.round((new Date(contest.endTime) - new Date(contest.startTime)) / 60000))} minutes`,
    }))
    : contests;

  const visibleContests = useMemo(() => availableContests.filter((contest) => {
    const matchesFilter = filter === "All Contests" || contest.status === filter.toUpperCase();
    const searchText = `${contest.title} ${contest.type} ${contest.description}`.toLowerCase();
    return matchesFilter && searchText.includes(query.toLowerCase());
  }), [availableContests, filter, query]);

  const joinContest = async (contest) => {
    setActionError("");
    try {
      await API.post(`/contests/${contest._id}/join`);
      setJoinedIds((ids) => [...new Set([...ids, String(contest._id)])]);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Could not join this contest.");
    }
  };

  return (
    <main className="contests-page">
      <section className="contest-hero">
        <div className="contest-hero-copy">
          <span className="contest-kicker">CODEFORGE CONTESTS</span>
          <h1>Compete.<br /><span>Code. Win.</span></h1>
          <p>Challenge yourself with algorithmic problems, compete with developers and climb the CodeForge rankings.</p>
        </div>
        <div className="contest-hero-stats" aria-label="Contest statistics">
            <div><strong>{contestData.length || 6}</strong><span>Contests</span></div>
            <div><strong>{contestData.reduce((sum, contest) => sum + (contest.participants?.length || 0), 0).toLocaleString() || "9,090"}</strong><span>Participants</span></div>
          <div><strong>4</strong><span>Contest types</span></div>
        </div>
      </section>

      <section className="contest-browser" aria-label="Browse contests">
        <label className="contest-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search contests..."
            aria-label="Search contests"
          />
        </label>
        <div className="contest-filters" role="tablist" aria-label="Contest filters">
          {filters.map((item) => (
            <button
              className={filter === item ? "is-active" : ""}
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              onClick={() => setFilter(item)}
            >
              {item} <span>{item === "All Contests" ? "6" : item === "Upcoming" ? "2" : item === "Live" ? "1" : "3"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="contest-list-section">
        <div className="contest-section-heading">
          <div><span className="contest-section-kicker">YOUR NEXT CHALLENGE</span><h2>Find your arena.</h2></div>
          <span className="contest-count">{loading ? "Loading..." : `${visibleContests.length} contests`}</span>
        </div>
        {error && <div className="alert" role="alert">{error}</div>}
        {actionError && <div className="alert" role="alert">{actionError}</div>}
        <div className="contest-grid">
          {visibleContests.map((contest) => (
            <ContestCard
              contest={contest}
              key={contest._id || contest.title}
              joined={joinedIds.includes(String(contest._id))}
              onJoin={joinContest}
            />
          ))}
        </div>
        {!visibleContests.length && <div className="contest-empty">No contests match your search. Try another filter.</div>}
      </section>

      <section className="contest-cta">
        <div><span className="contest-section-kicker">READY WHEN YOU ARE</span><h2>Every contest is a chance to level up.</h2><p>Practice a few problems before the next round starts.</p></div>
        <Link className="btn btn-primary" to="/problems">Explore problems <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}

function ContestCard({ contest, joined, onJoin }) {
  const canJoin = contest.status === "LIVE";
  return (
    <article className={`contest-card contest-card-${contest.accent}`}>
      <div className="contest-card-top"><span className="contest-type">{contest.type}</span><span className={`contest-status contest-status-${contest.status.toLowerCase()}`}>{contest.status}</span></div>
      <h3>{contest.title}</h3>
      <p>{contest.description}</p>
      <div className="contest-meta"><span>◷ {contest.date}</span><span>◌ {contest.duration}</span><span>♙ {contest.participants} joined</span></div>
      <button
        className="contest-card-action"
        type="button"
        disabled={joined || !canJoin || !contest._id}
        onClick={() => canJoin && onJoin(contest)}
      >
        {joined ? "Joined ✓" : contest.status === "LIVE" ? "Join contest" : contest.status === "PAST" ? "View results" : "Starts soon"} <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
