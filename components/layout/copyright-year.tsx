"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Server-এ স্থির মান, browser-এ আসল বছর (prerender-এর সময় new Date() চলে না)
export default function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => "2026"
  );
  return <>{year}</>;
}