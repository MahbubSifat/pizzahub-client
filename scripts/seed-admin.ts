import client from "../lib/db";
import { auth } from "../lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "PizzaHub Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first");
  }

  const users = client.db(process.env.DB_NAME || "pizzahub").collection("users");

  const existing = await users.findOne({ email });
  if (!existing) {
    // Better Auth দিয়ে বানানো হয়, যাতে password সঠিকভাবে hash হয়
    await auth.api.signUpEmail({
      body: { name, email, password, role: "customer" },
    });
    console.log("Admin account created.");
  } else {
    console.log("Account already exists, promoting it to admin.");
  }

  // Public sign-up admin বানাতে দেয় না, তাই এখানে সরাসরি database-এ role বসানো হয়
  const result = await users.updateOne(
    { email },
    { $set: { role: "admin", isBlocked: false, roleSelected: true } }
  );
  console.log(`Done. Matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);

  await client.close();
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});