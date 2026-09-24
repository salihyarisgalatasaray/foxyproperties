"use client";
import { FormEvent, useState } from "react";
import { useT } from "@/components/i18n/language";

type Field = { name: string; label: string; type?: string; required?: boolean };

export function LeadForm({
  type = "GENERAL",
  source = "WEBSITE",
  title = "MAKE AN ENQUIRY",
  submitLabel = "SEND ENQUIRY",
  extraFields = [],
  compact = false,
  testid = "lead-form",
}: {
  type?: string;
  source?: string;
  title?: string;
  submitLabel?: string;
  extraFields?: Field[];
  compact?: boolean;
  testid?: string;
}) {
  const t = useT();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return; // honeypot
    const extras = extraFields
      .map((x) => `${x.label}: ${f.get(x.name) || "—"}`)
      .join("\n");
    const message = [f.get("message") as string, extras].filter(Boolean).join("\n\n");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        source,
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
        message,
        marketingConsent: f.get("marketing") === "on",
      }),
    });
    setState(res.ok ? "sent" : "error");
  }

  if (state === "sent")
    return (
      <div
        data-testid={`${testid}-success`}
        className="border border-[#D4AF37]/40 bg-[#141413] p-8"
      >
        <p className="display text-2xl text-[#D4AF37]">{t("ENQUIRY RECEIVED.")}</p>
        <p className="mt-3 text-sm leading-7 text-[#A7A29A]">
          {t("Thank you. A member of the FOXY team will review your enquiry and be in touch. No advice or valuation figure has been provided at this stage.")}
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      method="post"
      data-testid={testid}
      className="grid gap-5 border border-white/10 bg-[#141413] p-6 md:p-8"
    >
      <p className="text-xs tracking-[.22em] text-[#D4AF37]">{t(title)}</p>
      <div className={`grid gap-5 ${compact ? "" : "md:grid-cols-2"}`}>
        <Input name="name" label="Full name" required t={t} />
        <Input name="email" label="Email" type="email" required t={t} />
        <Input name="phone" label="Phone" t={t} />
        {extraFields.map((x) => (
          <Input key={x.name} {...x} t={t} />
        ))}
      </div>
      <label className="text-sm text-white/65">
        {t("How can we help?")}
        <textarea
          name="message"
          rows={4}
          data-testid={`${testid}-message`}
          className="mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
        />
      </label>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label className="flex gap-3 text-xs leading-5 text-white/55">
        <input required type="checkbox" className="mt-1" data-testid={`${testid}-privacy`} />{t("I have read the privacy information and agree that FOXY may use these details to respond to my enquiry. This is separate from marketing consent.")}
      </label>
      <label className="flex gap-3 text-xs leading-5 text-white/45">
        <input type="checkbox" name="marketing" className="mt-1" />{t("I would also like to receive occasional FOXY property and market updates. I can unsubscribe at any time.")}
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        data-testid={`${testid}-submit`}
        className="mt-1 w-fit bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {state === "sending" ? t("SENDING…") : `${t(submitLabel)} →`}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-300" data-testid={`${testid}-error`}>
          {t("Please check your details and try again.")}
        </p>
      )}
    </form>
  );
}

function Input(p: Field & { t: (v: string) => string }) {
  return (
    <label className="text-sm text-white/65">
      {p.t(p.label)}
      {p.required && <span className="text-[#D4AF37]"> *</span>}
      <input
        name={p.name}
        type={p.type || "text"}
        required={p.required}
        data-testid={`field-${p.name}`}
        className="mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}
