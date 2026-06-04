"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Spotify",
];

const highlights = [
  {
    title: "120+",
    label: "New jobs posted weekly",
  },
  {
    title: "90%",
    label: "Faster candidate matches",
  },
  {
    title: "24/7",
    label: "Support for employers and job seekers",
  },
];

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth");
        setAuthenticated(response.ok);
      } catch {
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <div className="page-container">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-eyebrow">Job search made modern</span>
          <h1>Find your next role with confidence and style.</h1>
          <p>
            Browse curated listings from leading companies, track applications, and
            land the job that fits your lifestyle.
          </p>
          <div className="hero-actions">
            {authenticated ? (
              <>
                <Link href="/jobs" className="cta-button">
                  Explore Jobs
                </Link>
                <Link href="/post-job" className="secondary-button">
                  Post a job
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="cta-button">
                  Login to Explore Jobs
                </Link>
                <Link href="/register" className="secondary-button">
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-highlights">
          {highlights.map((item) => (
            <div key={item.title} className="highlight-card">
              <strong>{item.title}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="company-marquee">
        <h2>Trusted by top companies</h2>
        <div className="company-list">
          {companies.map((company, index) => (
            <span
              key={company}
              style={{ animationDelay: `${index * 0.18}s` }}
              className="company-chip"
            >
              {company}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
