import React, { useState } from "react";
import { Link } from "react-router-dom";

const problems = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],
  },
  {
    id: 2,
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
  },
  {
    id: 3,
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "String"],
  },
  {
    id: 4,
    slug: "binary-tree-traversal",
    title: "Binary Tree Traversal",
    difficulty: "Hard",
    tags: ["Tree", "DFS"],
  },
];

export default function Problems() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
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
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="problem-table">
        <div className="problem-table-header">
          <div>Problem</div>
          <div>Difficulty</div>
          <div>Topics</div>
          <div>Action</div>
        </div>

        {filteredProblems.map((problem) => (
          <div className="problem-row" key={problem.id}>
            <div>
              <h3>{problem.id}. {problem.title}</h3>
            </div>

            <div>
              <span
                className={`difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>
            </div>

            <div className="tags">
              {problem.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div>
              <Link to={`/problem/${problem.slug}`}>
                <button>Solve</button>
              </Link>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div style={{ padding: "30px", textAlign: "center" }}>
            No problems found.
          </div>
        )}
      </div>
    </main>
  );
}