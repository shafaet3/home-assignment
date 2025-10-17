import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isLoggedIn, logout } from "@/utils/auth";
import { useUserStore } from "@/store/useUserStore";

export default function App({ Component, pageProps }: AppProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  // Check current user on app load
  useEffect(() => {
    (async () => {
      const r = await isLoggedIn();
      if (r?.user) setUser(r.user);
      else setUser(null);
    })();
  }, [setUser]);

  // Logout handler
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
          <Link href="/" className="text-xl font-semibold text-blue-600">
            AutoParts
          </Link>

          <nav className="space-x-4 flex items-center text-sm">
            <Link href="/" className="hover:text-blue-500 transition">Home</Link>
            <Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-blue-600 font-bold">Hi, {user.name}</span>
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
