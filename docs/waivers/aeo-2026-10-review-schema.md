# Waiver: Review / AggregateRating schema on /spm/compare

- **Date:** 2026-10-01
- **Author:** Israel Richner (owner)
- **Scope:** `src/app/spm/compare/page.tsx`, `src/lib/schema.ts`
- **Gate waived:** review-gap (HubSpot AEO recommendation 255732040, "Add Review structured data to review pages", MEDIUM)
- **Reason:**
  The recommendation asks for `Review` or `AggregateRating` markup on
  `/spm/compare`. The page contains no reviews and no ratings. It is a
  vendor-neutral feature comparison, and Lanshore resells none of the nine
  platforms on it, which is the stated basis of its credibility.

  Emitting rating markup would mean publishing structured data asserting
  ratings that do not exist. That violates Google's structured data policy
  (markup must represent content visible on the page) and, because the page
  compares commercial software, raises an FTC endorsement-guidance problem.

  The recommendation itself is conditional: "Only add Review / AggregateRating
  where real ratings exist or can be legitimately provided. Do not fabricate
  ratings. If the compare page is a feature comparison rather than a rated
  review, consider ItemList plus Product schema for each vendor instead and
  note that decision." Skipping it is therefore compliance with the
  recommendation, not a departure from it. This file is that note.
- **Residual risk:**
  Low. The extractable structure the recommendation was after now ships as
  `SoftwareApplication` nodes inside the existing `ItemList`: product identity,
  vendor, former names, description, and feature list for all nine platforms.
  What is missing relative to the literal ask is star-rating rich-result
  eligibility, which the page is not entitled to.

  Expected Rich Results Test outcome (unverified, run once to confirm): to the
  best of our reading, Google's Software App rich result requires `offers`
  plus `aggregateRating` or `review`. If the test detects the nine nodes as
  Software App candidates, it will report them as ineligible for that rich
  result for exactly the reasons above. That is the intended outcome of this
  waiver, not a defect: the nodes still parse as valid schema.org (check with
  validator.schema.org), and the WP5 acceptance check is "no errors in
  validator.schema.org; Rich Results Test findings limited to the missing
  rating/offer fields this waiver covers".
- **Follow-up:**
  Revisit only if Lanshore publishes a genuine, attributable rating corpus for
  these platforms (for example a scored evaluation methodology with published
  criteria and results). At that point `Review` with a named `author` and a
  stated `reviewRating` scale would be both accurate and permitted.
- **Expiry:** No expiry. Revisit on the event above.
