export type Area = {name:string;slug:string;region:string;borough:string;description:string;center:{lat:number;lng:number};marketData?:{averagePrice?:number;averageRent?:number;priceChange?:number;rentChange?:number;source:string;sourceUrl?:string;period:string;updatedAt:string;status:"CURRENT"|"PROVISIONAL"|"ESTIMATE"}};
// Prototype content only. Market figures intentionally omitted until sourced data is connected.
export const prototypeAreas: Area[] = [
 {name:"Chelsea",slug:"chelsea",region:"West London",borough:"Kensington and Chelsea",description:"A prototype area page demonstrating FOXY's location, property and finance journey.",center:{lat:51.4875,lng:-0.1687}},
 {name:"Kensington",slug:"kensington",region:"West London",borough:"Kensington and Chelsea",description:"Prototype area content for the London Intelligence interface.",center:{lat:51.5009,lng:-0.1938}},
 {name:"Fulham",slug:"fulham",region:"West London",borough:"Hammersmith and Fulham",description:"Prototype area content for the London Intelligence interface.",center:{lat:51.4749,lng:-0.2090}}
];
export const getArea=(slug:string)=>prototypeAreas.find(a=>a.slug===slug);
export const DEFAULT_CENTER={lat:51.4875,lng:-0.1687};
export const areaCenter=(name:string)=>prototypeAreas.find(a=>a.name.toLowerCase()===name.toLowerCase())?.center ?? DEFAULT_CENTER;
