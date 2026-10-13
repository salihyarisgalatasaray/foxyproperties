-- WhatsApp contact form leads are stored as enquiries of type WHATSAPP.
ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS enquiries_enquiry_type_check;
ALTER TABLE enquiries ADD CONSTRAINT enquiries_enquiry_type_check
  CHECK (enquiry_type IN ('BUY','SELL','INVESTMENT','LETTINGS','PROPERTY_MANAGEMENT','GENERAL','WHATSAPP'));
