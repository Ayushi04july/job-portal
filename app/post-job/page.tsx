import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuth } from "../lib/auth";
import PostJobForm from "./post-job-form";

export default async function PostJobPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const user = token ? await verifyAuth(token) : null;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "recruiter") {
    redirect("/jobs");
  }

  return (
    <div className="page-container">
      <section className="register-panel">
        <div className="register-header">
          <p className="register-eyebrow">Post a new job</p>
          <h1>Recruiter dashboard</h1>
          <p className="register-copy">
            Create a new job listing for candidates to discover and apply.
          </p>
        </div>

        <div className="register-form">
          <PostJobForm />
        </div>
      </section>
    </div>
  );
}
