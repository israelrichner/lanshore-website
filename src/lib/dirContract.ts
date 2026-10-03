/**
 * Texas DIR Cooperative Contract DIR-CPO-5160: everything the /dir-ai vendor
 * page publishes.
 *
 * The page is a contract obligation, not marketing. Appendix A section 7.2
 * of the contract requires it, DIR runs compliance checks against it, and
 * "If Successful Respondent does not meet the webpage requirements listed
 * above, DIR may cancel the Contract without penalty." The URL is the one
 * DIR has on file (lanshore.com/dir-ai); do not move it without giving DIR
 * written notice of the new URL first (Appendix A, Webpage Changes).
 *
 * Sources:
 * - Appendix C Pricing Index (products, services, units, discounts)
 * - Appendix D Service Agreement (ordering, invoicing)
 * - DIR contract page https://dir.texas.gov/contracts/dir-cpo-5160
 *   (scope, technologies, "no resellers")
 * - DIR Vendor Press Release Guidelines: never "partner with DIR",
 *   "approved vendor", or "the DIR".
 *
 * scripts/check-dir-page.mjs fails the build if any required element is
 * missing from the rendered page.
 */

export const DIR_CONTRACT = {
  number: "DIR-CPO-5160",
  solicitation: "DIR-CPO-TMP-441",
  title: "Artificial Intelligence (AI) Products and Services",
  contractUrl: "https://dir.texas.gov/contracts/dir-cpo-5160",
  cooperativeContractsUrl: "https://dir.texas.gov/cooperative-contracts",
  customerEligibilityUrl: "https://dir.texas.gov/it-solutions-and-services/customer-eligibility",
  /* As listed on DIR's contract page. */
  technologies: [
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Robotic Process Automation (RPA)",
    "Natural Language Processing (NLP)",
    "Computer Vision (CV)",
    "Digital Assistant (DA)",
  ],
};

/* The person customers contact for quotes and purchase orders under this
   contract. Appendix A 7.2 A(ii): name, telephone number and email. */
export const DIR_CONTACT = {
  name: "Doug Erb",
  email: "dougerb@lanshore.com",
  /* Required. check-dir-page.mjs fails the build if the page carries no
     working phone number. */
  phone: "832-466-8069",
};

/* Set to the official DIR logo file once received from DIR (the award email,
   or outreach@dir.texas.gov with subject "DIR Logo Request"). Never modify
   the logo, and never display it larger than the Lanshore logo
   (Appendix A, DIR and Customer Logos). */
export const DIR_LOGO: { src: string; width: number; height: number; alt: string } | null = null;

export type PriceLine = { name: string; description: string; unit: string; discount: string };

/* Appendix C, line for line. Names are the contract's own wording; the
   descriptions explain each line in plain terms without adding scope. */
export const DIR_PRODUCTS: PriceLine[] = [
  {
    name: "UiPath software",
    description:
      "UiPath robotic process automation platform licenses and subscriptions, at UiPath's published list price less its DIR discount.",
    unit: "Per license or subscription, as quoted",
    discount: "6.00%",
  },
];

