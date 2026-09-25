"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/components/i18n/language";

const KEY = "foxy_cookie_consent";

type Prefs = { necessary: true; analytics: boolean; marketing: boolean };

function Toggle({
  on,
  disabled,
  onChange,
  testid,
}: {
  on: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  testid: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      data-testid={testid}
      onClick={() => !disabled && onChange?.(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-[#D4AF37]" : "bg-white/20"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const t = useT();
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (!saved) setShow(true);
    setReady(true);
  }, []);

  const persist = (prefs: Prefs) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...prefs, ts: Date.now() }));
    } catch {}
    setShow(false);
    setSettings(false);
  };

  if (!ready || !show) return null;

  return (
    <div
      data-testid="cookie-banner"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
    >
      {!settings ? (
        <div className="w-full max-w-xl border border-[#D4AF37]/30 bg-[#0E0E0E] p-7 shadow-2xl">
          <h2 className="display text-xl text-[#D4AF37]">{t("We value your privacy")}</h2>
          <p className="mt-4 text-sm leading-7 text-[#C9C4BB]">
            {t(
              "We use necessary cookies to make our website work and we'd like to use other cookies to give you the most relevant experience. Click Accept all to agree to all cookies, or for more options click on Change Settings. For more information see our"
            )}{" "}
            <Link
              href="/privacy-policy"
              data-testid="cookie-policy-link"
              className="text-[#D4AF37] underline underline-offset-2 hover:text-white"
            >
              {t("cookie policy")}
            </Link>
            .
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              data-testid="cookie-accept-all"
              onClick={() => persist({ necessary: true, analytics: true, marketing: true })}
              className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.14em] text-black transition-colors hover:bg-[#e6c84f]"
            >
              {t("ACCEPT ALL")}
            </button>
            <button
              type="button"
              data-testid="cookie-change-settings"
              onClick={() => setSettings(true)}
              className="border border-white/30 px-6 py-3 text-xs tracking-[.14em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              {t("CHANGE SETTINGS")}
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="cookie-settings-modal"
          className="w-full max-w-xl border border-[#D4AF37]/30 bg-[#0E0E0E] p-7 shadow-2xl"
        >
          <h2 className="display text-xl text-[#D4AF37]">{t("Cookie Preferences")}</h2>
          <div className="mt-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-semibold text-white">{t("Necessary Cookies")}</p>
                <p className="mt-1 text-xs leading-6 text-[#A7A29A]">
                  {t("Required to make the website work. These cannot be disabled.")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[.14em] text-[#D4AF37]">{t("ALWAYS ON")}</span>
                <Toggle on disabled testid="cookie-necessary" />
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-semibold text-white">{t("Analytics Cookies")}</p>
                <p className="mt-1 text-xs leading-6 text-[#A7A29A]">
                  {t("Help us understand how visitors use the site so we can improve it.")}
                </p>
              </div>
              <Toggle on={analytics} onChange={setAnalytics} testid="cookie-toggle-analytics" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{t("Marketing Cookies")}</p>
                <p className="mt-1 text-xs leading-6 text-[#A7A29A]">
                  {t("Used to show you more relevant property and market updates.")}
                </p>
              </div>
              <Toggle on={marketing} onChange={setMarketing} testid="cookie-toggle-marketing" />
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              data-testid="cookie-save-settings"
              onClick={() => persist({ necessary: true, analytics, marketing })}
              className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.14em] text-black transition-colors hover:bg-[#e6c84f]"
            >
              {t("SAVE SETTINGS")}
            </button>
            <button
              type="button"
              data-testid="cookie-back"
              onClick={() => setSettings(false)}
              className="border border-white/30 px-6 py-3 text-xs tracking-[.14em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              {t("BACK")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
