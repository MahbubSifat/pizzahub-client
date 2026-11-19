import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "customer" | "vendor" | "admin";

type AppUser = { role?: string; isBlocked?: boolean };

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Server-এ চলে, তাই reload দিলেও logged-in user login page-এ ফেরত যায় না
export async function requireRole(role: Role) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const user = session.user as unknown as AppUser;
  if (user.isBlocked) redirect("/blocked");
  if (user.role !== role) redirect("/dashboard");
  return session;
}