import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuth } from "../lib/auth";
import clientPromise from "../lib/mongodb";

export default async function JobsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const user = token ? await verifyAuth(token) : null;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "candidate") {
    return (
      <div className="page-container jobs-page">
        <section className="jobs-hero">
          <div>
            <span className="hero-eyebrow">Access restricted</span>
            <h1>Candidate access required</h1>
            <p>
              You are currently logged in as a recruiter. To explore jobs, please
              log in with a candidate account.
            </p>
            <div className="hero-actions">
              <a href="/login" className="cta-button">
                Login as Candidate
              </a>
              <a href="/post-job" className="secondary-button">
                Back to Recruiter Dashboard
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB ?? "job-portal");
  const jobsCollection = db.collection("jobDetails");
  const jobsData = await jobsCollection
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .toArray();

  const jobs = jobsData.map((job) => ({
    id: job._id.toString(),
    title: job.title,
    company: job.company,
    location: job.location,
    salaryRange: job.salaryRange || "Not specified",
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "",
  }));

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
        {jobs.length === 0 ? (
          <article className="job-card">
            <p>No job listings are available yet. Check back after recruiters post new roles.</p>
          </article>
        ) : (
          jobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="job-card-header">
                <div>
                  <p className="job-role">{job.title}</p>
                  <p className="job-company">{job.company}</p>
                </div>
                <span className="job-type">{job.salaryRange}</span>
              </div>
              <p className="job-location">{job.location}</p>
              {job.description ? <p className="job-description">{job.description}</p> : null}
              {job.skills.length > 0 ? (
                <div className="job-skills">
                  {job.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="job-actions">
                <button className="apply-button">Apply now</button>
                <button className="details-button">View details</button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}