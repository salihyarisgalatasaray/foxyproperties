import Link from "next/link";
import { dbQuery } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { can, homeFor } from "@/lib/auth/permissions";
export const dynamic = "force-dynamic";

async function kpis() {
  const out = { leads: 0, appts: 0, hot: 0, offers: 0, commission: 0 };
  try {
    const [l, a, h, o, c] = await Promise.all([
      dbQuery<{ n: string }>(`SELECT count(*)::text n FROM leads`),
      dbQuery<{ n: string }>(`SELECT count(*)::text n FROM appointments WHERE starts_at::date = current_date`),
      dbQuery<{ n: string }>(`SELECT count(*)::text n FROM clients WHERE status='HOT'`),
      dbQuery<{ n: string }>(`SELECT count(*)::text n FROM offers WHERE status='PENDING'`),
      dbQuery<{ n: string }>(`SELECT COALESCE(sum(commission_amount),0)::text n FROM commissions WHERE date_trunc('month',completed_on)=date_trunc('month',current_date)`),
    ]);
    out.leads = Number(l.rows[0].n); out.appts = Number(a.rows[0].n); out.hot = Number(h.rows[0].n); out.offers = Number(o.rows[0].n); out.commission = Number(c.rows[0].n);
  } catch { /* tables may be unavailable */ }
  return out;
}
const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export default async function Dashboard() {
  const me = await requireUser();
  if (!can(me.role, "dashboard:read")) redirect(homeFor(me.role));
  const k = await kpis();
  return (
    <>
      <p className="text-xs tracking-[.2em] text-neutral-500">OVERVIEW</p>
      <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card testid="kpi-appts" label="Today's appointments" value={String(k.appts)} href="/backoffice/appointments" />
        <Card testid="kpi-hot" label="Hot leads" value={String(k.hot)} href="/backoffice/clients" />
        <Card testid="kpi-offers" label="Pending offers" value={String(k.offers)} href="/backoffice/offers" />
        <Card testid="kpi-commission" label="Commission this month" value={gbp(k.commission)} href="/backoffice/commissions" gold />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card testid="kpi-leads" label="Total website leads" value={String(k.leads)} href="/backoffice/leads" />
      </div>
    </>
  );
}

function Card({ label, value, href, testid, gold }: { label: string; value: string; href: string; testid: string; gold?: boolean }) {
  return (
    <Link href={href} data-testid={testid} className={`block rounded-xl border p-6 transition hover:-translate-y-0.5 ${gold ? "border-[#d4af37]/40 bg-[#11110f] text-[#f4f0e8]" : "border-black/10 bg-white"}`}>
      <p className={`text-sm ${gold ? "text-[#d4af37]" : "text-neutral-500"}`}>{label}</p>
      <p className="mt-3 font-serif text-3xl">{value}</p>
    </Link>
  );
}
