---
title: 'Why Legacy SPM Breaks Global Sales Teams'
description: >-
  Why legacy SPM breaks global sales teams: multi-currency and multi-entity complexity, local plan variants, rigid data models, batch timing, weak audit trails.
datePublished: '2026-09-10'
dateModified: '2026-09-10'
author: doug-erb
featured: false
summary: The structural reasons legacy SPM systems fail global enterprises, from currency and entity complexity to weak audit trails.
keyTakeaways:
  - Legacy SPM systems usually fail global teams for structural reasons, not because of a single missing feature.
  - Multi-currency, multi-entity, and local plan variants multiply the number of rules a rigid data model has to carry.
  - Spreadsheet workarounds and weak audit trails turn local exceptions into compliance and dispute risk.
  - A system that cannot expose clean data and logged actions cannot safely support AI agents.
faq:
  - question: What counts as a legacy SPM system?
    answer: >-
      A legacy SPM system is any incentive compensation setup whose design no longer matches the business it serves. That includes older on-premises platforms, heavily customized cloud deployments that cannot be upgraded cleanly, and homegrown spreadsheet or database tools. Age matters less than whether the data model and processes can still absorb change.
  - question: Why do global sales teams outgrow SPM systems faster than domestic teams?
    answer: >-
      Global teams add dimensions that multiply complexity: several currencies, several legal entities and payrolls, country plan variants, local labor rules, and source systems that close in different time zones. A system designed for one currency, one entity, and one plan family absorbs each new dimension through custom code or spreadsheets.
  - question: Can a legacy SPM system be fixed instead of replaced?
    answer: >-
      Sometimes. If the platform is supported and the problems come from configuration, such as an overgrown rule set or poor hierarchy design, restructuring the existing setup can work. If the data model cannot represent entities, currencies, or effective-dated hierarchies, replacement or migration is usually the more durable path.
  - question: Why does a legacy SPM system get in the way of AI agents?
    answer: >-
      Agents need clean, queryable data, programmatic access to run and check work, and a log of every action. Legacy systems often have none of these: logic hides in custom code and spreadsheets, access is through screens, and changes are not recorded consistently. Agents pointed at that environment produce wrong answers faster.
  - question: What is the first step in modernizing SPM for a global sales team?
    answer: >-
      Start with an inventory of what the current system actually does: every plan variant by country, every currency rule, every feed and its timing, and every spreadsheet that sits outside the platform. That inventory shows which problems are structural and which are configuration, and it becomes the requirements baseline for any modernization.
---

Legacy SPM breaks global sales teams because its data model was built for fewer currencies, fewer legal entities, and fewer plan variants than a global business runs. As countries are added, the system absorbs each new rule through custom code, batch jobs, and spreadsheets. The result is late cycles, weak audit trails, and payouts that local teams no longer trust.

## What "legacy SPM" means in a global context

Legacy is not about age alone. An SPM system becomes legacy when its design no longer matches the business it serves. That can be an older on-premises platform, a cloud deployment customized so heavily that it cannot be upgraded cleanly, or a homegrown setup of spreadsheets and database scripts.

Global enterprises hit the limits first because they add dimensions a domestic program never needed. Each dimension on its own is manageable. Together, they multiply the number of rules, data sources, and exceptions the system has to carry.

## Multi-currency complexity

A global plan has to answer currency questions that a single-country plan never asks. Is quota set in local currency or in a corporate currency? Which exchange rate applies: the rate on the booking date, the period-end rate, or a fixed plan rate set at the start of the year? What happens when a deal is booked in one currency, invoiced in another, and paid to a rep in a third?

Legacy systems often support one conversion method, applied in one place. Every other variation is handled outside the system, usually in a spreadsheet maintained by one person. When rates move sharply, reps see swings in attainment that have nothing to do with their selling, and nobody can explain the number without opening that spreadsheet.

## Multi-entity and payroll complexity

Global sales teams are employed by different legal entities, paid through different payroll providers, and accounted for in different ledgers. Commission accruals have to land in the right entity, and payouts have to reach the right payroll on that payroll's calendar.

A system built for one entity treats this as a reporting problem rather than a data model problem. The calculation runs once, and entity splits, accrual mapping, and payroll files are produced afterwards by hand. That is where reconciliation breaks: the comp system, finance, and each local payroll hold different versions of what was owed.

## Local plan variants and local rules

Global companies rarely run one plan worldwide. Countries need variants for local market conditions, local pay mix norms, and local employment rules. California, for example, requires a written commission contract for employees working in the state that sets out how commissions are computed and paid ([California Labor Code section 2751](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2751)). In Germany, an establishment's works council has co-determination rights over remuneration principles and performance-related pay ([Works Constitution Act, section 87](https://www.gesetze-im-internet.de/englisch_betrvg/englisch_betrvg.html#p0503)). Plan documents, acceptance records, and change timing therefore differ by country.

In a legacy setup, each variant is usually a copy of a base plan with local edits. Copies drift. A rule fixed in one country is not fixed in the others, and the number of plans grows faster than the team that maintains them. Our guide to [global incentive governance](/resources/guides/global-incentive-governance) covers how to structure a global plan family with controlled local variants.

## Rigid data models

Underneath the symptoms is a data model that cannot represent how a global business is organized. Common limits include:

