"use client";

import { useEffect, useState } from "react";

export default function ApiStatus() {
  const [status, setStatus] = useState("Checking server...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) =>
        setStatus(data.status === "ok" ? "Server connected" : "Unexpected response")
      )
      .catch(() => setStatus("Cannot reach server"));
  }, []);

  return <p className="text-sm">{status}</p>;
}