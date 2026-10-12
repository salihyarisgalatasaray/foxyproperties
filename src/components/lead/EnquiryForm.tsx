"use client";
import { FormEvent, useState } from "react";
import { useT } from "@/components/i18n/language";
import { enquiryTypes } from "@/lib/backoffice/types";

const field = "mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none transition-colors focus:border-[#D4AF37]";

export function EnquiryForm() {
  const t = useT();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return;
    setState("sending");
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(f)),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent")
    return (
      <div data-testid="enquiry-form-success" className="border border-[#D4AF37]/40 bg-[#141413] p-8">
        <p className="display text-2xl text-[#D4AF37]">{t("THANK YOU.")}</p>
        <p className="mt-3 text-sm leading-7 text-[#A7A29A]">{t("Your enquiry has been received. A confirmation email is on its way and our team will be in touch within 24 hours.")}</p>
      </div>
    );

  return (
    <form onSubmit={submit} method="post" data-testid="enquiry-form" className="grid gap-5 border border-white/10 bg-[#141413] p-6 md:p-8">
      <p className="text-xs tracking-[.22em] text-[#D4AF37]">{t("SEND AN ENQUIRY")}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <Label text={t("Full Name")}><input name="full_name" required minLength={2} data-testid="enquiry-full-name" className={field} /></Label>
        <Label text={t("Email Address")}><input name="email" type="email" required data-testid="enquiry-email" className={field} /></Label>
        <Label text={t("Phone Number")}><input name="phone" type="tel" required minLength={6} data-testid="enquiry-phone" className={field} /></Label>
        <Label text={t("Enquiry Type")}>
          <select name="enquiry_type" required defaultValue="" data-testid="enquiry-type" className={field}>
            <option value="" disabled>{t("Select an enquiry type")}</option>
            {Object.entries(enquiryTypes).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
          </select>
        </Label>
      </div>
      <Label text={t("Message")}><textarea name="message" required rows={5} data-testid="enquiry-message" className={field} /></Label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex gap-3 text-xs leading-5 text-white/55">
        <input required type="checkbox" className="mt-1" data-testid="enquiry-privacy" />{t("I have read the privacy information and agree that FOXY may use these details to respond to my enquiry. This is separate from marketing consent.")}
      </label>
      <button type="submit" disabled={state === "sending"} data-testid="enquiry-submit" className="mt-1 w-fit bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50">
        {state === "sending" ? t("SENDING…") : `${t("SUBMIT ENQUIRY")} →`}
      </button>
      {state === "error" && <p className="text-sm text-red-300" data-testid="enquiry-form-error">{t("Please check your details and try again.")}</p>}
    </form>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return <label className="text-sm text-white/65">{text}<span className="text-[#D4AF37]"> *</span>{children}</label>;
}
