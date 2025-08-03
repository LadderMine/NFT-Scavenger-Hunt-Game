// app/link-accounts/page.tsx
"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function LinkAccounts() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Link your accounts</h1>
      <div className="space-y-3">
        <button onClick={() => signIn("github")} className="btn">
          Link GitHub
        </button>
        <button onClick={() => signIn("twitter")} className="btn">
          Link Twitter
        </button>
        <button onClick={() => signIn("discord")} className="btn">
          Link Discord
        </button>
      </div>
    </div>
  );
}
