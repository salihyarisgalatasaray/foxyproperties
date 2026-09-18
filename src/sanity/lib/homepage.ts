import "server-only";import {client} from "./client";import {homepageQuery} from "./queries";
export type HomepageContent={heroEyebrow?:string;heroTitle?:string;heroIntro?:string;decisionTitle?:string;decisionBody?:string;primaryCtaLabel?:string;primaryCtaHref?:string};
export async function getHomepage():Promise<HomepageContent|null>{if(!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID||!process.env.NEXT_PUBLIC_SANITY_DATASET)return null;try{return await client.fetch(homepageQuery)}catch{return null}}
