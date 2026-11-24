import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../services/api";

const sectionContent = {
  "/discuss": {
    eyebrow: "CODEFORGE COMMUNITY",
    title: "Learn together. Build better.",
    description: "A focused space to share solutions, ask thoughtful questions, and discover how other developers think.",
    icon: "◎",
    cards: [
      ["Popular this week", "How do you approach dynamic programming?", "124 replies · 18 min ago"],
      ["Interview prep", "Share your favourite system design resources", "86 replies · 1 hour ago"],
      ["JavaScript", "Clean ways to handle async errors", "52 replies · 3 hours ago"],
    ],
    action: "Start a discussion",
  },
  "/certifications": {
    eyebrow: "PROVE YOUR PROGRESS",
    title: "Skills worth showing off.",
    description: "Complete focused assessments, earn verified certificates, and make your learning visible.",
    icon: "✦",
    cards: [
      ["JavaScript Foundations", "12 lessons · 3 assessments", "Beginner"],
      ["Data Structures & Algorithms", "18 lessons · 5 assessments", "Intermediate"],
      ["Frontend Problem Solving", "10 lessons · 4 assessments", "Intermediate"],
    ],
    action: "Explore certificates",
  },
  "/leaderboard": {
    eyebrow: "COMMUNITY RANKINGS",
    title: "Your next level is closer.",
    description: "Keep solving, keep learning, and see how your consistency compares with the CodeForge community.",
    icon: "↗",
    cards: [
      ["01", "Aarav Sharma", "4,820 XP · 98 solved"],
      ["02", "Maya Patel", "4,560 XP · 91 solved"],
      ["03", "Rohan Mehta", "4,210 XP · 87 solved"],
    ],
    action: "Solve a problem",
  },
};

