// Emergent managed email proxy. Base URL is a hardcoded constant (survives deploy).
const EMAIL_BASE_URL = "https://integrations.emergentagent.com";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type SendArgs = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendArgs): Promise<string | null> {
  const key = process.env.EMERGENT_EMAIL_KEY;
  const fromName = process.env.EMAIL_FROM_NAME;
  if (!key || !fromName) {
    console.warn("[email] EMERGENT_EMAIL_KEY or EMAIL_FROM_NAME not set — skipping send");
    return null;
  }
  const payload: Record<string, unknown> = { to: [to], subject, html, from_name: fromName };
  const replyTo = process.env.EMAIL_REPLY_TO;
  if (replyTo) payload.contact_email = replyTo;

  const res = await fetch(`${EMAIL_BASE_URL}/api/v1/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Email-Key": key },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`email send failed: ${res.status} ${body}`);
  }
  const data = await res.json().catch(() => null);
  return data?.id ?? null;
}

type LeadInfo = {
  id: string;
  type: string;
  source: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  marketingConsent: boolean;
};

// Internal notification to the business owner. Recipient is server-side config,
// body is a fixed template with all lead fields HTML-escaped (no forms, no links).
export async function notifyNewLead(lead: LeadInfo): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL || "info@foxyproperties.co.uk";
  const brand = process.env.EMAIL_FROM_NAME || "FOXY Properties";
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Enquiry type", lead.type],
    ["Source", lead.source],
    ["Marketing consent", lead.marketingConsent ? "Yes" : "No"],
    ["Reference", lead.id],
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#8a8a8a;font-size:13px;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:6px 12px;color:#111;font-size:13px"><strong>${esc(v)}</strong></td></tr>`
    )
    .join("");
  const messageHtml = lead.message
    ? `<p style="margin:16px 0 0;color:#333;font-size:14px;line-height:22px"><strong>Message:</strong><br>${esc(
        lead.message
      )}</p>`
    : "";

  const html =
    `<table role="presentation" width="100%" style="background:#0B0B0A;padding:28px"><tr><td align="center">` +
    `<table role="presentation" width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">` +
    `<tr><td style="background:#0B0B0A;padding:20px 24px"><span style="color:#D4AF37;letter-spacing:3px;font-size:16px;font-weight:bold">${esc(
      brand
    )}</span></td></tr>` +
    `<tr><td style="padding:24px">` +
    `<p style="margin:0 0 4px;font-size:18px;color:#111"><strong>New website enquiry</strong></p>` +
    `<p style="margin:0 0 18px;font-size:13px;color:#8a8a8a">A new lead has just been submitted on the website.</p>` +
    `<table role="presentation" width="100%" style="border-collapse:collapse">${rowsHtml}</table>` +
    messageHtml +
    `<p style="margin:20px 0 0;font-size:12px;color:#8a8a8a;border-top:1px solid #eee;padding-top:14px">` +
    `Sent by ${esc(brand)}. We never ask for your password or card details by email.</p>` +
    `</td></tr></table></td></tr></table>`;

  await sendEmail({ to, subject: `New ${lead.type} enquiry — ${lead.name}`, html });
}

function shell(brand: string, inner: string): string {
  return (
    `<table role="presentation" width="100%" style="background:#0B0B0A;padding:28px"><tr><td align="center">` +
    `<table role="presentation" width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">` +
    `<tr><td style="background:#0B0B0A;padding:20px 24px"><span style="color:#D4AF37;letter-spacing:3px;font-size:16px;font-weight:bold">${esc(brand)}</span></td></tr>` +
    `<tr><td style="padding:24px">${inner}` +
    `<p style="margin:20px 0 0;font-size:12px;color:#8a8a8a;border-top:1px solid #eee;padding-top:14px">` +
    `Sent by ${esc(brand)}. We never ask for your password or card details by email.</p>` +
    `</td></tr></table></td></tr></table>`
  );
}

type EnquiryInfo = { id: string; name: string; email: string; phone: string; typeLabel: string; message: string };

export async function notifyNewEnquiry(e: EnquiryInfo): Promise<void> {
  const brand = process.env.EMAIL_FROM_NAME || "FOXY Properties";
  const rows: [string, string][] = [
    ["Name", e.name], ["Email", e.email], ["Phone", e.phone], ["Enquiry type", e.typeLabel], ["Reference", e.id],
  ];
  const rowsHtml = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#8a8a8a;font-size:13px;white-space:nowrap">${esc(k)}</td><td style="padding:6px 12px;color:#111;font-size:13px"><strong>${esc(v)}</strong></td></tr>`)
    .join("");
  const inner =
    `<p style="margin:0 0 4px;font-size:18px;color:#111"><strong>New customer enquiry</strong></p>` +
    `<p style="margin:0 0 18px;font-size:13px;color:#8a8a8a">Submitted via the Contact page.</p>` +
    `<table role="presentation" width="100%" style="border-collapse:collapse">${rowsHtml}</table>` +
    `<p style="margin:16px 0 0;color:#333;font-size:14px;line-height:22px"><strong>Message:</strong><br>${esc(e.message).replace(/\n/g, "<br>")}</p>`;
  await sendEmail({ to: "info@foxyproperties.co.uk", subject: `New enquiry: ${e.typeLabel} — ${e.name}`, html: shell(brand, inner) });
}

export async function sendEnquiryConfirmation(e: EnquiryInfo): Promise<void> {
  const brand = process.env.EMAIL_FROM_NAME || "FOXY Properties";
  const inner =
    `<p style="margin:0 0 12px;font-size:18px;color:#111"><strong>Thank you for your enquiry, ${esc(e.name)}.</strong></p>` +
    `<p style="margin:0 0 12px;font-size:14px;line-height:22px;color:#333">We have received your <strong>${esc(e.typeLabel)}</strong> enquiry. A member of the FOXY Properties team will be in touch within 24 hours.</p>` +
    `<p style="margin:0 0 12px;font-size:14px;line-height:22px;color:#333">If your matter is urgent, call us on <strong>0208 092 9196</strong>.</p>` +
    `<p style="margin:16px 0 0;font-size:13px;color:#8a8a8a">Your reference: ${esc(e.id)}</p>`;
  await sendEmail({ to: e.email, subject: `Thank you for your enquiry — ${brand}`, html: shell(brand, inner) });
}
