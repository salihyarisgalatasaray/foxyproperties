const LINKS: [string, string][] = [
  ["PROPERTIES", "/properties"],
  ["INVESTMENT", "/investment"],
  ["MORTGAGES", "/mortgages"],
  ["AREAS", "/areas"],
  ["ABOUT", "/about"],
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[82px] items-center justify-between border-b border-white/10 px-5 backdrop-blur-md md:px-12">
      <a href="/" className="display text-xl tracking-[.12em] text-[#D4AF37]">FOXY</a>
      <nav className="hidden items-center gap-8 text-xs tracking-[.14em] md:flex">
        {LINKS.map(([label, href]) => (
          <a
            key={href}
            href={href}
            data-testid={`nav-${label.toLowerCase()}`}
            className="nav-underline text-white/85 transition-colors duration-300 hover:text-[#D4AF37]"
          >
            {label}
          </a>
        ))}
      </nav>
      <a
        href="/contact"
        data-testid="nav-consultation"
        className="border border-[#D4AF37] px-5 py-3 text-[11px] tracking-[.13em] text-[#D4AF37] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-black"
      >
        BOOK A CONSULTATION
      </a>
    </header>
  );
}
