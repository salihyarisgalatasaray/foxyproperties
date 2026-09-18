import Link from "next/link";
import type { Property } from "@/lib/properties";
const gbp = new Intl.NumberFormat("en-GB", { style:"currency", currency:"GBP", maximumFractionDigits:0 });
export function PropertyCard({property}:{property:Property}) { return <article className="group border border-white/10 bg-[#141413]">
  <Link href={`/properties/${property.slug}`} className="block">
  <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_70%_30%,#4b3a22,#1d1d1b_48%,#111)]">
    <div className="absolute inset-0 transition duration-700 group-hover:scale-105 bg-[linear-gradient(135deg,transparent_20%,rgba(212,175,55,.12),transparent_70%)]" />
    <span className="absolute left-4 top-4 border border-[#D4AF37]/60 bg-black/60 px-3 py-2 text-[10px] tracking-[.18em] text-[#D4AF37]">{property.status.replaceAll("_"," ")}</span>
    {property.prototype && <span className="absolute bottom-4 left-4 text-[10px] tracking-[.18em] text-white/55">PROTOTYPE · NOT A LIVE PROPERTY</span>}
  </div>
  <div className="p-5"><p className="text-[11px] tracking-[.22em] text-[#D4AF37]">{property.area.toUpperCase()}</p><h2 className="display mt-2 text-2xl">{property.title}</h2><div className="mt-5 flex justify-between gap-4 border-t border-white/10 pt-4 text-sm text-white/65"><span>{property.bedrooms} BED · {property.bathrooms} BATH</span><span>{property.type}</span></div><div className="mt-4 flex items-end justify-between"><p className="text-lg">{gbp.format(property.price)}</p><span className="text-xs tracking-[.16em] text-[#D4AF37]">VIEW →</span></div></div>
  </Link>
</article> }
