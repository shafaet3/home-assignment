import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "@/utils/auth"; 
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  // Check current user when app loads
  useEffect(() => {
    (async () => {
      const r = await isLoggedIn();
      if (r?.user) setUser(r.user);
      else setUser(null);
    })();
  }, []);

  // Handle logout click
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ---------- Header ---------- */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-blue-600">
            AutoParts
          </Link>

          {/* Navigation */}
          <nav className="space-x-4 flex items-center text-sm">
            <Link href="/" className="hover:text-blue-500 transition">Home</Link>
            {/* <Link href="/test" className="hover:text-blue-500 transition">Test</Link> */}
            <Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-blue-600 hover:text-blue-700 transition">
                  Login
                </Link>
                <Link href="/register" className="ml-2 text-green-600 hover:text-green-700 transition">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ---------- Main Content ---------- */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Component {...pageProps} />
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} AutoParts — Demo
        </div>
      </footer>
    </div>
  );
}
