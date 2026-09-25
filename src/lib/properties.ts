export type PropertyStatus = "AVAILABLE" | "COMING_SOON" | "UNDER_OFFER";
export type LatLng = { lat: number; lng: number };
export type Property = { id:string; slug:string; title:string; area:string; price:number; bedrooms:number; bathrooms:number; type:string; status:PropertyStatus; description:string; expectedMonthlyRent?:number; coordinates?:LatLng; prototype?:boolean };

// UI fixtures only. Replace with verified FOXY inventory before production.
export const prototypeProperties: Property[] = [
  { id:"prototype-chelsea-01", slug:"prototype-chelsea-residence", title:"Chelsea Residence", area:"Chelsea", price:1850000, bedrooms:2, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:6500, coordinates:{lat:51.4875,lng:-0.1687}, prototype:true, description:"A clearly labelled prototype record used to demonstrate the FOXY properties-detail experience. It is not a live property instruction or offer." },
  { id:"prototype-kensington-01", slug:"prototype-kensington-residence", title:"Kensington Residence", area:"Kensington", price:2400000, bedrooms:3, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:8000, coordinates:{lat:51.5009,lng:-0.1938}, prototype:true, description:"Prototype content for interface testing only. Replace with verified property data before production." },
  { id:"prototype-fulham-01", slug:"prototype-fulham-residence", title:"Fulham Residence", area:"Fulham", price:1250000, bedrooms:2, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:4500, coordinates:{lat:51.4749,lng:-0.2090}, prototype:true, description:"Prototype content for interface testing only. Replace with verified property data before production." }
];
export function getProperty(slug:string){return prototypeProperties.find(p=>p.slug===slug)}

export type PropertyMapPoint = { slug:string; title:string; area:string; price:number; lng:number; lat:number };
export function propertyMapPoints(list: Property[] = prototypeProperties): PropertyMapPoint[] {
  return list.filter(p=>p.coordinates).map(p=>({slug:p.slug,title:p.title,area:p.area,price:p.price,lng:p.coordinates!.lng,lat:p.coordinates!.lat}));
}
