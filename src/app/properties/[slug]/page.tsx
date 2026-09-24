import Link from "next/link"; import {notFound} from "next/navigation"; import {SiteHeader} from "@/components/navigation/SiteHeader"; import {MortgageCalculator} from "@/components/finance/MortgageCalculator"; import {BuyToLetCalculator} from "@/components/finance/BuyToLetCalculator"; import {FinanceEnquiryForm} from "@/components/finance/FinanceEnquiryForm"; import {PropertyMap} from "@/components/map/PropertyMap"; import {getProperty,prototypeProperties} from "@/lib/properties"; import {areaCenter} from "@/lib/areas"; import {getPropertyBySlug,mediaUrl} from "@/lib/propertiesDb";
const gbp=new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0});
export function generateStaticParams(){return prototypeProperties.map(p=>({slug:p.slug}))}
export const dynamicParams=true;

type View={id:string;title:string;area:string;price:number;bedrooms:number;bathrooms:number;type:string;status:string;description:string;photos:string[];lng:number;lat:number;prototype:boolean};

export default async function PropertyPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const db=await getPropertyBySlug(slug).catch(()=>null);
  let v:View|null=null;
  if(db){const c=areaCenter(db.area);v={id:db.id,title:db.title,area:db.area,price:db.price,bedrooms:db.bedrooms,bathrooms:db.bathrooms,type:db.propertyType,status:db.status,description:db.description,photos:db.photos.map(mediaUrl),lng:c.lng,lat:c.lat,prototype:false};}
  else{const p=getProperty(slug);if(p){const c=p.coordinates??areaCenter(p.area);v={id:p.id,title:p.title,area:p.area,price:p.price,bedrooms:p.bedrooms,bathrooms:p.bathrooms,type:p.type,status:p.status,description:p.description,photos:[],lng:c.lng,lat:c.lat,prototype:true};}}
  if(!v)notFound();
  const hero=v.photos[0];
  return <><SiteHeader/><main className="bg-[#0B0B0A] pb-24 pt-24">
    <section className="relative min-h-[68vh] px-5 md:px-12" style={hero?{backgroundImage:`linear-gradient(to top,rgba(11,11,10,.9),rgba(11,11,10,.25)),url(${hero})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:"radial-gradient(circle at 70% 30%,#4b3a22,#1d1d1b 45%,#0B0B0A)"}}>
      <div className="mx-auto flex min-h-[68vh] max-w-[1440px] flex-col justify-end pb-12"><p className="text-xs tracking-[.25em] text-[#D4AF37]">{v.prototype?"PROTOTYPE PROPERTY":"FOXY PROPERTY"} · {v.area.toUpperCase()}</p><h1 className="display mt-3 max-w-4xl text-5xl md:text-7xl">{v.title}</h1><p className="mt-5 text-2xl">{gbp.format(v.price)}</p></div>
    </section>
    {v.photos.length>1&&<section className="px-5 md:px-12"><div className="mx-auto mt-8 grid max-w-[1440px] grid-cols-2 gap-3 md:grid-cols-4">{v.photos.slice(1,5).map((src,i)=><div key={i} className="aspect-[4/3] overflow-hidden border border-white/10"><img src={src} alt="" className="h-full w-full object-cover"/></div>)}</div></section>}
    <section className="px-5 py-20 md:px-12"><div className="mx-auto max-w-[1200px]"><div className="grid gap-10 md:grid-cols-[1.4fr_.6fr]"><div><p className="text-xs tracking-[.2em] text-[#D4AF37]">PROPERTY OVERVIEW</p><h2 className="display mt-3 text-4xl">A PROPERTY IS MORE THAN A NUMBER.</h2><p className="mt-6 max-w-2xl leading-7 text-[#A7A29A]">{v.description}</p></div><div className="border-l border-white/10 pl-6 text-sm text-white/65"><p>{v.bedrooms} bedrooms</p><p className="mt-3">{v.bathrooms} bathrooms</p><p className="mt-3 capitalize">{v.type}</p><p className="mt-3">Status: {v.status.replaceAll("_"," ")}</p></div></div><div className="mt-20" id="location"><p className="text-xs tracking-[.2em] text-[#D4AF37]">LOCATION</p><h2 className="display mb-6 mt-3 text-4xl md:text-5xl">EXPLORE THE SETTING.</h2><PropertyMap points={[{slug,title:v.title,area:v.area,price:v.price,lng:v.lng,lat:v.lat}]} selectedSlug={slug} zoom={15} className="min-h-[460px]"/><p className="mt-3 text-xs tracking-[.14em] text-white/40">Tilt and rotate the 3D map. {v.prototype?"Prototype location — approximate area centre.":"Approximate area location."}</p></div><div className="mt-20"><p className="text-xs tracking-[.2em] text-[#D4AF37]">PROPERTY → FINANCE</p><h2 className="display mb-8 mt-3 text-4xl md:text-5xl">LOOK AT THE NUMBERS.</h2><MortgageCalculator initialPrice={v.price}/><div className="mt-12"><BuyToLetCalculator initialPrice={v.price}/></div><div className="mt-12"><FinanceEnquiryForm propertyId={v.id}/></div><Link href="/properties" className="mt-10 inline-block text-xs tracking-[.18em] text-[#D4AF37]">← BACK TO PROPERTIES</Link></div></div></section>
  </main></>;
}
