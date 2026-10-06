import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import API from "../services/api";

export default function Problem() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setProblem(null);
    setError("");
    setLoading(true);

    API.get(`/problems/${encodeURIComponent(slug)}`)
      .then(({ data }) => {
        if (!data.success || !data.problem) {
          throw new Error(data.message || "Problem not found.");
        }
        if (isCurrent) setProblem(data.problem);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Could not load this problem. Please try again."
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="problem-page">
        <div className="problem-not-found" role="status">
          Loading problem...
        </div>
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="problem-page">
        <div className="problem-not-found">
          <h1>Problem unavailable</h1>
          <p>{error || "The problem you are looking for does not exist."}</p>
          <Link to="/problems">← Back to Problems</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="problem-page">
      <div className="problem-left">
        <div className="problem-title">
          <h1>{problem.title}</h1>
          <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="tags">
          {(problem.tags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <section className="question-section">
          <h2>Problem Description</h2>
          <p style={{ whiteSpace: "pre-line" }}>{problem.description}</p>
        </section>

        <section className="question-section">
          <h2>Examples</h2>
          {(problem.examples || []).map((example, index) => (
            <div className="example-box" key={`${problem.slug}-${index}`}>
              <strong>Example {index + 1}</strong>
              <p>
                <b>Input:</b>
              </p>
              <pre>{example.input}</pre>
              <p>
                <b>Output:</b>
              </p>
              <pre>{example.output}</pre>
              {example.explanation && (
                <p>
                  <b>Explanation:</b> {example.explanation}
                </p>
              )}
            </div>
          ))}
        </section>
      </div>

      <div className="problem-right">
        <CodeEditor problem={problem} />
      </div>
    </main>
  );
}
