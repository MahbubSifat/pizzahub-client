import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import client from "./db";

const db = client.db(process.env.DB_NAME || "pizzahub");

// এই field-গুলো user নিজে কখনো বদলাতে পারবে না
const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
  "roleSelected",
];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Google দিয়ে নতুন user এলে role এখনো বাছা হয়নি, তাই onboarding পাতায় যাবে
      mapProfileToUser: () => ({ roleSelected: false }),
    },
  },
  user: {
    modelName: "users", // assignment-এর collection নাম
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      roleSelected: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Profile update দিয়ে role বা plan বদলানো আটকানো (R116)
      if (ctx.path === "/update-user") {
        const body = (ctx.body ?? {}) as Record<string, unknown>;
        if (PROTECTED_FIELDS.some((field) => field in body)) {
          throw new APIError("FORBIDDEN", {
            message: "You cannot change this field",
          });
        }
        return;
      }

      // Sign-up-এর আগে server-এ নিয়ম যাচাই (frontend-এর উপর ভরসা নয়)
      if (ctx.path !== "/sign-up/email") return;
      const body = ctx.body as { password?: string; role?: string } | undefined;
      const password = body?.password ?? "";
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain an uppercase and a lowercase letter",
        });
      }
      if (body?.role !== "vendor" && body?.role !== "customer") {
        throw new APIError("BAD_REQUEST", {
          message: "Role must be vendor or customer",
        });
      }
    }),
  },
  plugins: [jwt()],
});