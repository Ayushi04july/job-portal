"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setStatusType("success");
        setStatus("Logged in successfully. Redirecting...");
        const destination = result?.role === "recruiter" ? "/post-job" : "/jobs";
        setTimeout(() => router.push(destination), 1500);
      } else {
        setStatusType("error");
        setStatus(result?.error || "Unable to login. Please try again.");
      }
    } catch (error) {
      setStatusType("error");
      setStatus(
        error instanceof Error
          ? `Login failed: ${error.message}`
          : "Login failed due to a network error."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <section className="register-panel">
        <div className="register-header">
          <p className="register-eyebrow">Welcome back</p>
          <h1>Login to your account</h1>
          <p className="register-copy">
            Enter your email and password to continue to the job portal.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          {status ? (
            <p className={`status-message ${statusType}`}>{status}</p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