export const DIR_SERVICE_GROUPS: { heading: string; intro: string; lines: PriceLine[] }[] = [
  {
    heading: "Managed RPA development",
    intro:
      "A single automation built, managed, supported and continuously improved by Lanshore for a fixed monthly fee, priced by the number of process steps it automates.",
    lines: [
      { name: "Single RPA development, 5 or fewer steps", description: "Includes management, support and continuous improvement.", unit: "Per month", discount: "7.00%" },
      { name: "Single RPA development, 6 to 12 steps", description: "Includes management, support and continuous improvement.", unit: "Per month", discount: "7.00%" },
      { name: "Single RPA development, more than 12 steps", description: "Includes management, support and continuous improvement.", unit: "Per month", discount: "10.00%" },
    ],
  },
  {
    heading: "RaaS bundles",
    intro: "Bundles of six RaaS automations, billed monthly, in three packages.",
    lines: [
      { name: "Bundle of 6 RaaS-01", description: "Six RaaS automations, package 01.", unit: "Per month", discount: "10.00%" },
      { name: "Bundle of 6 RaaS-02", description: "Six RaaS automations, package 02.", unit: "Per month", discount: "10.00%" },
      { name: "Bundle of 6 RaaS-03", description: "Six RaaS automations, package 03.", unit: "Per month", discount: "10.00%" },
    ],
  },
  {
    heading: "Certified developers and delivery roles",
    intro: "Lanshore professionals engaged by the hour under a Service Agreement (Appendix D).",
    lines: [
      { name: "Certified RPA developer, less than 1 year of experience", description: "Builds and maintains RPA automations.", unit: "Hour", discount: "5.00%" },
      { name: "Certified RPA developer, 1 to 3 years of experience", description: "Builds and maintains RPA automations.", unit: "Hour", discount: "5.00%" },
      { name: "Certified RPA developer, more than 3 years of experience", description: "Builds and maintains RPA automations.", unit: "Hour", discount: "5.00%" },
      { name: "Certified Microsoft Power Apps developer, less than 1 year of experience", description: "Builds Microsoft Power Platform applications and flows.", unit: "Hour", discount: "5.00%" },
      { name: "Certified Microsoft Power Apps developer, 1 to 3 years of experience", description: "Builds Microsoft Power Platform applications and flows.", unit: "Hour", discount: "5.00%" },
      { name: "Certified Microsoft Power Apps developer, more than 3 years of experience", description: "Builds Microsoft Power Platform applications and flows.", unit: "Hour", discount: "5.00%" },
      { name: "Project Manager, Level 1", description: "Plans and manages delivery of an engagement.", unit: "Hour", discount: "5.00%" },
      { name: "Project Manager, Level 2", description: "Plans and manages delivery of larger or multi-team engagements.", unit: "Hour", discount: "5.00%" },
      { name: "Scrum Master", description: "Runs agile delivery ceremonies and removes blockers for the team.", unit: "Hour", discount: "5.00%" },
      { name: "Business Analyst, Level 1", description: "Documents processes and requirements for automation and applications.", unit: "Hour", discount: "5.00%" },
      { name: "Business Analyst, Level 2", description: "Leads process analysis and requirements for complex or cross-department work.", unit: "Hour", discount: "5.00%" },
      { name: "Application Training", description: "Trains customer staff on delivered automations and applications.", unit: "Hour", discount: "5.00%" },
      { name: "Quality Analyst", description: "Tests automations and applications before release.", unit: "Hour", discount: "5.00%" },
      { name: "HTML Programmer", description: "Builds and maintains web front ends.", unit: "Hour", discount: "5.00%" },
      { name: "Microsoft Dynamics Programmer", description: "Configures and extends Microsoft Dynamics.", unit: "Hour", discount: "5.00%" },
      { name: "Microsoft Azure Full Stack Developer", description: "Builds applications and services on Microsoft Azure.", unit: "Hour", discount: "5.00%" },
    ],
  },
  {
    heading: "Document and case automation",
    intro: "Automated processing priced per unit processed.",
    lines: [
      { name: "Automated Document Management System", description: "Automated capture, classification and routing of documents.", unit: "Per document", discount: "5.00%" },
      { name: "Automated Case Management System", description: "Automated intake, tracking and routing of cases.", unit: "Per case", discount: "5.00%" },
      { name: "Intelligent Indexing services", description: "Automated extraction of index data from documents.", unit: "Per document", discount: "5.00%" },
    ],
  },
];

/* Drafted for owner approval: 30-day services warranty. Appendix A requires
   these to be Lanshore's then-currently published policies, no more
   restrictive or costly than for similarly situated customers. */
export const DIR_WARRANTY: string[] = [
  "Lanshore warrants that services provided under DIR-CPO-5160 will be performed in a professional and workmanlike manner, consistent with generally accepted industry standards, and will conform to the specifications in the applicable Service Agreement or statement of work.",
  "If a Customer notifies Lanshore in writing within thirty (30) calendar days after a service is performed or a deliverable is accepted that it does not conform to this warranty, Lanshore will correct or re-perform the non-conforming work at no additional charge. If Lanshore cannot correct it within a reasonable time, the Customer may request a refund or credit of the fees paid for the non-conforming portion.",
  "This warranty does not cover issues caused by changes made by anyone other than Lanshore, use outside the agreed specifications, changes to the Customer's systems, applications or data after acceptance, or defects in third-party software.",
  "UiPath software is covered by UiPath's own manufacturer warranty and license terms, which Lanshore passes through to the Customer. Lanshore will help the Customer submit any warranty claim to UiPath.",
  "These policies are no more restrictive or costly than those Lanshore offers to other similarly situated customers. Where they conflict with DIR-CPO-5160, the contract governs.",
];

export const DIR_RETURNS: string[] = [
  "Services are delivered and consumed as they are performed, so they cannot be returned. Services that do not meet the warranty above are corrected, re-performed, or refunded under the 30-day warranty.",
  "UiPath software may be returned only as permitted by UiPath's applicable license terms and return policy. Lanshore will submit the return request to UiPath on the Customer's behalf and pass through any refund or credit UiPath issues.",
  "To request a warranty correction or a return, contact the Lanshore contact for DIR-CPO-5160 listed on this page and reference the contract number and your purchase order number.",
];
