import type { Solution } from "./types";

const solution: Solution = {
  slug: "revenue-teams",
  hubspotId: "195401767",
  name: "Sales Performance Management for Revenue Teams",
  titleTag: "Sales Performance Management for Revenue Teams | Lanshore",
  metaDescription:
    "How Lanshore gives revenue teams near real-time quota attainment, rep earnings visibility, and forecast inputs from the SPM platform they already run.",
  firstSentence:
    "Sales performance management for revenue teams means CROs, sales leaders, and reps can see quota attainment, earnings, and comp spend while there is still time in the period to act. Lanshore, a services firm that implements and operates SPM platforms, delivers this through its Executive Dashboards pillar: an AI layer over your SPM platform, CRM, and planning data that answers questions in plain language, with sources.",
  whoItIsFor:
    "CROs, VPs of sales, frontline sales managers, and RevOps leads at companies that already run an SPM platform, or are about to, but still route most questions about attainment and earnings through an analyst. It also serves finance leaders who need accrual numbers they can trust before close, and reps who want to know what they have earned without waiting for a statement. Lanshore does not sell SPM software; it works with the platform you own, or helps you choose one.",
  problems: [
    {
      title: "Attainment that arrives a month late",
      body: "In many comp stacks, quota attainment is only trustworthy after the monthly calculation run closes. By then, the quarter is half over and territory or coverage decisions have already been made on last month's numbers. Sales leaders need attainment and pacing by rep, team, and territory during the period, refreshed from the same data the platform calculates on, so a struggling territory gets attention mid-quarter instead of at the quarterly review.",
    },
    {
      title: "Reps who cannot see what they have earned",
      body: "When reps cannot see their attainment and estimated earnings until a statement lands, they build shadow spreadsheets to check the numbers, and every disagreement becomes an email to comp operations. Visibility changes behavior only if reps can see where they stand against quota and accelerators while there is still time to close another deal, and can trace each statement line back to a deal and a plan clause.",
    },
    {
      title: "Every leadership question becomes a ticket",
      body: "Which territories are pacing under quota? Are we overspending on comp relative to attainment? Each question becomes an analyst request with a multi-day turnaround, and by the time the answer arrives the next question has replaced it. RevOps spends its week producing ad hoc reports instead of improving plan design.",
    },
    {
      title: "Forecast and comp numbers that do not agree",
      body: "Pipeline lives in the CRM, attainment lives in the SPM platform, and accruals live in finance. When the three disagree, forecast calls turn into arguments about which number is right, and the CFO books comp liability from a model nobody in sales recognizes. Projected attainment, accelerator exposure, and comp spend should come from one unified model, so the forecast conversation is about deals, not data.",
    },
    {
      title: "Crediting errors found at statement time",
      body: "Attainment outliers are often crediting problems, not performance: a missing split, or accounts that moved territories without a crediting update. Found at statement time, they become disputes and erode trust in the plan. Found mid-period, they are a correction. Anomaly flags on attainment spikes, calculation drift, and outlier payouts give managers and comp operations time to fix the data before anyone is paid on it.",
    },
  ],
  howWeDeliver: [
    {
      title: "Start from the decisions, not the reports",
      body: "We interview the CRO, sales leaders, finance, and RevOps to list the decisions each makes weekly and the numbers those decisions depend on. That list, not a catalogue of standard reports, defines what the dashboard must answer and which data it needs. Roles see different views: attainment against comp spend for the CRO, rep and territory outliers for sales leaders, accrual confidence for finance.",
    },
    {
      title: "Make sure the platform data is right",
      body: "An AI layer amplifies whatever it is pointed at. Before building visibility on top of your SPM platform, we check that plan logic, crediting hierarchies, and the roster are correct and current. Where they are not, we fix them first, drawing on Lanshore's implementation and operations work on Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate.",
    },
    {
      title: "Unify comp, CRM, and planning data",
      body: "We build one data model across your SPM platform, your CRM (such as Salesforce, HubSpot, or Zoho), and structured spreadsheets or data warehouse tables, with a refresh schedule agreed for each source. Attainment, pipeline, and comp spend then come from the same numbers, so quota pacing, forecast inputs, and accrual projections reconcile instead of competing.",
    },
    {
      title: "Add the AI layer and the alerts",
      body: "Leaders ask questions in plain language and get a current answer with its sources named. Anomaly flags surface attainment spikes, calculation drift, and outlier payouts before statements release, and scheduled briefs send a Monday summary to leadership without an analyst assembling it. Your data stays in your environment: the AI layer queries it and does not train on it.",
    },
    {
      title: "Give reps a view of their own",
      body: "Where the platform's rep portal stops short, Lanshore's Custom Apps pillar adds a rep view: current attainment, earnings from the latest calculation run, and statement lines traced to the deal, the plan clause, and the run that produced them. An inquiry bot answers statement questions from plan logic and data, and escalates anything unresolved to comp operations with the context attached.",
    },
    {
      title: "Deliver on real data, then refine",
      body: "Most engagements deliver a working executive dashboard against real data in four to six weeks. After launch we add questions, sources, and alerts as leaders use it, and Lanshore can support the data model and the platform underneath as a managed service.",
    },
  ],
  platforms: ["varicent", "xactly", "captivateiq", "salesforce-spiff", "anaplan"],
  relatedCaseStudies: ["spm-build-on-existing-systems", "rpa-sales-territory-tracking"],
  related: [
    { label: "Executive Dashboards live demo", href: "/agentic-spm/executive-dashboards/demo" },
    { label: "The Complete Guide to SPM Alignment for Quota Accuracy", href: "/resources/guides/spm-alignment-quota-accuracy" },
    { label: "How SPM affects quota attainment", href: "/blog/how-spm-affects-quota-attainment" },
  ],
  faq: [
    {
      question: "What should a CRO be able to see from sales performance management?",
      answer:
        "At minimum: quota attainment and pacing by team and territory during the period, comp spend against plan, projected attainment and accelerator exposure for the quarter, and outliers that need attention. Each number should come from the same data the SPM platform calculates on, so it holds up when finance and sales compare notes.",
    },
    {
      question: "Does Lanshore sell SPM software?",
      answer:
        "No. Lanshore is a services firm. It implements and operates SPM platforms such as Varicent, Xactly, CaptivateIQ, and Salesforce Spiff, and builds AI dashboards and agents on top of them, but it resells none of the platforms. If you have not chosen a platform yet, Lanshore runs a platform-agnostic assessment.",
    },
    {
      question: "How does SPM support sales forecasting?",
      answer:
        "SPM supplies the comp side of the forecast: attainment to date, quota by rep and territory, and the payout and accelerator exposure that a given finish implies. Combined with CRM pipeline in one model, those inputs let leaders see projected attainment and comp cost together. Lanshore connects these sources; it does not replace your forecasting tool or the forecasting features in platforms such as Xactly.",
    },
    {
      question: "Can reps see their earnings before statements are released?",
      answer:
        "They can see attainment and estimated earnings from the latest calculation run, clearly labeled as estimates until statements are approved. Whether that view lives in the SPM platform's own rep portal or in a custom rep app depends on what your platform provides and how your plans are structured.",
    },
    {
      question: "Is our comp data used to train AI models?",
      answer:
        "No. Your data stays in your environment. The AI layer in Lanshore's Executive Dashboards queries your comp, CRM, and planning data to answer questions; it does not train on it.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;
