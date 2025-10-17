// src/utils/auth.ts
import { api } from "@/lib/api";

export async function isLoggedIn() {
  // backend endpoint returns { user } or { user: null }
  try {
    return await api("/auth/isLoggedIn", { method: "GET" });
  } catch (err) {
    return { user: null };
  }
}

export async function login(email: string, password: string) {
  return await api("/auth/login", { method: "POST", data: { email, password } });
}

export async function register(name: string, email: string, password: string) {
  return await api("/auth/register", { method: "POST", data: { name, email, password } });
}

export async function logout() {
  return await api("/auth/logout", { method: "POST" });
}