- Hierarchies that are not effective-dated, so a rep who moves country or manager mid-period breaks the rollup.
- No native concept of legal entity, currency, or plan region on the transaction.
- Crediting rules hard-coded for one sales motion, with partner, overlay, and cross-border deals handled as exceptions.
- Custom fields added over years with no documentation of what they mean.

When the model cannot represent the business, every change becomes a project. A new country, an acquisition, or a reorganization means custom development rather than configuration.

## Batch timing across time zones

Legacy SPM systems typically run as nightly or weekly batches against data extracted from CRM, ERP, and HR systems. That works when all sources close in one time zone. In a global program, one region's day-end is another region's morning, and month-end closes happen on different schedules.

The result is a calculation that always runs on partially complete data for someone. Admins compensate by rerunning batches, holding cycles open, or freezing data at an arbitrary cutoff. Each choice either delays payouts or introduces errors that surface later as retro adjustments.

## Spreadsheet workarounds

Every limit above creates a spreadsheet. Currency conversion, entity splits, local plan rules, crediting exceptions, and payroll file preparation all migrate outside the platform. Over time the platform calculates a baseline and the real program lives in a set of workbooks, often understood by a small number of people.

That is a key-person risk and an accuracy risk at the same time. When Lanshore ran a plan inventory for PepsiCo, it found dozens of regional spreadsheets carrying local variants of the global plan, several applying different exchange-rate conventions, and SPIFs that existed nowhere in the plan documents. Each variant was either folded into the platform as a governed local rule or retired.

## Weak audit trails

Auditors and finance teams ask simple questions: who changed this rule, when, and with whose approval? Why was this rep paid this amount in this currency? Legacy systems often cannot answer, because changes were made directly in configuration, in custom code, or in a spreadsheet that has no change history.

Global programs feel this more because they face more audits: statutory audits per entity, internal controls reviews, and local labor inquiries. Our guide on [audit-ready SPM analytics](/resources/guides/enterprise-spm-consulting-audit-ready-analytics) explains what an audit-ready trail needs to contain.

## No foundation for AI agents

The newest limit is the inability to support AI agents. Agents can run calculation cycles, validate feeds, answer rep inquiries, and flag anomalies, but only when they can read clean data, act through defined interfaces, and log what they did. Legacy systems tend to offer screens rather than APIs, logic hidden in custom code, and no consistent action log.

At Lanshore, we see agents as an amplifier: without clean hierarchies, correct plan logic, and a reliable cycle, they produce wrong answers faster. Modern integration approaches such as MCP (Model Context Protocol) let agents connect to systems under defined policies with a clearer audit trail, but the system on the other end still has to be sound.

## Signs a legacy system has reached its limit

- Adding a country or entity requires custom development rather than configuration.
- Currency and entity logic lives in spreadsheets outside the platform.
- Cycles are routinely held open waiting for regional data.
- Nobody can produce a complete change history for a plan rule.
- Local teams keep their own records of what reps are owed.

The [9 signs your enterprise SPM needs modernization](/blog/9-signs-your-enterprise-spm-needs-modernization) article covers the warning signs in more detail.

## From diagnosis to modernization

Knowing why the system breaks is the first half. The second half is the modernization path: inventory the current logic, decide what to restructure versus replace, migrate in phases, and run parallel calculations before cutover. That method is covered step by step in [modernizing legacy SPM systems in 2026](/resources/guides/modernizing-legacy-spm-systems).

Lanshore implements and operates nine SPM platforms, including Varicent, Xactly, SAP SuccessFactors Incentive Management, and Anaplan, and is platform-agnostic, so the assessment starts from your requirements rather than a product. For the compliance side of global programs, see [global sales performance management for compliance](/solutions/global-compliance). For PepsiCo, Lanshore consolidated more than 20 countries and a dozen currencies on one platform and one plan framework with governed local variants.

## Frequently asked questions

### What counts as a legacy SPM system?

A legacy SPM system is any incentive compensation setup whose design no longer matches the business it serves. That includes older on-premises platforms, heavily customized cloud deployments that cannot be upgraded cleanly, and homegrown spreadsheet or database tools. Age matters less than whether the data model and processes can still absorb change.

### Why do global sales teams outgrow SPM systems faster than domestic teams?

Global teams add dimensions that multiply complexity: several currencies, several legal entities and payrolls, country plan variants, local labor rules, and source systems that close in different time zones. A system designed for one currency, one entity, and one plan family absorbs each new dimension through custom code or spreadsheets.

### Can a legacy SPM system be fixed instead of replaced?

Sometimes. If the platform is supported and the problems come from configuration, such as an overgrown rule set or poor hierarchy design, restructuring the existing setup can work. If the data model cannot represent entities, currencies, or effective-dated hierarchies, replacement or migration is usually the more durable path.

### Why does a legacy SPM system get in the way of AI agents?

Agents need clean, queryable data, programmatic access to run and check work, and a log of every action. Legacy systems often have none of these: logic hides in custom code and spreadsheets, access is through screens, and changes are not recorded consistently. Agents pointed at that environment produce wrong answers faster.

### What is the first step in modernizing SPM for a global sales team?

Start with an inventory of what the current system actually does: every plan variant by country, every currency rule, every feed and its timing, and every spreadsheet that sits outside the platform. That inventory shows which problems are structural and which are configuration, and it becomes the requirements baseline for any modernization.
