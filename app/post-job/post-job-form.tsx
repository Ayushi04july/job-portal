"use client";

import { FormEvent, useState } from "react";

export default function PostJobForm() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setStatusType(null);
    setIsSubmitting(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const response = await fetch("/api/post-job", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    let result: { error?: string } = {};
    try {
      result = await response.json();
    } catch {
      result = { error: "Server returned an invalid response." };
    }

    if (response.ok) {
      setStatusMessage("Job posted successfully.");
      setStatusType("success");
      formElement.reset();
    } else {
      setStatusMessage(result.error || "Failed to post job.");
      setStatusType("error");
    }

    setIsSubmitting(false);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title">Job title</label>
        <input id="title" name="title" type="text" placeholder="e.g. Frontend Developer" required />
      </div>

      <div className="form-field">
        <label htmlFor="company">Company name</label>
        <input id="company" name="company" type="text" placeholder="e.g. Acme Corp" required />
      </div>

      <div className="form-field">
        <label htmlFor="skills">Skills required</label>
        <input
          id="skills"
          name="skills"
          type="text"
          placeholder="e.g. React, TypeScript, Node.js"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="salaryRange">Salary range</label>
        <input id="salaryRange" name="salaryRange" type="text" placeholder="e.g. ₹40,000 - ₹60,000" required />
      </div>

      <div className="form-field">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" type="text" placeholder="e.g. Bangalore, Remote" required />
      </div>

      <div className="form-field">
        <label htmlFor="description">Job description</label>
        <textarea id="description" name="description" rows={5} placeholder="Add a short description of the role." />
      </div>

      {statusMessage ? (
        <p className={`status-message ${statusType === "success" ? "success" : "error"}`}>
          {statusMessage}
        </p>
      ) : null}

      <button type="submit" className="cta-button" disabled={isSubmitting}>
        {isSubmitting ? "Posting job..." : "Post job"}
      </button>
    </form>
  );
}
