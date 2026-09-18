// Sanity Studio schema for the FOXY homepage singleton.
// Consumed by the separately-deployed Sanity Studio (see README). Written as a
// plain schema object — mirroring schemaTypes/area.ts — so the website repo does
// not need the full `sanity` Studio SDK installed to type-check and build.
export const homepage = {
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string", initialValue: "LONDON PROPERTY · DIFFERENTLY" },
    { name: "heroTitle", title: "Hero title", type: "string", initialValue: "YOUR NEXT PROPERTY DECISION STARTS HERE." },
    { name: "heroIntro", title: "Hero introduction", type: "text", rows: 2, initialValue: "London property. Strategic investment. Long-term thinking." },
    { name: "decisionTitle", title: "Decision section title", type: "string", initialValue: "A PROPERTY IS MORE THAN A NUMBER." },
    { name: "decisionBody", title: "Decision section body", type: "text", rows: 3 },
    { name: "primaryCtaLabel", title: "Primary CTA label", type: "string", initialValue: "EXPLORE PROPERTIES" },
    { name: "primaryCtaHref", title: "Primary CTA URL", type: "string", initialValue: "/properties" },
  ],
};
