"use client";
import { useState, type FormEvent } from "react";

type Choice = { value: string; label: string };

const STEPS: {
  key: string;
  eyebrow: string;
  question: string;
  helper?: string;
  field: string;
  kind: "text" | "choice";
  choices?: Choice[];
  placeholder?: string;
}[] = [
  {
    key: "postcode",
    eyebrow: "STEP 01",
    question: "Where is your property?",
    helper: "Enter the postcode or address. This helps us understand local rental demand.",
    field: "postcode",
    kind: "text",
    placeholder: "e.g. SW10 or 12 Kings Road, Chelsea",
  },
  {
    key: "type",
    eyebrow: "STEP 02",
    question: "What type of property is it?",
    field: "propertyType",
    kind: "choice",
    choices: [
      { value: "Flat / Apartment", label: "Flat / Apartment" },
      { value: "Terraced house", label: "Terraced house" },
      { value: "Semi / Detached house", label: "Semi / Detached house" },
      { value: "Penthouse", label: "Penthouse" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    key: "beds",
    eyebrow: "STEP 03",
    question: "How many bedrooms?",
    field: "bedrooms",
    kind: "choice",
    choices: [
      { value: "Studio", label: "Studio" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5+", label: "5+" },
    ],
  },
  {
    key: "condition",
    eyebrow: "STEP 04",
    question: "What condition is it in?",
    field: "condition",
    kind: "choice",
    choices: [
      { value: "Newly refurbished", label: "Newly refurbished" },
      { value: "Good / well maintained", label: "Good / well maintained" },
      { value: "Average", label: "Average" },
      { value: "Needs work", label: "Needs work" },
    ],
  },
  {
    key: "furnishing",
    eyebrow: "STEP 05",
    question: "How is it furnished?",
    field: "furnishing",
    kind: "choice",
    choices: [
      { value: "Furnished", label: "Furnished" },
      { value: "Part-furnished", label: "Part-furnished" },
      { value: "Unfurnished", label: "Unfurnished" },
    ],
  },
  {
    key: "service",
    eyebrow: "STEP 06",
    question: "Which service are you considering?",
    field: "service",
    kind: "choice",
    choices: [
      { value: "Fully managed", label: "Fully managed" },
      { value: "Rent collection", label: "Rent collection" },
      { value: "Let only", label: "Let only" },
      { value: "Not sure yet", label: "Not sure yet" },
    ],
  },
  {
    key: "availability",
    eyebrow: "STEP 07",
    question: "When would it be available to let?",
    field: "availability",
    kind: "choice",
    choices: [
      { value: "Immediately", label: "Immediately" },
      { value: "Within 1 month", label: "Within 1 month" },
      { value: "1–3 months", label: "1–3 months" },
      { value: "Just researching", label: "Just researching" },
    ],
  },
];

export function RentalValuationJourney() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textVal, setTextVal] = useState("");
  const [done, setDone] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  const total = STEPS.length; // question steps; last is the contact form
  const isForm = step >= total;
  const pct = Math.round(((isForm ? total : step) / total) * 100);

  const cur = STEPS[step];

  const answer = (field: string, value: string) => {
    setAnswers((a) => ({ ...a, [field]: value }));
    setTextVal("");
    setStep((s) => s + 1);
  };

  const submitText = () => {
    if (!textVal.trim() || !cur) return;
    answer(cur.field, textVal.trim());
  };

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return; // honeypot
    const summary = STEPS.map((s) => `${s.question} ${answers[s.field] || "—"}`).join("\n");
    const message = [f.get("message") as string, "— Rental valuation journey —", summary]
      .filter(Boolean)
      .join("\n");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "VALUATION",
        source: "LANDLORD_VALUATION",
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
        message,
        marketingConsent: f.get("marketing") === "on",
      }),
    });
    if (res.ok) setDone(true);
    else setState("error");
  }

  if (done)
    return (
      <div data-testid="valuation-success" className="border border-[#D4AF37]/40 bg-[#141413] p-8 md:p-12">
        <p className="display text-3xl text-[#D4AF37]">REQUEST RECEIVED.</p>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#A7A29A]">
          Thank you. A FOXY lettings specialist will review your property details and arrange a
          personalised rental valuation with you. No valuation figure or rental estimate has been
          provided at this stage — every figure is confirmed only after a proper assessment.
        </p>
        <a href="/landlords" className="mt-8 inline-block border border-[#D4AF37] px-6 py-3 text-xs tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black">
          BACK TO LANDLORD HUB →
        </a>
      </div>
    );

  return (
    <div data-testid="valuation-journey" className="overflow-hidden border border-white/10 bg-[#141413]">
      {/* Progress */}
      <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5 md:px-9">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[#D4AF37] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} data-testid="valuation-progress" />
        </div>
        <span className="text-[10px] tracking-[.2em] text-white/50">{pct}%</span>
      </div>

      <div className="p-6 md:p-10">
        {!isForm && cur && (
          <div key={cur.key} className="lifecycle-fade">
            <p className="text-[11px] tracking-[.32em] text-[#D4AF37]">{cur.eyebrow}</p>
            <h3 className="display mt-4 max-w-2xl text-3xl leading-tight md:text-4xl">{cur.question}</h3>
            {cur.helper && <p className="mt-4 max-w-lg text-sm leading-7 text-[#A7A29A]">{cur.helper}</p>}

            {cur.kind === "choice" && (
              <div className="mt-8 flex flex-wrap gap-3">
                {cur.choices!.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => answer(cur.field, c.value)}
                    data-testid={`valuation-opt-${c.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className={`border px-5 py-3 text-sm tracking-[.06em] transition-colors ${
                      answers[cur.field] === c.value
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : "border-white/20 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {cur.kind === "text" && (
              <div className="mt-8 flex max-w-xl flex-col gap-4 sm:flex-row">
                <input
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitText()}
                  placeholder={cur.placeholder}
                  data-testid="valuation-text-input"
                  className="flex-1 border border-white/15 bg-[#0B0B0A] px-4 py-3.5 text-white placeholder-white/35 outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={submitText}
                  disabled={!textVal.trim()}
                  data-testid="valuation-text-next"
                  className="bg-[#D4AF37] px-7 py-3.5 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                >
                  CONTINUE →
                </button>
              </div>
            )}
          </div>
        )}

        {isForm && (
          <form onSubmit={submitLead} data-testid="valuation-form" className="lifecycle-fade grid gap-5">
            <p className="text-[11px] tracking-[.32em] text-[#D4AF37]">FINAL STEP</p>
            <h3 className="display max-w-2xl text-3xl leading-tight md:text-4xl">Where shall we send your valuation?</h3>
            <p className="max-w-lg text-sm leading-7 text-[#A7A29A]">
              Share your details and a FOXY specialist will arrange your personalised rental valuation.
            </p>
            <div className="mt-2 grid gap-5 md:grid-cols-3">
              <Field name="name" label="Full name" required />
              <Field name="email" label="Email" type="email" required />
              <Field name="phone" label="Phone" />
            </div>
            <label className="text-sm text-white/65">
              Anything else we should know?
              <textarea name="message" rows={3} className="mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
            </label>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <label className="flex gap-3 text-xs leading-5 text-white/55">
              <input required type="checkbox" className="mt-1" data-testid="valuation-privacy" />I have read the
              privacy information and agree that FOXY may use these details to contact me about a rental
              valuation. No valuation figure is provided until a full assessment is completed.
            </label>
            <label className="flex gap-3 text-xs leading-5 text-white/45">
              <input type="checkbox" name="marketing" className="mt-1" />I would also like occasional FOXY
              property and market updates. I can unsubscribe at any time.
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={state === "sending"}
                data-testid="valuation-submit"
                className="bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {state === "sending" ? "SENDING…" : "REQUEST MY VALUATION →"}
              </button>
              <button type="button" onClick={() => setStep(total - 1)} className="text-xs tracking-[.14em] text-white/50 hover:text-white">
                ← BACK
              </button>
            </div>
            {state === "error" && (
              <p className="text-sm text-red-300" data-testid="valuation-error">Please check your details and try again.</p>
            )}
          </form>
        )}

        {/* Back link for question steps */}
        {!isForm && step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} data-testid="valuation-back" className="mt-8 text-xs tracking-[.14em] text-white/50 hover:text-white">
            ← BACK
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="text-sm text-white/65">
      {label}
      {required && <span className="text-[#D4AF37]"> *</span>}
      <input
        name={name}
        type={type}
        required={required}
        data-testid={`valuation-field-${name}`}
        className="mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}
