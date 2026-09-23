"use client";
import { useState } from "react";
import type { DbProperty } from "@/lib/propertiesDb";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const EMPTY = { title: "", description: "", area: "", price: 0, propertyType: "apartment", listingType: "buy", bedrooms: 1, bathrooms: 1, sizeSqft: 0, status: "COMING_SOON", photos: [] as string[] };
type Form = typeof EMPTY;
const mediaUrl = (p: string) => `/api/media/${p.split("/").map(encodeURIComponent).join("/")}`;

export function AdminProperties({ initial }: { initial: DbProperty[] }) {
  const [items, setItems] = useState<DbProperty[]>(initial);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const set = (k: keyof Form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(EMPTY); setEditingId(null); };
  const movePhoto = (from: number, to: number) => setForm((f) => {
    const a = [...f.photos];
    const [m] = a.splice(from, 1);
    a.splice(to, 0, m);
    return { ...f, photos: a };
  });

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setMsg("");
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (r.ok) setForm((f) => ({ ...f, photos: [...f.photos, j.path] }));
      else setMsg(j.error || "Upload failed");
    }
    setUploading(false);
  }

  async function save() {
    setBusy(true); setMsg("");
    const url = editingId ? `/api/admin/properties/${editingId}` : "/api/admin/properties";
    const r = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setMsg(j.error || "Save failed"); return; }
    setItems((prev) => editingId ? prev.map((p) => (p.id === editingId ? j.property : p)) : [j.property, ...prev]);
    reset(); setMsg(editingId ? "Property updated." : "Property added.");
  }

  function edit(p: DbProperty) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, area: p.area, price: p.price, propertyType: p.propertyType, listingType: p.listingType, bedrooms: p.bedrooms, bathrooms: p.bathrooms, sizeSqft: p.sizeSqft, status: p.status, photos: p.photos });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Delete this property?")) return;
    const r = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    if (r.ok) setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function toggleStatus(p: DbProperty) {
    const next = p.status === "LIVE" ? "COMING_SOON" : "LIVE";
    const body = { ...p, status: next };
    const r = await fetch(`/api/admin/properties/${p.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (r.ok) setItems((prev) => prev.map((x) => (x.id === p.id ? j.property : x)));
  }

  const inputCls = "mt-1 w-full border border-white/15 bg-[#0B0B0A] p-3 text-sm text-white outline-none focus:border-[#D4AF37]";

  return (
    <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
      {/* Form */}
      <section className="border border-white/10 bg-[#141413] p-6">
        <h2 className="display text-2xl">{editingId ? "Edit property" : "Add property"}</h2>
        <div className="mt-5 space-y-4" data-testid="admin-property-form">
          <label className="block text-xs tracking-[.14em] text-white/60">TITLE<input value={form.title} onChange={(e) => set("title", e.target.value)} data-testid="pf-title" className={inputCls} /></label>
          <label className="block text-xs tracking-[.14em] text-white/60">DESCRIPTION<textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} data-testid="pf-description" className={inputCls} /></label>
          <label className="block text-xs tracking-[.14em] text-white/60">LOCATION / AREA<input value={form.area} onChange={(e) => set("area", e.target.value)} data-testid="pf-area" className={inputCls} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs tracking-[.14em] text-white/60">PRICE (£)<input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} data-testid="pf-price" className={inputCls} /></label>
            <label className="block text-xs tracking-[.14em] text-white/60">SIZE (SQ FT)<input type="number" value={form.sizeSqft} onChange={(e) => set("sizeSqft", Number(e.target.value))} data-testid="pf-size" className={inputCls} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs tracking-[.14em] text-white/60">PROPERTY TYPE<select value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)} data-testid="pf-type" className={inputCls}><option value="apartment">Apartment</option><option value="house">House</option><option value="commercial">Commercial</option></select></label>
            <label className="block text-xs tracking-[.14em] text-white/60">LISTING TYPE<select value={form.listingType} onChange={(e) => set("listingType", e.target.value)} data-testid="pf-listing" className={inputCls}><option value="buy">Buy</option><option value="rent">Rent</option></select></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs tracking-[.14em] text-white/60">BEDROOMS<input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} data-testid="pf-beds" className={inputCls} /></label>
            <label className="block text-xs tracking-[.14em] text-white/60">BATHROOMS<input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} data-testid="pf-baths" className={inputCls} /></label>
          </div>
          <label className="block text-xs tracking-[.14em] text-white/60">STATUS<select value={form.status} onChange={(e) => set("status", e.target.value)} data-testid="pf-status" className={inputCls}><option value="COMING_SOON">Coming Soon</option><option value="LIVE">Live</option></select></label>
          <div>
            <p className="text-xs tracking-[.14em] text-white/60">PHOTOS</p>
            <input type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} data-testid="pf-photos" className="mt-2 block w-full text-xs text-white/70 file:mr-3 file:border file:border-[#D4AF37]/60 file:bg-transparent file:px-3 file:py-2 file:text-[#D4AF37]" />
            {uploading && <p className="mt-2 text-xs text-white/50">Uploading…</p>}
            {form.photos.length > 0 && <p className="mt-3 text-[10px] tracking-[.14em] text-white/40">DRAG TO REORDER · FIRST PHOTO IS THE COVER</p>}
            <div className="mt-2 flex flex-wrap gap-2" data-testid="photo-grid">
              {form.photos.map((p, i) => (
                <div
                  key={p}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragIndex !== null && dragIndex !== i) movePhoto(dragIndex, i); setDragIndex(null); }}
                  onDragEnd={() => setDragIndex(null)}
                  data-testid={`photo-thumb-${i}`}
                  className={`group/ph relative h-20 w-28 cursor-grab overflow-hidden border transition-opacity active:cursor-grabbing ${i === 0 ? "border-[#D4AF37]" : "border-white/10"} ${dragIndex === i ? "opacity-40" : ""}`}
                >
                  <img src={mediaUrl(p)} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                  {i === 0 ? (
                    <span className="absolute left-1 top-1 bg-[#D4AF37] px-1.5 py-0.5 text-[9px] font-semibold tracking-[.1em] text-black">COVER</span>
                  ) : (
                    <button type="button" onClick={() => movePhoto(i, 0)} data-testid={`photo-cover-${i}`} className="absolute left-1 top-1 hidden bg-black/70 px-1.5 py-0.5 text-[9px] tracking-[.08em] text-[#D4AF37] group-hover/ph:block">SET COVER</button>
                  )}
                  <button type="button" onClick={() => set("photos", form.photos.filter((x) => x !== p))} data-testid={`photo-remove-${i}`} className="absolute right-0 top-0 bg-black/70 px-1 text-xs text-white">×</button>
                </div>
              ))}
            </div>
          </div>
          {msg && <p className="text-xs text-[#D4AF37]" data-testid="admin-msg">{msg}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={busy} data-testid="admin-save" className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.14em] text-black disabled:opacity-50">{busy ? "SAVING…" : editingId ? "UPDATE PROPERTY" : "ADD PROPERTY"}</button>
            {editingId && <button onClick={reset} className="border border-white/20 px-4 py-3 text-xs tracking-[.14em]">CANCEL</button>}
          </div>
        </div>
      </section>

      {/* List */}
      <section>
        <h2 className="display text-2xl">Properties <span className="text-sm text-white/40">({items.length})</span></h2>
        <div className="mt-5 space-y-3" data-testid="admin-property-list">
          {items.length === 0 && <p className="text-white/50">No properties yet. Add one on the left.</p>}
          {items.map((p) => (
            <article key={p.id} data-testid={`admin-row-${p.id}`} className="flex items-center gap-4 border border-white/10 bg-[#141413] p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden bg-[#0B0B0A]">{p.photos[0] ? <img src={mediaUrl(p.photos[0])} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-[10px] text-white/30">NO PHOTO</div>}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{p.title} <span className="text-white/40">· {p.area}</span></p>
                <p className="text-xs text-white/50">{gbp.format(p.price)} · {p.bedrooms}bd/{p.bathrooms}ba · {p.propertyType} · {p.listingType}</p>
              </div>
              <button onClick={() => toggleStatus(p)} data-testid={`admin-toggle-${p.id}`} className={`px-3 py-2 text-[10px] tracking-[.14em] ${p.status === "LIVE" ? "bg-[#D4AF37] text-black" : "border border-white/20 text-white/70"}`}>{p.status === "LIVE" ? "LIVE" : "COMING SOON"}</button>
              <button onClick={() => edit(p)} data-testid={`admin-edit-${p.id}`} className="text-xs text-[#D4AF37]">Edit</button>
              <button onClick={() => remove(p.id)} data-testid={`admin-delete-${p.id}`} className="text-xs text-red-300">Delete</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
