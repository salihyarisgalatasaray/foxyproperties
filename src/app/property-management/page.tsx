import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { JourneyRail } from "@/components/site/JourneyRail";
import { ManagementSlider } from "@/components/management/ManagementSlider";
import { LeadForm } from "@/components/lead/LeadForm";

export const metadata = {
  title: "Property Management | FOXY Property",
  description: "Your property, our attention. Professional London property management with FOXY.",
};

export default function PropertyManagementPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="PROPERTY MANAGEMENT"
        title="YOUR PROPERTY. OUR ATTENTION."
        intro="A management service that follows your property through every stage of the letting lifecycle — with clear reporting and considered care."
        image="https://images.pexels.com/photos/20277194/pexels-photo-20277194.jpeg?auto=compress&cs=tinysrgb&w=2000"
        concept
        ctas={[
          { label: "BUILD MY MANAGEMENT PLAN", href: "#options", primary: true },
          { label: "GET A RENTAL VALUATION", href: "/landlords#valuation" },
        ]}
      />

      <JourneyRail
        eyebrow="THE MANAGEMENT LIFECYCLE"
        heading="ONE PROPERTY, MANAGED THROUGH EVERY STAGE."
        testid="management-timeline"
        steps={[
          { title: "VALUATION", body: "A considered rental appraisal to set the right strategy." },
          { title: "MARKETING", body: "Premium presentation to reach the right tenants." },
          { title: "TENANT", body: "Enquiry handling, viewings and referencing." },
          { title: "TENANCY", body: "Compliant tenancy setup and deposit handling." },
          { title: "RENT", body: "Rent collection with clear arrears monitoring." },
          { title: "MANAGEMENT", body: "Day-to-day point of contact for your tenancy." },
          { title: "MAINTENANCE", body: "Coordinated repairs and trusted contractors." },
          { title: "INSPECTIONS", body: "Periodic inspections and condition reporting." },
          { title: "REPORTING", body: "Transparent landlord statements and updates." },
          { title: "REVIEW", body: "Regular review of rent, strategy and options." },
        ]}
      />

      <ManagementSlider />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:px-12">
        <div>
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">MANAGEMENT REVIEW</p>
          <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
            REQUEST A MANAGEMENT REVIEW.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
            Tell us about your property and how much you would like us to handle. We will recommend
            information for your review — without quoting fees before we understand your property.
          </p>
        </div>
        <LeadForm
          type="MANAGEMENT"
          source="MANAGEMENT_REVIEW"
          title="REQUEST A MANAGEMENT REVIEW"
          submitLabel="REQUEST A MANAGEMENT REVIEW"
          testid="management-review-form"
          extraFields={[
            { name: "postcode", label: "Property postcode", required: true },
            { name: "ptype", label: "Property type" },
            { name: "beds", label: "Bedrooms" },
            { name: "level", label: "Preferred service level" },
          ]}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
