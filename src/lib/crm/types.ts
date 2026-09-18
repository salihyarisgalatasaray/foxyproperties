export const leadStatuses = ["NEW","CONTACTED","QUALIFIED","VIEWING","OFFER","COMPLETED"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export type LeadRow = { id:string; type:string; source:string; status:LeadStatus; name:string; email:string; phone:string|null; message:string|null; marketing_consent:boolean; created_at:string; updated_at:string };
export type ActivityRow = { id:string; action:string; metadata:unknown; created_at:string };
