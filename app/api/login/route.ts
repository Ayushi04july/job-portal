import { NextResponse } from "next/server";
import { pbkdf2Sync } from "crypto";
import clientPromise from "../../lib/mongodb";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

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

  try {
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

    // Create JWT token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Set secure httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully.",
        role: user.role,
      },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Login failed due to an unexpected error.",
      },
      { status: 500 }
    );
  }
}
