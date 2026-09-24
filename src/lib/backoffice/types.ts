export const clientStatuses = ["HOT", "WARM", "COLD"] as const;
export const appointmentStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export const offerStatuses = ["PENDING", "ACCEPTED", "REJECTED", "NEGOTIATING"] as const;

export type ClientRow = { id: string; full_name: string; phone: string | null; email: string | null; budget: string | null; preferred_areas: string | null; interest: string; status: string; notes: string | null; last_contact_at: string | null; created_at: string };
export type AppointmentRow = { id: string; client_name: string; phone: string | null; email: string | null; property_label: string; starts_at: string; agent: string | null; notes: string | null; status: string };
export type OfferRow = { id: string; property_label: string; client_name: string; amount: string; submitted_at: string; status: string; counter_notes: string | null };
export type CommissionRow = { id: string; property_label: string; client_name: string; deal_type: string; price: string; commission_pct: string; commission_amount: string; agent: string | null; completed_on: string };
