import { NextResponse } from "next/server";
import { pbkdf2Sync, randomBytes } from "crypto";
import clientPromise from "../../lib/mongodb";

const validRoles = ["candidate", "recruiter"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim() ?? "";
  const role = formData.get("role")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!name || !role || !email || !password) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid registration role." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "job-portal");
    const users = db.collection("users");

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex");

    const userRecord = {
      name,
      role,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      passwordSalt: salt,
      createdAt: new Date(),
      status: "active",
      profileComplete: false,
    };

    const result = await users.insertOne(userRecord);

    if (!result.insertedId) {
      throw new Error("Failed to create user.");
    }

    return NextResponse.json(
      { success: true, userId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Registration failed: ${error.message}`
            : "Registration failed due to an unexpected error.",
      },
      { status: 500 }
    );
  }
}
