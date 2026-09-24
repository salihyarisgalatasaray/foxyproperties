import { dbQuery } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import type { LeadRow } from "@/lib/crm/types";
import { PipelineBoard } from "@/components/backoffice/PipelineBoard";

export const dynamic = "force-dynamic";

const LANDLORD_TYPES = ["VALUATION", "LANDLORD", "MANAGEMENT", "SWITCH", "LETTING"];

export default async function PipelinePage() {
  const user = await requireUser("leads:read");
  let rows: LeadRow[] = [];
  let offline = false;
  try {
    rows = (
      await dbQuery<LeadRow>(
        `SELECT id,type,source,status,name,email,phone,message,marketing_consent,created_at::text,updated_at::text
         FROM leads
         WHERE type = ANY($1) OR source ILIKE 'LANDLORD%'
         ORDER BY created_at DESC
         LIMIT 300`,
        [LANDLORD_TYPES]
      )
    ).rows;
  } catch {
    offline = true;
  }

  return (
    <>
      <p className="text-xs tracking-[.2em] text-neutral-500">PIPELINE</p>
      <h1 className="mt-2 font-serif text-4xl">Valuations &amp; Landlords</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-500">
        Rental valuation requests and landlord enquiries, tracked from first contact through to won.
        Use the arrows to move a lead between stages.
      </p>

      {offline && (
        <p className="mt-6 rounded-lg bg-white p-4 text-sm">Database is not configured or reachable.</p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-black/10 bg-white px-4 py-1.5" data-testid="pipeline-total">
          {rows.length} landlord / valuation leads
        </span>
      </div>

      <div className="mt-8">
        {rows.length === 0 && !offline ? (
          <p className="rounded-xl border border-black/10 bg-white p-8 text-sm text-neutral-500">
            No landlord or valuation leads yet. New rental valuation requests will appear here automatically.
          </p>
        ) : (
          <PipelineBoard initial={rows} canUpdate={can(user.role, "leads:update")} />
        )}
      </div>
    </>
  );
}
