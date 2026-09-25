import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";

export const metadata = {
  title: "Privacy Policy | FOXY Properties",
  description:
    "Privacy Policy for the FOXY Properties website — what data we collect, how we use it, cookies, your UK GDPR rights and third-party services.",
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Company Details",
    body: (
      <>
        This website is operated by <strong className="text-white">FOXY Properties</strong>. We are
        the data controller responsible for your personal data. If you have any questions about this
        Privacy Policy or how we handle your data, you can contact us at{" "}
        <a href="mailto:info@foxyproperties.co.uk" className="text-[#D4AF37] hover:text-white">
          info@foxyproperties.co.uk
        </a>
        .
      </>
    ),
  },
  {
    h: "2. What Data We Collect",
    body: (
      <>
        We collect the personal data you choose to provide through our contact and consultation
        forms. This typically includes your <strong className="text-white">name</strong>,{" "}
        <strong className="text-white">email address</strong>,{" "}
        <strong className="text-white">phone number</strong> and the{" "}
        <strong className="text-white">details of your enquiry</strong> (such as the property, area
        or service you are interested in). We only ask for the information we need to respond to you.
      </>
    ),
  },
  {
    h: "3. How We Use Your Data",
    body: (
      <>
        We use your personal data to respond to your property enquiries, to arrange and schedule
        viewings and consultations, and — where you have agreed — to send you relevant property and
        market updates. We do not use your data for automated decision-making, and we only send
        marketing communications where you have given your consent.
      </>
    ),
  },
  {
    h: "4. Data Storage & Security",
    body: (
      <>
        Your personal data is stored securely and access is restricted to authorised personnel only.
        We take appropriate technical and organisational measures to protect it against unauthorised
        access, loss or misuse. We <strong className="text-white">never sell</strong> your personal
        data to third parties. We retain your data only for as long as necessary to fulfil the
        purposes described in this policy or to meet legal obligations.
      </>
    ),
  },
  {
    h: "5. Cookies",
    body: (
      <>
        This website uses cookies to enable core functionality (such as remembering your language
        preference) and to help us understand how the site is used through analytics. You can control
        or disable cookies through your browser settings, although some parts of the website may not
        function as intended if you do so.
      </>
    ),
  },
  {
    h: "6. Your Rights Under UK GDPR",
    body: (
      <>
        Under the UK General Data Protection Regulation (UK GDPR), you have the right to access,
        correct, update or request deletion of your personal data, as well as the right to object to
        or restrict certain processing and to withdraw consent at any time. To exercise any of these
        rights, please contact us at{" "}
        <a href="mailto:info@foxyproperties.co.uk" className="text-[#D4AF37] hover:text-white">
          info@foxyproperties.co.uk
        </a>
        . You also have the right to lodge a complaint with the Information Commissioner&apos;s Office
        (ICO).
      </>
    ),
  },
  {
    h: "7. Third-Party Services",
    body: (
      <>
        We use trusted third-party services to provide certain features of this website, including{" "}
        <strong className="text-white">Google Maps</strong> and{" "}
        <strong className="text-white">Mapbox</strong> for interactive maps. These providers may
        process limited technical data (such as your IP address) in accordance with their own privacy
        policies. We recommend reviewing their policies to understand how they handle your data.
      </>
    ),
  },
  {
    h: "8. Changes to This Policy",
    body: (
      <>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        for legal reasons. The latest version will always be available on this page, and any changes
        take effect as soon as they are posted. We encourage you to review this policy periodically.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#0B0B0A] text-[#F4F0E8]">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-5 pb-8 pt-36 md:px-12">
        <p className="text-xs tracking-[.32em] text-[#D4AF37]">LEGAL</p>
        <h1 className="display mt-6 text-4xl leading-[1.05] md:text-6xl">Privacy Policy</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          This Privacy Policy explains what personal data FOXY Properties collects through this
          website, how we use it, and the rights you have over your data.
        </p>
        <p className="mt-4 text-xs tracking-[.14em] text-white/40">LAST UPDATED · JUNE 2026</p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-28 md:px-12" data-testid="privacy-content">
        <div className="divide-y divide-white/10">
          {SECTIONS.map((s) => (
            <div key={s.h} className="py-9">
              <h2 className="display text-xl text-[#D4AF37] md:text-2xl">{s.h}</h2>
              <p className="mt-4 text-sm leading-8 text-[#C9C4BB] md:text-[15px]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-white/12 bg-[#141413] p-6 text-xs leading-6 text-white/45">
          This Privacy Policy is provided for general information about how this website handles
          personal data and does not form part of any property, tenancy, finance or agency contract.
          FOXY Properties Investors Ltd is not currently FCA authorised.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
