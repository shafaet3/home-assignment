// src/lib/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // IMPORTANT: send cookies (httpOnly) automatically
  headers: {
    "Content-Type": "application/json"
  }
});

// Basic wrapper to surface response.data and errors
export async function api<T = any>(url: string, opts: { method?: string; data?: any } = {}) {
  try {
    const res = await axiosInstance.request<T>({
      url,
      method: opts.method || "GET",
      data: opts.data
    });
    return res.data;
  } catch (err: any) {
    // normalize axios error
    if (err.response) {
      throw { status: err.response.status, data: err.response.data };
    }
    throw err;
  }
}
