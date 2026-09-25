"use client";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/language";

const RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const DIGITS = RAW.replace(/[^0-9]/g, "");
const HINT_KEY = "foxy_wa_hint_seen";

export function WhatsAppButton() {
  const t = useT();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!DIGITS) return;
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen) return;
    const showTimer = setTimeout(() => setHint(true), 1200);
    const hideTimer = setTimeout(() => {
      setHint(false);
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {}
    }, 7200);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!DIGITS) return null;
  const href = `https://wa.me/${DIGITS}`;

  const dismissHint = () => {
    setHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3">
      {hint && (
        <div
          data-testid="whatsapp-hint"
          className="wa-hint relative rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0B0B0A] shadow-[0_8px_24px_rgba(0,0,0,.25)]"
        >
          {t("Message us")}
          <span className="absolute right-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-white" aria-hidden />
          <button
            onClick={dismissHint}
            aria-label="Dismiss"
            data-testid="whatsapp-hint-close"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B0B0A] text-[10px] text-white"
          >
            ✕
          </button>
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FOXY Property on WhatsApp"
        data-testid="whatsapp-button"
        onClick={dismissHint}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,.45)] transition-transform duration-300 hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-ping" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-white" aria-hidden>
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.713 6.402L3.2 28.8l6.58-1.715a12.74 12.74 0 0 0 6.222 1.6h.005c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.803-12.8Zm0 23.36h-.004a10.53 10.53 0 0 1-5.365-1.47l-.385-.228-3.905 1.018 1.043-3.807-.25-.39a10.51 10.51 0 0 1-1.61-5.586c0-5.86 4.77-10.63 10.635-10.63 2.84 0 5.51 1.107 7.517 3.116a10.56 10.56 0 0 1 3.113 7.52c0 5.86-4.77 10.627-10.634 10.627Zm5.83-7.958c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.57-1.586-.95-.847-1.59-1.893-1.777-2.213-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.986-2.373-.26-.623-.524-.538-.72-.548l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.824.763.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.89-.773 2.157-1.52.267-.746.267-1.386.187-1.52-.08-.133-.293-.213-.613-.373Z" />
        </svg>
      </a>
    </div>
  );
}
