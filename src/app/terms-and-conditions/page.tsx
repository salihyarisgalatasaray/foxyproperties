import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";

export const metadata = {
  title: "Terms & Conditions | FOXY Properties",
  description:
    "Terms and Conditions for the FOXY Properties website — use of website, property listings, liability and governing law.",
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Company Details",
    body: (
      <>
        This website is operated by <strong className="text-white">FOXY Properties</strong>. If you
        have any questions about these Terms and Conditions, you can contact us at{" "}
        <a href="mailto:info@foxyproperties.co.uk" className="text-[#D4AF37] hover:text-white">
          info@foxyproperties.co.uk
        </a>
        . By accessing or using this website, you agree to be bound by these Terms and Conditions.
      </>
    ),
  },
  {
    h: "2. Use of Website",
    body: (
      <>
        This website is provided for general informational purposes only. All property listings and
        information are subject to availability and may change or be withdrawn at any time without
        notice. Nothing on this website constitutes an offer, financial, legal or tax advice, or a
        binding commitment of any kind.
      </>
    ),
  },
  {
    h: "3. Property Listings",
    body: (
      <>
        All property listings displayed on this website are provided for marketing purposes only.
        While we aim to keep information accurate and up to date, FOXY Properties does not guarantee
        the accuracy, completeness or currency of any listing details, measurements, images or
        figures. You should independently verify all information before relying on it or entering
        into any transaction.
      </>
    ),
  },
  {
    h: "4. Consultation & Viewings",
    body: (
      <>
        Booking a consultation or arranging a viewing through this website does not constitute a
        reservation of a property, nor an agreement, offer or commitment to purchase, rent or let any
        property. Any such agreement is only formed through a separate, formal contract entered into
        with the relevant parties.
      </>
    ),
  },
  {
    h: "5. Intellectual Property",
    body: (
      <>
        All content on this website — including text, graphics, images, logos, branding, design and
        layout — is the property of FOXY Properties or its licensors and is protected by applicable
        intellectual property laws. You may not copy, reproduce, distribute, republish or otherwise
        use any part of this website without our prior written permission.
      </>
    ),
  },
  {
    h: "6. Limitation of Liability",
    body: (
      <>
        To the fullest extent permitted by law, FOXY Properties shall not be liable for any loss or
        damage, whether direct, indirect, incidental or consequential, arising from your use of, or
        inability to use, this website, or from any reliance placed on property information or other
        content displayed on it. Nothing in these terms excludes or limits liability that cannot be
        excluded or limited under applicable law.
      </>
    ),
  },
  {
    h: "7. Third-Party Links",
    body: (
      <>
        This website may contain links to third-party websites for your convenience. These sites are
        not under our control, and FOXY Properties is not responsible for the content, accuracy,
        availability or practices of any third-party website. The inclusion of any link does not
        imply endorsement.
      </>
    ),
  },
  {
    h: "8. Governing Law",
    body: (
      <>
        These Terms and Conditions, and any dispute or claim arising out of or in connection with
        them or their subject matter, are governed by and construed in accordance with the laws of
        England and Wales, and are subject to the exclusive jurisdiction of the courts of England and
        Wales.
      </>
    ),
  },
  {
    h: "9. Changes to These Terms",
    body: (
      <>
        FOXY Properties reserves the right to update, amend or replace these Terms and Conditions at
        any time and without prior notice. Any changes take effect as soon as they are posted on this
        website. Your continued use of the website following any changes constitutes your acceptance
        of the revised terms.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#0B0B0A] text-[#F4F0E8]">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-5 pb-8 pt-36 md:px-12">
        <p className="text-xs tracking-[.32em] text-[#D4AF37]">LEGAL</p>
        <h1 className="display mt-6 text-4xl leading-[1.05] md:text-6xl">Terms &amp; Conditions</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          Please read these Terms and Conditions carefully before using the FOXY Properties website.
          By accessing or using this website, you agree to be bound by them.
        </p>
        <p className="mt-4 text-xs tracking-[.14em] text-white/40">LAST UPDATED · JUNE 2026</p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-28 md:px-12" data-testid="terms-content">
        <div className="divide-y divide-white/10">
          {SECTIONS.map((s) => (
            <div key={s.h} className="py-9">
              <h2 className="display text-xl text-[#D4AF37] md:text-2xl">{s.h}</h2>
              <p className="mt-4 text-sm leading-8 text-[#C9C4BB] md:text-[15px]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-white/12 bg-[#141413] p-6 text-xs leading-6 text-white/45">
          These Terms and Conditions are provided for general information about the use of this
          website and do not form part of any property, tenancy, finance or agency contract. FOXY
          Properties Investors Ltd is not currently FCA authorised.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
