import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import client from "./db";

const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    modelName: "users", // assignment-এর collection নাম
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    // Sign-up-এর আগে server-এ নিয়ম যাচাই (frontend-এর উপর ভরসা নয়)
    before: createAuthMiddleware(async (ctx) => {
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