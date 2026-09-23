import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";

export const metadata = {
  title: "About FOXY | FOXY Property",
  description:
    "FOXY Property Investors Ltd — premium London property, investment, finance, lettings and management.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="ABOUT FOXY"
        title="LONDON PROPERTY, END TO END."
        intro="FOXY Property Investors Ltd brings together buying, selling, investment, finance, lettings and management under one considered, premium approach."
        image="https://images.pexels.com/photos/18252853/pexels-photo-18252853.jpeg?auto=compress&cs=tinysrgb&w=2000"
        concept
        ctas={[{ label: "BOOK A CONSULTATION", href: "/contact", primary: true }]}
      />

      <section className="mx-auto max-w-3xl px-5 py-24 md:px-12">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">OUR APPROACH</p>
        <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
          CONSIDERED, NOT GENERIC.
        </h2>
        <div className="mt-8 space-y-6 text-base leading-8 text-[#A7A29A]">
          <p>
            FOXY exists to support every stage of the property journey in London — discover, buy,
            invest, finance, let, manage, monitor and sell — with one premium visual and service
            language rather than a set of disconnected products.
          </p>
          <p>
            We believe a property is more than a number. We help clients understand the property, the
            location and the numbers before they act, and we present figures as illustrative estimates
            rather than promises.
          </p>
          <p>
            We do not publish invented statistics, testimonials, awards, partnerships or credentials.
            Regulatory memberships, protection schemes and fees are shown publicly only once verified
            details are in place.
          </p>
        </div>

        <div className="mt-10 border border-white/15 bg-[#141413] p-6 text-xs leading-6 text-white/50">
          FOXY Property Investors Ltd is not currently FCA authorised and does not present itself as an
          independent mortgage adviser or whole-of-market broker. Nothing on this site constitutes
          financial, tax or legal advice.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
