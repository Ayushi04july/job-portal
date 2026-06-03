const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Backend Developer",
    company: "Amazon",
    location: "Bangalore",
    type: "Hybrid",
  },
  {
    title: "Product Designer",
    company: "Spotify",
    location: "New York",
    type: "Remote",
  },
];

export default function JobsPage() {
  return (
    <div className="page-container jobs-page">
      <section className="jobs-hero">
        <div>
          <span className="hero-eyebrow">Job listings</span>
          <h1>Find roles that match your next career move.</h1>
          <p>
            Browse curated openings from leading companies, with clear role
            details and fast application-ready design.
          </p>
        </div>
      </section>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <article key={job.title} className="job-card">
            <div className="job-card-header">
              <div>
                <p className="job-role">{job.title}</p>
                <p className="job-company">{job.company}</p>
              </div>
              <span className="job-type">{job.type}</span>
            </div>
            <p className="job-location">{job.location}</p>
            <div className="job-actions">
              <button className="apply-button">Apply now</button>
              <button className="details-button">View details</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}