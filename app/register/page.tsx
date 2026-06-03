"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      setStatusType("success");
      setStatus("Your account was created successfully.");
      event.currentTarget.reset();
    } else {
      setStatusType("error");
      setStatus(result?.error || "Unable to register. Please try again.");
    }

    setSubmitting(false);
  }

  return (
    <div className="page-container">
      <section className="register-panel">
        <div className="register-header">
          <p className="register-eyebrow">Start your journey</p>
          <h1>Create your account</h1>
          <p className="register-copy">
            Register as a candidate or recruiter to access curated job listings,
            application tracking, and hiring tools.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </label>

          <fieldset className="form-field form-radio-group">
            <legend>Register as</legend>
            <div className="radio-options">
              <label>
                <input type="radio" name="role" value="candidate" defaultChecked />
                Candidate
              </label>
              <label>
                <input type="radio" name="role" value="recruiter" />
                Recruiter
              </label>
            </div>
          </fieldset>

          <label className="form-field">
            <span>Email id</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>

          {status ? (
            <p className={`status-message ${statusType}`}>{status}</p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
