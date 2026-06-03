import { NextResponse } from "next/server";
import { pbkdf2Sync } from "crypto";
import clientPromise from "../../lib/mongodb";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB ?? "job-portal");
  const users = db.collection("users");

  const user = await users.findOne({ email: email.toLowerCase() });

  if (!user || !user.passwordHash || !user.passwordSalt) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const hashedPassword = pbkdf2Sync(
    password,
    user.passwordSalt,
    310000,
    32,
    "sha256"
  ).toString("hex");

  if (hashedPassword !== user.passwordHash) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, message: "Logged in successfully." }, { status: 200 });
}
