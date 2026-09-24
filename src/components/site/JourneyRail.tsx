import { getT } from "@/lib/i18n/server";

export type Step = { title: string; body?: string; href?: string };

export async function JourneyRail({
  eyebrow,
  heading,
  steps,
  testid = "journey-rail",
}: {
  eyebrow?: string;
  heading?: string;
  steps: Step[];
  testid?: string;
}) {
  const t = await getT();
  return (
    <section data-testid={testid} className="mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-32">
      {eyebrow && <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t(eyebrow)}</p>}
      {heading && (
        <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">{t(heading)}</h2>
      )}
      <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => {
          const inner = (
            <div className="group flex h-full flex-col bg-[#0E0E0E] p-8 transition-colors duration-300 hover:bg-[#141413]">
              <span className="display text-3xl text-[#D4AF37]/50 transition-colors group-hover:text-[#D4AF37]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-sm font-semibold tracking-[.12em] text-white">{t(s.title)}</p>
              {s.body && <p className="mt-3 text-sm leading-7 text-[#A7A29A]">{t(s.body)}</p>}
              {s.href && (
                <span className="mt-4 text-xs tracking-[.14em] text-[#D4AF37] opacity-0 transition-opacity group-hover:opacity-100">
                  {t("EXPLORE")} →
                </span>
              )}
            </div>
          );
          return s.href ? (
            <a key={s.title} href={s.href} data-testid={`${testid}-step-${i}`} className="block">
              {inner}
            </a>
          ) : (
            <div key={s.title} data-testid={`${testid}-step-${i}`}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
