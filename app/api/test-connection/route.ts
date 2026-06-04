import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "job-portal");
    await db.command({ ping: 1 });

    return NextResponse.json(
      { success: true, message: "MongoDB connection is successful." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error connecting to MongoDB.",
      },
      { status: 500 }
    );
  }
}
