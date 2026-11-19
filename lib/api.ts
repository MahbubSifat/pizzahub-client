import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// প্রতিটা request-এ নিজে JWT নিয়ে Express server-এ পাঠায়
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new ApiError("Please sign in again", 401);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
        Authorization: `Bearer ${data.token}`,
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection.", 0);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.message ?? `Request failed (${res.status})`, res.status, body.code);
  }
  return body as T;
}