export default function SectionPlaceholder() {
  const { pathname } = useLocation();
  const content = sectionContent[pathname] || sectionContent["/discuss"];
  const [items, setItems] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [message, setMessage] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const request = pathname === "/discuss"
      ? Promise.resolve([API.get("/discussions")])
      : pathname === "/certifications"
        ? Promise.all([API.get("/certifications"), API.get("/certifications/mine")])
        : Promise.resolve([API.get("/leaderboard")]);
    request
      .then((responses) => {
        if (!active) return;
        const data = responses[0].data;
        if (pathname === "/discuss") setItems(data.discussions || []);
        if (pathname === "/certifications") {
          const enrolled = new Map((responses[1].data.enrollments || []).map((entry) => [String(entry.course.id), entry.enrollment]));
          setItems((data.courses || []).map((course) => ({
            ...course,
            enrolled: enrolled.has(String(course._id)),
            progress: enrolled.get(String(course._id))?.progress || 0,
          })));
        }
        if (pathname === "/leaderboard") {
          setItems(data.leaderboard || []);
          setUserStats(data.currentUser ? { ...data.currentUser, position: data.position } : null);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load this section.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [pathname]);

  const enroll = async (courseId) => {
    try {
      const { data } = await API.post(`/certifications/${courseId}/enroll`);
      setItems((current) => current.map((course) => course._id === courseId ? { ...course, enrolled: true, progress: data.enrollment?.progress || 0 } : course));
      setMessage("You are enrolled. Opening the recommended Udemy course...");
      if (data.udemyUrl) window.open(data.udemyUrl, "_blank", "noopener,noreferrer");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not enroll in this course.");
    }
  };

  const unenroll = async (courseId) => {
    try {
      await API.delete(`/certifications/${courseId}/enroll`);
      setItems((current) => current.map((course) => course._id === courseId ? { ...course, enrolled: false, progress: 0 } : course));
      setMessage("You have been unenrolled from this course.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Enroll in the course before completing it.");
    }
  };

  const submitReply = async (discussionId) => {
    const text = replyDrafts[discussionId]?.trim();
    if (!text) return;
    try {
      const { data } = await API.post(`/discussions/${discussionId}/reply`, { text });
      setItems((current) => current.map((item) => item._id === discussionId
        ? { ...item, messages: [...(item.messages || []), data.reply] }
        : item));
      setReplyDrafts((current) => ({ ...current, [discussionId]: "" }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not send your reply.");
    }
  };

  return (
    <main className={`section-page section-page-${pathname.slice(1)}`}>
      <section className="section-page-hero">
        <div className="section-page-copy">
          <span className="section-page-eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <div className="section-page-art" aria-hidden="true">
          <span>{content.icon}</span>
          <i /><i /><i />
        </div>
      </section>

      <section className="section-page-content">
        <div className="section-page-heading">
          <div>
            <span className="section-page-label">
              {pathname === "/leaderboard" ? "TOP PERFORMERS" : pathname === "/certifications" ? "LEARNING PATHS" : "RECENT CONVERSATIONS"}
            </span>
            <h2>{pathname === "/leaderboard" ? "This week’s standouts." : pathname === "/certifications" ? "Choose your next milestone." : "Find your people."}</h2>
          </div>
          <span className="section-page-note">Updated today</span>
        </div>
        <div className="section-page-cards">
          {(loading ? [] : items).map((item, index) => {
            const card = pathname === "/discuss"
              ? [item.category || "DISCUSSION", item.title || item.body, `${item.replies?.length || 0} replies · ${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}`]
              : pathname === "/certifications"
                ? [item.level || "COURSE", item.title, `${item.lessons?.length || 0} lessons · ${item.duration || "Self-paced"}`]
                : [`${String(index + 1).padStart(2, "0")}`, item.name, `${item.xp || 0} XP · ${item.solved || 0} solved`];
            return (
            <article className="section-info-card" key={item._id || card[0]}>
              <span className="section-info-icon">{pathname === "/leaderboard" ? card[0] : content.icon}</span>
              <div>
                <span className="section-info-kicker">{card[0]}</span>
                <h3>{card[1]}</h3>
                <p>{card[2]}</p>
                {pathname === "/discuss" && item.messages?.length > 0 && (
                  <div className="discussion-messages">
                    {item.messages.slice(-2).map((comment) => (
                      <span key={comment._id || `${comment.text}-${comment.createdAt}`}>
                        <strong>{comment.user?.name || "Community member"}:</strong> {comment.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="section-info-arrow" aria-hidden="true">→</span>
              {pathname === "/certifications" && (
                <button className="section-inline-action" type="button" onClick={() => item.enrolled ? unenroll(item._id) : enroll(item._id)}>
                  {item.enrolled ? "Unenroll" : "Join course"}
                </button>
              )}
              {pathname === "/discuss" && (
                <div className="discussion-reply">
                  <input
                    value={replyDrafts[item._id] || ""}
                    onChange={(event) => setReplyDrafts((current) => ({ ...current, [item._id]: event.target.value }))}
                    placeholder="Reply..."
                    aria-label={`Reply to ${item.title}`}
                  />
                  <button type="button" onClick={() => submitReply(item._id)}>Send</button>
                </div>
              )}
            </article>
            );
          })}
        </div>
        {loading && <div className="section-page-note">Loading your community data...</div>}
        {error && <div className="alert" role="alert">{error}</div>}
        {message && <div className="section-success" role="status">{message}</div>}
        {pathname === "/leaderboard" && userStats && (
          <div className="leaderboard-self">
            <strong>Your position: #{userStats.position}</strong>
            <span>{userStats.solved} solved · {userStats.xp} XP · {userStats.acceptanceRate}% acceptance</span>
          </div>
        )}
      </section>

      <section className="section-page-bottom">
        <div>
          <span className="section-page-label">KEEP MOVING FORWARD</span>
          <h2>Small steps make strong developers.</h2>
          <p>Spend a few focused minutes today and turn practice into momentum.</p>
        </div>
        <Link className="btn btn-primary" to={pathname === "/leaderboard" ? "/problems" : "/dashboard"}>
          {content.action} <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
