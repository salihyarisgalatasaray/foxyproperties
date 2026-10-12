"use client";
import { useEffect, useState } from "react";
import type { UserRow } from "@/lib/backoffice/types";

const input = "rounded border border-black/15 px-3 py-2 text-sm";

export function UsersManager({ meId }: { meId: string }) {
  const [items, setItems] = useState<UserRow[]>([]);
  const [editing, setEditing] = useState<UserRow | "new" | null>(null);
  const [error, setError] = useState("");
  const load = () => fetch("/api/backoffice/users").then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  async function call(url: string, method: string, body: object) {
    setError("");
    const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(d.error || "Something went wrong."); return false; }
    load();
    return true;
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const b = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const ok = editing === "new" ? await call("/api/backoffice/users", "POST", b) : await call(`/api/backoffice/users/${(editing as UserRow).id}`, "PATCH", b);
    if (ok) setEditing(null);
  }

  return (
    <div data-testid="users-manager">
      <div className="mb-5 flex items-center gap-2">
        <span data-testid="users-count" className="text-xs text-neutral-500">{items.length} users · {items.filter((u) => u.active).length} active</span>
        <button onClick={() => { setError(""); setEditing("new"); }} data-testid="user-add-btn" className="ml-auto rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black">+ ADD USER</button>
      </div>
      {error && !editing && <p data-testid="users-error" className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {editing && <UserForm user={editing === "new" ? null : editing} error={error} onSubmit={save} onCancel={() => { setEditing(null); setError(""); }} />}
      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] text-left text-[10px] tracking-[.12em] text-neutral-500"><tr><th className="p-3">NAME</th><th className="p-3">EMAIL</th><th className="p-3">ROLE</th><th className="p-3">STATUS</th><th className="p-3 text-right">ACTIONS</th></tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} data-testid={`user-row-${u.id}`} className={`border-t border-black/5 ${u.active ? "" : "text-neutral-400"}`}>
                <td className="p-3 font-medium">{u.name}{u.id === meId && <span className="ml-2 text-[10px] text-neutral-400">(you)</span>}</td>
                <td className="p-3 text-xs">{u.email}</td>
                <td className="p-3 text-xs">{u.role === "ADMIN" ? "Admin" : u.role === "AGENT" ? "Agent" : u.role}</td>
                <td className="p-3"><span data-testid={`user-status-${u.id}`} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.active ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"}`}>{u.active ? "Active" : "Inactive"}</span></td>
                <td className="space-x-3 p-3 text-right text-xs">
                  <button onClick={() => { setError(""); setEditing(u); }} data-testid={`user-edit-${u.id}`} className="text-[#8a6d12] hover:underline">Edit</button>
                  {u.id !== meId && (
                    <button onClick={() => call(`/api/backoffice/users/${u.id}`, "PATCH", { active: !u.active })} data-testid={`user-toggle-${u.id}`} className={u.active ? "text-red-600 hover:underline" : "text-emerald-700 hover:underline"}>{u.active ? "Deactivate" : "Activate"}</button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No users.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserForm({ user, error, onSubmit, onCancel }: { user: UserRow | null; error: string; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form key={user?.id || "new"} onSubmit={onSubmit} data-testid="user-form" className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-2">
      <p className="text-xs font-semibold tracking-[.15em] text-neutral-500 md:col-span-2">{user ? `EDIT USER — ${user.email}` : "ADD NEW USER"}</p>
      <input name="name" required minLength={2} defaultValue={user?.name} placeholder="Full name *" data-testid="user-name" className={input} />
      <input name="email" type="email" required defaultValue={user?.email} placeholder="Email address *" data-testid="user-email" className={input} />
      <input name="password" type="password" required={!user} minLength={8} autoComplete="new-password" placeholder={user ? "New password (leave blank to keep)" : "Password * (min 8 characters)"} data-testid="user-password" className={input} />
      <select name="role" defaultValue={user?.role === "AGENT" ? "AGENT" : "ADMIN"} data-testid="user-role" className={input}><option value="ADMIN">Admin</option><option value="AGENT">Agent</option></select>
      {error && <p data-testid="user-form-error" className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <div className="flex gap-3 md:col-span-2">
        <button data-testid="user-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37]">{user ? "SAVE CHANGES" : "CREATE USER"}</button>
        <button type="button" onClick={onCancel} data-testid="user-cancel" className="rounded border border-black/15 px-5 py-2 text-xs tracking-[.12em]">CANCEL</button>
      </div>
    </form>
  );
}
