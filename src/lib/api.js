import { authClient } from "./auth-client";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function getToken() {
  const { data } = await authClient.token();
  return data?.token;
}

/** Small fetch wrapper. Pass { auth: true } to attach the BetterAuth JWT. */
export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getToken();
    if (!token) throw new Error("Your session has expired. Please log in again.");
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.errors = data.errors;
    err.status = res.status;
    throw err;
  }
  return data;
}
