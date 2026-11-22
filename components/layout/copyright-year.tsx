"use client";

// বছর browser-এ বের হয়, তাই build-এর সময় বর্তমান সময় লাগে না
export default function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}