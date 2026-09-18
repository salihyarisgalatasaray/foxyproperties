export type PropertyStatus = "AVAILABLE" | "COMING_SOON" | "UNDER_OFFER";
export type Property = { id:string; slug:string; title:string; area:string; price:number; bedrooms:number; bathrooms:number; type:string; status:PropertyStatus; description:string; expectedMonthlyRent?:number; prototype?:boolean };

// UI fixtures only. Replace with verified FOXY inventory before production.
export const prototypeProperties: Property[] = [
  { id:"prototype-chelsea-01", slug:"prototype-chelsea-residence", title:"Chelsea Residence", area:"Chelsea", price:1850000, bedrooms:2, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:6500, prototype:true, description:"A clearly labelled prototype record used to demonstrate the FOXY property-detail experience. It is not a live property instruction or offer." },
  { id:"prototype-kensington-01", slug:"prototype-kensington-residence", title:"Kensington Residence", area:"Kensington", price:2400000, bedrooms:3, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:8000, prototype:true, description:"Prototype content for interface testing only. Replace with verified property data before production." },
  { id:"prototype-fulham-01", slug:"prototype-fulham-residence", title:"Fulham Residence", area:"Fulham", price:1250000, bedrooms:2, bathrooms:2, type:"Apartment", status:"COMING_SOON", expectedMonthlyRent:4500, prototype:true, description:"Prototype content for interface testing only. Replace with verified property data before production." }
];
export function getProperty(slug:string){return prototypeProperties.find(p=>p.slug===slug)}
