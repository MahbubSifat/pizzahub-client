"use server";

import { ObjectId } from "mongodb";
import client from "@/lib/db";
import { getSession } from "@/lib/session";

type Result = { ok: boolean; message?: string };

export async function completeOnboarding(input: {
  role: string;
  businessName?: string;
}): Promise<Result> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Please sign in first" };

  // শুধু এই দুটো role অনুমোদিত, admin কখনো নয়
  if (input.role !== "customer" && input.role !== "vendor") {
    return { ok: false, message: "Invalid role" };
  }
  const businessName = (input.businessName ?? "").trim();
  if (input.role === "vendor" && businessName.length < 2) {
    return { ok: false, message: "Please enter your restaurant name" };
  }

  const users = client.db(process.env.DB_NAME || "pizzahub").collection("users");

  // roleSelected: false থাকলেই শুধু বদলাবে, অর্থাৎ role একবারই বাছা যায়
  const result = await users.updateOne(
    { _id: new ObjectId(session.user.id), roleSelected: false },
    {
      $set: {
        role: input.role,
        roleSelected: true,
        ...(input.role === "vendor" ? { businessName } : {}),
      },
    }
  );

  if (result.matchedCount === 0) {
    return { ok: false, message: "Your role has already been set" };
  }
  return { ok: true };
}