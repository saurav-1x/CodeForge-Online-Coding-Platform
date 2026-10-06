import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge"><span className="badge-dot" /> THE PRACTICE GROUND FOR BUILDERS</div>
          <h1>Think it.<br /><span>Code it. Nail it.</span></h1>
          <p className="hero-description">
            Turn problem-solving into a superpower. Practice coding challenges, get instant feedback, and see your skills grow one solution at a time.
          </p>
          <div className="hero-buttons">
            <Link className="btn btn-primary large hero-button" to={user ? "/problems" : "/register"}>
              {user ? "Explore problems" : "Start coding"} <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-secondary large hero-button" to={user ? "/dashboard" : "/login"}>
              {user ? "View dashboard" : "I have an account"}
            </Link>
          </div>
          {user && <p className="home-welcome">Welcome back, {user.name?.split(" ")[0] || "coder"} — ready for another challenge?</p>}
          <div className="hero-stats">
            <div className="hero-stat"><strong>∞</strong><span>Ways to grow</span></div>
            <div className="hero-stat"><strong>4+</strong><span>Languages</span></div>
            <div className="hero-stat"><strong>24/7</strong><span>Your practice space</span></div>
          </div>
        </div>
        <div className="hero-code-wrapper" aria-label="CodeForge editor preview">
          <div className="code-window">
            <div className="code-window-header">
              <div className="window-dots"><span /><span /><span /></div>
              <div className="window-title">two-sum.js</div>
              <div />
            </div>
            <div className="code-body">
              <div className="code-line"><span className="line-number">1</span><span><span className="purple">function</span> <span className="blue">twoSum</span>(nums, target) {"{"}</span></div>
              <div className="code-line"><span className="line-number">2</span><span>  <span className="purple">const</span> seen = <span className="purple">new</span> Map();</span></div>
              <div className="code-line"><span className="line-number">3</span><span>  <span className="purple">for</span> (<span className="purple">let</span> i = <span className="orange">0</span>; i &lt; nums.length; i++) {"{"}</span></div>
              <div className="code-line"><span className="line-number">4</span><span>    <span className="purple">const</span> need = target - nums[i];</span></div>
              <div className="code-line"><span className="line-number">5</span><span>    <span className="purple">if</span> (seen.has(need)) <span className="purple">return</span> [seen.get(need), i];</span></div>
              <div className="code-line"><span className="line-number">6</span><span>    seen.set(nums[i], i);</span></div>
              <div className="code-line"><span className="line-number">7</span><span>  {"}"}</span></div>
              <div className="code-line"><span className="line-number">8</span><span>{"}"}</span></div>
            </div>
            <div className="code-window-footer">
              <span className="online-status"><span /> Ready to run</span>
              <span>JavaScript</span>
            </div>
          </div>
          <div className="accepted-card">
            <div className="accepted-icon">✓</div>
            <div><strong>Problem solved</strong><span>Keep your streak going</span></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span>BUILT FOR YOUR NEXT LEVEL</span>
          <h2>Practice that moves you forward.</h2>
          <p>Everything you need to turn a little practice into real progress.</p>
        </div>
        <div className="features-grid">
          <Feature icon="{}" color="purple-icon" title="Real challenges" text="Tackle carefully curated problems, from first steps to brain-bending algorithms." />
          <Feature icon="▶" color="blue-icon" title="Instant feedback" text="Run and submit your code to see how it performs against real test cases." />
          <Feature icon="↗" color="green-icon" title="Visible progress" text="Keep track of your submissions and celebrate every accepted solution." />
          <Feature icon="⌘" color="orange-icon" title="Your workflow" text="Solve problems in a focused coding workspace with multiple languages." />
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="cta-label">YOUR NEXT CHALLENGE IS WAITING</span>
          <h2>{user ? "Keep your momentum going." : "Ready to write your first solution?"}</h2>
          <p>{user ? "Pick a problem and put those skills to work." : "Create an account and make today a practice day."}</p>
        </div>
        <Link className="btn btn-primary cta-button" to={user ? "/problems" : "/register"}>
          {user ? "Browse problems" : "Get started"} <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="landing-footer">
        <Link className="brand" to="/"><span className="brand-mark">&lt;/&gt;</span><span>CodeForge</span></Link>
        <span>Build skills one problem at a time.</span>
      </footer>
    </main>
  );
}

function Feature({ icon, color, title, text }) {
  return (
    <article className="feature-card">
      <div className={`feature-icon ${color}`}>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
