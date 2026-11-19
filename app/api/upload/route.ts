import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Vercel-এ request body সীমা প্রায় 4.5MB, তাই 4MB-এর বেশি নেওয়া হয় না
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Please sign in first" }, { status: 401 });
  }
  const user = session.user as unknown as { role?: string; isBlocked?: boolean };
  if (user.isBlocked) {
    return NextResponse.json({ message: "Your account is blocked" }, { status: 403 });
  }
  if (user.role !== "vendor" && user.role !== "admin") {
    return NextResponse.json({ message: "You cannot upload images" }, { status: 403 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image was sent" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Only JPG, PNG or WebP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Image must be 4MB or smaller" }, { status: 413 });
  }

  const body = new FormData();
  body.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
    const json = await res.json().catch(() => null);
    const url = json?.data?.display_url ?? json?.data?.url;
    if (!res.ok || !url) {
      return NextResponse.json({ message: "Image upload failed. Try again." }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ message: "Image upload failed. Try again." }, { status: 502 });
  }
}