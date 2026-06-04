import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "../../lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifyAuth(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json(
    { authenticated: true, user: payload },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  // Logout endpoint
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );
  response.cookies.set("authToken", "", { maxAge: 0 });
  return response;
}
