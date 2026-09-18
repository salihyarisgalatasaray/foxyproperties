import {defineQuery} from "next-sanity";
export const homepageQuery=defineQuery(`*[_type == "homepage"][0]{heroEyebrow,heroTitle,heroIntro,decisionTitle,decisionBody,primaryCtaLabel,primaryCtaHref}`);
export const areasQuery=defineQuery(`*[_type == "area"]|order(name asc){_id,name,slug,borough,description,center,marketData}`);
export const areaBySlugQuery=defineQuery(`*[_type == "area" && slug.current == $slug][0]{_id,name,slug,borough,description,center,marketData}`);
