import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          JobPortal 🚀
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center text-gray-700 font-medium">

          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link href="/jobs" className="hover:text-blue-600 transition">
            Jobs
          </Link>

          <Link href="/login" className="hover:text-blue-600 transition">
            Login
          </Link>

          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>

        </div>
      </div>
    </nav>
  );
}