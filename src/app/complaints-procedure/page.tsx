import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";

export const metadata = {
  title: "Complaints Procedure | FOXY Properties",
  description:
    "Complaints Procedure for FOXY Properties Ltd — how to make a complaint, our response times, and referral to The Property Ombudsman.",
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Our Commitment",
    body: (
      <>
        <strong className="text-white">FOXY Properties Ltd</strong> is committed to providing a high
        quality service to everyone we deal with. We take all complaints seriously, and we view them
        as an opportunity to learn, improve and put things right where they have gone wrong.
      </>
    ),
  },
  {
    h: "2. How to Make a Complaint",
    body: (
      <>
        If you wish to make a complaint, please contact us in writing by email at{" "}
        <a href="mailto:info@foxyproperties.co.uk" className="text-[#D4AF37] hover:text-white">
          info@foxyproperties.co.uk
        </a>
        . To help us investigate quickly, please include your{" "}
        <strong className="text-white">full name</strong>, your{" "}
        <strong className="text-white">contact details</strong>, and a{" "}
        <strong className="text-white">clear description of your complaint</strong>, including any
        relevant dates, references or supporting information.
      </>
    ),
  },
  {
    h: "3. What Happens Next",
    body: (
      <>
        We will acknowledge your complaint in writing within{" "}
        <strong className="text-white">3 working days</strong> of receiving it. We will then
        investigate the matter fully and provide a written response within{" "}
        <strong className="text-white">15 working days</strong>. If your complaint is particularly
        complex and requires more time, we will let you know and keep you informed of our progress
        until the matter is resolved.
      </>
    ),
  },
  {
    h: "4. If You Are Not Satisfied",
    body: (
      <>
        If you remain unsatisfied after receiving our final response, you may refer your complaint to{" "}
        <strong className="text-white">The Property Ombudsman (TPO)</strong>. You can do so via{" "}
        <a
          href="https://www.tpos.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D4AF37] hover:text-white"
        >
          www.tpos.co.uk
        </a>{" "}
        within <strong className="text-white">12 months</strong> of the date of our final response
        letter. The Property Ombudsman provides a free, independent service for resolving disputes.
      </>
    ),
  },
  {
    h: "5. Record Keeping",
    body: (
      <>
        All complaints are logged, tracked and reviewed internally. We use this information to
        monitor the quality of our service, identify recurring issues and make improvements, so that
        we can continue to deliver a high standard of service to our clients.
      </>
    ),
  },
  {
    h: "6. Contact Details",
    body: (
      <>
        <strong className="text-white">FOXY Properties Ltd</strong>
        <br />
        Email:{" "}
        <a href="mailto:info@foxyproperties.co.uk" className="text-[#D4AF37] hover:text-white">
          info@foxyproperties.co.uk
        </a>
      </>
    ),
  },
];

export default function ComplaintsProcedurePage() {
  return (
    <main className="bg-[#0B0B0A] text-[#F4F0E8]">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-5 pb-8 pt-36 md:px-12">
        <p className="text-xs tracking-[.32em] text-[#D4AF37]">LEGAL</p>
        <h1 className="display mt-6 text-4xl leading-[1.05] md:text-6xl">Complaints Procedure</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          We are committed to providing a high quality service. This procedure explains how to raise
          a complaint with FOXY Properties Ltd and what you can expect from us.
        </p>
        <p className="mt-4 text-xs tracking-[.14em] text-white/40">LAST UPDATED · JUNE 2026</p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-28 md:px-12" data-testid="complaints-content">
        <div className="divide-y divide-white/10">
          {SECTIONS.map((s) => (
            <div key={s.h} className="py-9">
              <h2 className="display text-xl text-[#D4AF37] md:text-2xl">{s.h}</h2>
              <p className="mt-4 text-sm leading-8 text-[#C9C4BB] md:text-[15px]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-white/12 bg-[#141413] p-6 text-xs leading-6 text-white/45">
          This Complaints Procedure is provided for general information and does not form part of any
          property, tenancy, finance or agency contract. FOXY Properties Investors Ltd is not
          currently FCA authorised.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
