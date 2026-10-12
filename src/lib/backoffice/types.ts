export const clientStatuses = ["HOT", "WARM", "COLD"] as const;
export const appointmentStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export const offerStatuses = ["PENDING", "ACCEPTED", "REJECTED", "NEGOTIATING"] as const;
export const enquiryTypes = { BUY: "Buy a Property", SELL: "Sell a Property", INVESTMENT: "Investment", LETTINGS: "Lettings", PROPERTY_MANAGEMENT: "Property Management", GENERAL: "General Enquiry" } as const;
export type EnquiryType = keyof typeof enquiryTypes;
export const enquiryStatuses = { NEW: "Unread", READ: "Read", IN_PROGRESS: "In Progress", RESOLVED: "Resolved" } as const;
export type EnquiryRow = { id: string; full_name: string; email: string; phone: string; enquiry_type: EnquiryType; message: string; status: keyof typeof enquiryStatuses; created_at: string };
export type UserRow = { id: string; name: string; email: string; role: string; active: boolean; created_at: string };

export type ClientRow = { id: string; full_name: string; phone: string | null; email: string | null; budget: string | null; preferred_areas: string | null; interest: string; status: string; notes: string | null; last_contact_at: string | null; created_at: string };
export type AppointmentRow = { id: string; client_name: string; phone: string | null; email: string | null; property_label: string; starts_at: string; agent: string | null; notes: string | null; status: string };
export type OfferRow = { id: string; property_label: string; client_name: string; amount: string; submitted_at: string; status: string; counter_notes: string | null };
export type CommissionRow = { id: string; property_label: string; client_name: string; deal_type: string; price: string; commission_pct: string; commission_amount: string; agent: string | null; completed_on: string };
