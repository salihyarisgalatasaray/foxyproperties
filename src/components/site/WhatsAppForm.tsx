"use client";
import { FormEvent, useEffect, useRef } from "react";
import { useT } from "@/components/i18n/language";

const field = "mt-1.5 w-full rounded-lg border border-white/12 bg-[#0B0B0A] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#D4AF37]";

export const whatsappMessage = (f: Record<string, string>) =>
  `Hi, I'm ${f.first_name} ${f.last_name}, my mobile is ${f.phone} and email is ${f.email}. I'd like to get in touch.`;

export function WhatsAppForm({ digits, onClose }: { digits: string; onClose: () => void }) {
  const t = useT();
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => {
    first.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    // Notify the team without blocking: WhatsApp opens whatever happens to the request.
    fetch("/api/whatsapp-lead", { method: "POST", keepalive: true, headers: { "content-type": "application/json" }, body: JSON.stringify(f) }).catch(() => {});
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage(f))}`;
    if (!window.open(url, "_blank", "noopener,noreferrer")) window.location.href = url;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center sm:justify-end sm:p-6" onClick={onClose} data-testid="whatsapp-modal-overlay">
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-form-title"
        data-testid="whatsapp-form"
        className="wa-modal w-full max-w-sm rounded-2xl border border-white/10 bg-[#141413] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,.5)] sm:mb-20"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[.25em] text-[#D4AF37]">{t("WHATSAPP")}</p>
            <h2 id="wa-form-title" className="display mt-1 text-2xl">{t("Before we chat")}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" data-testid="whatsapp-form-close" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">✕</button>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/50">{t("Share your details so our team knows who they are speaking to.")}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="text-xs text-white/65">{t("First Name")}<input ref={first} name="first_name" required maxLength={60} autoComplete="given-name" data-testid="whatsapp-first-name" className={field} /></label>
          <label className="text-xs text-white/65">{t("Last Name")}<input name="last_name" required maxLength={60} autoComplete="family-name" data-testid="whatsapp-last-name" className={field} /></label>
        </div>
        <label className="mt-3 block text-xs text-white/65">{t("Mobile Number")}<input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" placeholder="07…" data-testid="whatsapp-phone" className={field} /></label>
        <label className="mt-3 block text-xs text-white/65">{t("Email Address")}<input name="email" type="email" required maxLength={254} autoComplete="email" data-testid="whatsapp-email" className={field} /></label>
        <button type="submit" data-testid="whatsapp-continue" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-[#0B0B0A] transition-transform hover:-translate-y-0.5">
          {t("Continue to WhatsApp")} →
        </button>
        <p className="mt-3 text-center text-[10px] leading-4 text-white/35">{t("By continuing you agree that FOXY may contact you about your enquiry.")}</p>
      </form>
    </div>
  );
}
