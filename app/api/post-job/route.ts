import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { verifyAuth } from "../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;
    const user = token ? await verifyAuth(token) : null;

    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim() ?? "";
    const company = formData.get("company")?.toString().trim() ?? "";
    const skills = formData.get("skills")?.toString().trim() ?? "";
    const salaryRange = formData.get("salaryRange")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const description = formData.get("description")?.toString().trim() ?? "";

    if (!title || !company || !skills || !salaryRange || !location) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "job-portal");
    const jobDetails = db.collection("jobDetails");

    const jobRecord = {
      title,
      company,
      skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      salaryRange,
      location,
      description,
      recruiterId: user.userId,
      createdAt: new Date(),
      status: "open",
    };

    const result = await jobDetails.insertOne(jobRecord);

    if (!result.insertedId) {
      throw new Error("Unable to save job posting.");
    }

    return NextResponse.json({ success: true, jobId: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Job posting failed: ${error.message}`
            : "Job posting failed due to an unexpected error.",
      },
      { status: 500 }
    );
  }
}
