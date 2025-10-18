// src/lib/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Automatically detect FormData & handle headers
export async function api<T = any>(
  url: string,
  opts: { method?: string; data?: any } = {}
) {
  try {
    const isFormData = typeof FormData !== "undefined" && opts.data instanceof FormData;

    const res = await axiosInstance.request<T>({
      url,
      method: opts.method || "GET",
      data: opts.data,
      headers: isFormData
        ? {} // let browser set multipart boundary automatically
        : { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err: any) {
    if (err.response) {
      throw { status: err.response.status, data: err.response.data };
    }
    throw err;
  }
}
