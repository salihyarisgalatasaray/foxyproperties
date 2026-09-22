"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
    });
    setBusy(false);
    if (!r.ok) { setError("Email or password could not be verified."); return; }
    router.replace("/admin/properties");
    router.refresh();
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[#0B0B0A] p-6 text-[#f4f0e8]">
      <form onSubmit={submit} method="post" data-testid="admin-login-form" className="w-full max-w-md border border-white/10 bg-[#141413] p-8">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">FOXY ADMIN</p>
        <h1 className="display mt-4 text-4xl">Sign in</h1>
        <label className="mt-8 block text-sm">Email
          <input name="email" type="email" autoComplete="username" required data-testid="admin-login-email" className="mt-2 w-full border border-white/15 bg-transparent p-3 outline-none focus:border-[#D4AF37]" />
        </label>
        <label className="mt-5 block text-sm">Password
          <input name="password" type="password" autoComplete="current-password" minLength={8} required data-testid="admin-login-password" className="mt-2 w-full border border-white/15 bg-transparent p-3 outline-none focus:border-[#D4AF37]" />
        </label>
        {error && <p className="mt-4 text-sm text-red-300" data-testid="admin-login-error">{error}</p>}
        <button type="submit" disabled={busy} data-testid="admin-login-submit" className="mt-7 w-full bg-[#D4AF37] p-3 text-sm font-semibold text-black disabled:opacity-50">
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}
