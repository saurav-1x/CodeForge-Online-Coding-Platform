import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    API.get("/problems")
      .then(({ data }) => {
        if (!data.success) {
          throw new Error(data.message || "Could not load problems.");
        }
        if (isCurrent) setProblems(data.problems || []);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Could not load problems. Please try again."
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      problem.title.toLowerCase().includes(query) ||
      (problem.tags || []).some((tag) => tag.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (difficulty === "All" || problem.difficulty === difficulty)
    );
  });

  return (
    <main className="problems-page">
      <div className="problems-header">
        <h1>Coding Problems</h1>
        <p>
          Practice coding problems and improve your problem-solving skills.
        </p>
      </div>

      <div className="problem-filters">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <div className="problem-table">
        <div className="problem-table-header">
          <div>Problem</div>
          <div>Difficulty</div>
          <div>Topics</div>
          <div>Action</div>
        </div>

        {loading ? (
          <div className="problem-row" role="status">
            <div>Loading problems...</div>
          </div>
        ) : (
          filteredProblems.map((problem, index) => (
            <div className="problem-row" key={problem._id || problem.slug}>
              <div>
                <h3>
                  {index + 1}. {problem.title}
                </h3>
              </div>

              <div>
                <span
                  className={`difficulty ${problem.difficulty.toLowerCase()}`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="tags">
                {(problem.tags || []).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div>
                <Link to={`/problem/${problem.slug}`}>
                  <button type="button">Solve</button>
                </Link>
              </div>
            </div>
          ))
        )}

        {!loading && !error && filteredProblems.length === 0 && (
          <div style={{ padding: "30px", textAlign: "center" }}>
            No problems found.
          </div>
        )}
      </div>
    </main>
  );
}
