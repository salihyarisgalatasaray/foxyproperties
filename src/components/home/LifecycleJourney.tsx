import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";
import { SceneStats, type Stat } from "./SceneStats";

type Scene = {
  id: string;
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  cta: string;
  href: string;
  img: string;
  alt: string;
  align: "left" | "right";
  pos: string;
  from: number;
  to: number;
  scaleFrom: number;
  scaleTo: number;
  stats: Stat[];
};

const SCENES: Scene[] = [
  {
    id: "invest",
    num: "07",
    eyebrow: "INVEST",
    title: <>BUILD LONG-TERM<br />VALUE.</>,
    copy: "London remains one of the world's most resilient property markets. Explore acquisition strategies designed around yield, growth and legacy.",
    cta: "EXPLORE INVESTMENT",
    href: "/investment",
    img: "/home/invest.jpg",
    alt: "City of London financial district skyline at dusk",
    align: "left",
    pos: "50% 45%",
    from: -8,
    to: 8,
    scaleFrom: 1.16,
    scaleTo: 1.28,
    stats: [
      { to: 5.4, decimals: 1, suffix: "%", label: "AVG. INDICATIVE YIELD" },
      { to: 10, suffix: " YR", label: "LONG-TERM HORIZON" },
    ],
  },
  {
    id: "finance",
    num: "08",
    eyebrow: "FINANCE",
    title: <>FUND IT<br />INTELLIGENTLY.</>,
    copy: "From first mortgage to complex portfolio refinancing, our finance specialists structure the right facility around your position.",
    cta: "EXPLORE MORTGAGES",
    href: "/mortgages",
    img: "/home/finance.jpg",
    alt: "Mortgage documents on a private wealth office desk",
    align: "right",
    pos: "50% 50%",
    from: -6,
    to: 6,
    scaleFrom: 1.18,
    scaleTo: 1.3,
    stats: [
      { to: 5.1, decimals: 1, suffix: "%", label: "FROM INDICATIVE RATE" },
      { to: 48, suffix: " H", label: "DECISION IN PRINCIPLE" },
    ],
  },
  {
    id: "let",
    num: "09",
    eyebrow: "LET",
    title: <>LET WITH<br />CONFIDENCE.</>,
    copy: "Qualified tenants, seamless referencing and full compliance — so your property performs from the very first day.",
    cta: "EXPLORE LETTINGS",
    href: "/lettings",
    img: "/home/letting.jpg",
    alt: "Keys handed over in a bright modern London apartment",
    align: "left",
    pos: "50% 55%",
    from: -10,
    to: 10,
    scaleFrom: 1.2,
    scaleTo: 1.34,
    stats: [
      { to: 14, suffix: " DAYS", label: "TYPICAL TIME TO LET" },
      { to: 98, suffix: "%", label: "PORTFOLIO OCCUPANCY" },
    ],
  },
  {
    id: "manage",
    num: "10",
    eyebrow: "MANAGE",
    title: <>MANAGED,<br />EFFORTLESSLY.</>,
    copy: "Dedicated management, proactive maintenance and transparent reporting. Your portfolio, cared for like our own.",
    cta: "EXPLORE MANAGEMENT",
    href: "/property-management",
    img: "/home/management.jpg",
    alt: "Elegant London residential concierge lobby at dusk",
    align: "right",
    pos: "50% 45%",
    from: -6,
    to: 6,
    scaleFrom: 1.16,
    scaleTo: 1.28,
    stats: [
      { to: 0, static: "24/7", label: "SUPPORT & REPORTING" },
      { to: 4, suffix: " / YR", label: "PROPERTY INSPECTIONS" },
    ],
  },
];

function JourneyScene({ s }: { s: Scene }) {
  const right = s.align === "right";
  return (
    <section
      id={s.id}
      data-testid={`home-${s.id}`}
      className="scene-vignette gold-seam-top diag-top relative -mt-[4vw] min-h-screen overflow-hidden bg-[#0B0B0A]"
    >
      <ParallaxImage src={s.img} alt={s.alt} objectPosition={s.pos} from={s.from} to={s.to} scaleFrom={s.scaleFrom} scaleTo={s.scaleTo} />
      <div className={`absolute inset-0 bg-gradient-to-${right ? "l" : "r"} from-[#0B0B0A] via-[#0B0B0A]/45 to-transparent`} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0B0A] to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-24 md:px-10">
        <div className={right ? "ml-auto text-right" : ""}>
          <Reveal>
            <p className="display text-2xl text-[#D4AF37]/70">{s.num}</p>
            <p className="mt-3 text-[11px] tracking-[.4em] text-[#D4AF37]">{s.eyebrow}</p>
            <h2 className="display mt-5 text-4xl leading-[1.05] md:text-6xl">{s.title}</h2>
            <p className={`mt-6 max-w-md text-sm leading-7 text-[#C9C4BB] md:text-base ${right ? "ml-auto" : ""}`}>{s.copy}</p>
            <a
              href={s.href}
              data-testid={`${s.id}-cta`}
              className={`group mt-8 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] ${right ? "flex-row-reverse" : ""}`}
            >
              {s.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <SceneStats stats={s.stats} align={s.align} />
            <p className={`mt-4 text-[10px] tracking-[.2em] text-white/35 ${right ? "text-right" : ""}`}>ILLUSTRATIVE · NOT A FORECAST OR GUARANTEE</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function LifecycleJourney() {
  return (
    <>
      {SCENES.map((s) => (
        <JourneyScene key={s.id} s={s} />
      ))}
    </>
  );
}
