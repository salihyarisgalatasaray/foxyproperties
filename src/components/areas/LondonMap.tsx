"use client";
import {useEffect,useRef} from "react";
import type {Area} from "@/lib/areas";
import "mapbox-gl/dist/mapbox-gl.css";
export function LondonMap({areas,selectedSlug}:{areas:Area[];selectedSlug?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{let map:any;let disposed=false;(async()=>{
   const token=process.env.NEXT_PUBLIC_MAPBOX_TOKEN;if(!token||!ref.current)return;
   const mapboxgl=(await import("mapbox-gl")).default;mapboxgl.accessToken=token;
   map=new mapboxgl.Map({container:ref.current,style:"mapbox://styles/mapbox/dark-v11",center:[-0.18,51.49],zoom:11});
   map.on("load",()=>{if(disposed)return;map.addSource("foxy-areas",{type:"geojson",data:{type:"FeatureCollection",features:areas.map(a=>({type:"Feature",geometry:{type:"Point",coordinates:[a.center.lng,a.center.lat]},properties:{name:a.name,slug:a.slug,selected:a.slug===selectedSlug}}))}});map.addLayer({id:"foxy-area-points",type:"circle",source:"foxy-areas",paint:{"circle-radius":["case",["==",["get","selected"],true],10,7],"circle-color":"#D4AF37","circle-stroke-color":"#F4F0E8","circle-stroke-width":1}});});
 })();return()=>{disposed=true;map?.remove()};},[areas,selectedSlug]);
 if(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN)return <div className="grid min-h-[420px] place-items-center border border-white/10 bg-[#141413] p-8 text-center text-[#A7A29A]">Map preview activates when NEXT_PUBLIC_MAPBOX_TOKEN is configured. Area navigation remains available without the map.</div>;
 return <div ref={ref} className="min-h-[520px] w-full overflow-hidden rounded-sm" aria-label="Interactive London area map"/>;
}
