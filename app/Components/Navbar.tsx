"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserRole = "candidate" | "recruiter" | null;

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth");
        if (response.ok) {
          const data = await response.json();
          setAuthenticated(true);
          setRole(data.user?.role ?? null);
        } else {
          setAuthenticated(false);
          setRole(null);
        }
      } catch {
        setAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth", { method: "POST" });
    setAuthenticated(false);
    setRole(null);
    window.location.href = "/";
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          JobPortal 🚀
        </Link>

        <div className="flex gap-6 items-center text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {authenticated && role === "candidate" && (
            <Link href="/jobs" className="hover:text-blue-600 transition">
              Explore Jobs
            </Link>
          )}

          {authenticated && role === "recruiter" && (
            <Link href="/post-job" className="hover:text-blue-600 transition">
              Post a Job
            </Link>
          )}

          {!loading && !authenticated && (
            <>
              <Link href="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {authenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
