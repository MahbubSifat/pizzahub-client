import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }
  if ((session.user as { isBlocked?: boolean }).isBlocked) {
    return NextResponse.json({ message: "Your account has been blocked" }, { status: 403 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Please choose an image" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ message: "Only JPG, PNG or WebP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Image must be 2MB or smaller" }, { status: 400 });
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const body = new FormData();
  body.append("image", base64);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
    const data = await response.json();
    const url = data?.data?.url;
    if (!response.ok || !url) {
      return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
  }
}