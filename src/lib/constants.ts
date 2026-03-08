export const SITE = {
  name:     "AFTAZA PLC",
  tagline:  "Transaction Governance & Commercialization Systems",
  phone:    "+251 912 370 417",
  email:    "info@aftazaplc.com",
  address:  "Kirkos, Addis Ababa, Ethiopia",
  whatsapp: "https://wa.me/251912370417?text=Hello%20AFTAZA%20PLC%2C%20I%20would%20like%20to%20discuss%20a%20structured%20real%20estate%20advisory%20engagement.",
  telegram: "https://t.me/aftazaplc",
  call:     "tel:+251912370417",
};

export const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  {
    label: "Services",
    href:  "/services",
    children: [
      { label: "Developer Commercialization", href: "/services/developer-commercialization", desc: "Full-stack sales & go-to-market systems" },
      { label: "Buyer Advisory",              href: "/services/buyer-advisory",              desc: "Safe, verified property acquisition" },
      { label: "Investor Structuring",        href: "/services/investor-enablement",         desc: "Investment-grade documentation" },
      { label: "Transaction Governance",      href: "/services/transaction-governance",      desc: "Compliance-first transaction protocols" },
      { label: "Media & Market Education",    href: "/services/media-education",             desc: "Institutional narrative engineering" },
    ],
  },
  {
    label: "Ecosystem",
    href:  "/ecosystem",
    children: [
      { label: "Developers",             href: "/ecosystem#developers",  desc: "Structured commercialization systems" },
      { label: "Buyers",                 href: "/ecosystem#buyers",      desc: "Governed transaction pathways" },
      { label: "Investors",              href: "/ecosystem#investors",   desc: "Risk-screened opportunities" },
      { label: "Financiers",             href: "/ecosystem#financiers",  desc: "Transaction-aligned documentation" },
      { label: "Institutional Partners", href: "/ecosystem#partners",    desc: "Integrated ecosystem collaboration" },
    ],
  },
  {
    label: "Intelligence",
    href:  "/intelligence",
    children: [
      { label: "Methodology",          href: "/intelligence/methodology",         desc: "Governance-driven advisory framework" },
      { label: "Media & Market",       href: "/intelligence/media-market-education", desc: "Narrative engineering for absorption" },
      { label: "Insights Hub",         href: "/intelligence/insights",            desc: "Institutional intelligence & analysis" },
    ],
  },
  { label: "Properties",   href: "/properties" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact",      href: "/contact" },
];
