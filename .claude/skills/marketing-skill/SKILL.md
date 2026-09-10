---
name: marketing-skill
description: Marketing playbook covering 50 topics for technical marketers and founders — conversion optimization (CRO), copywriting, SEO (audits, AI SEO, schema, programmatic SEO), paid ads and ad creative, email and SMS, cold email and prospecting, onboarding/signup/paywalls, pricing, offers, referrals, influencer and community marketing, public relations, events, launches, analytics/attribution, churn prevention, revops, sales enablement, and full marketing plans. Use this whenever the user asks for marketing strategy, execution, or copy — as opposed to Shopify theme/storefront implementation, which is covered by the project's main CLAUDE.md instructions. Adapted from Corey Haines' marketingskills collection (https://github.com/coreyhaines31/marketingskills).
metadata:
  version: 2.11.1
  source: https://github.com/coreyhaines31/marketingskills
---

# Marketing Skill

This is a bundled reference of 50 marketing topic playbooks, kept as a single skill separate from this project's Shopify store-builder instructions (`CLAUDE.md`). Use `CLAUDE.md` for site architecture, theme, Liquid, and storefront UX work. Use this skill for marketing strategy and execution: copy, SEO, ads, growth loops, pricing, retention, and go-to-market work.

## How to use this skill

1. Find the row below that matches the request.
2. **Read the referenced file in full** (`topics/<name>/SKILL.md`) before doing the work — it contains the actual framework, questions to ask, and step-by-step process for that topic. This top-level file is only a router; it does not contain the playbooks itself.
3. Some topic files point to their own supporting material in a `topics/<name>/references/` subfolder (templates, checklists, examples) — open those as directed inside the topic file.
4. If a request spans multiple topics (e.g. "improve my pricing page" touches both `pricing` and `copywriting`/`cro`), read all relevant topic files before proposing changes.
5. If the request is about this specific Shopify store's implementation (sections, Liquid, theme editor, layout) rather than marketing strategy/copy, follow `CLAUDE.md` instead — this skill does not cover Shopify development.

## Topics

| Topic | Use when... | Reference |
|---|---|---|
| **ab-testing** | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. | `topics/ab-testing/SKILL.md` |
| **ad-creative** | When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any paid advertising platform. | `topics/ad-creative/SKILL.md` |
| **ads** | When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. | `topics/ads/SKILL.md` |
| **ai-seo** | When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. | `topics/ai-seo/SKILL.md` |
| **analytics** | When the user wants to set up, improve, or audit analytics tracking and measurement. | `topics/analytics/SKILL.md` |
| **aso** | When the user wants to audit or optimize an App Store or Google Play listing. | `topics/aso/SKILL.md` |
| **attribution** | When the user wants to figure out which marketing actually drives conversions and revenue, choose or interpret an attribution model, or reconcile conflicting numbers across tools. | `topics/attribution/SKILL.md` |
| **churn-prevention** | When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implement retention strategies. | `topics/churn-prevention/SKILL.md` |
| **co-marketing** | When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. | `topics/co-marketing/SKILL.md` |
| **cold-email** | Write B2B cold emails and follow-up sequences that get replies. | `topics/cold-email/SKILL.md` |
| **community-marketing** | Build and leverage online communities to drive product growth and brand loyalty. | `topics/community-marketing/SKILL.md` |
| **competitor-profiling** | When the user wants to research, profile, or analyze competitors from their URLs. | `topics/competitor-profiling/SKILL.md` |
| **competitors** | When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. | `topics/competitors/SKILL.md` |
| **content-strategy** | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. | `topics/content-strategy/SKILL.md` |
| **copy-editing** | When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. | `topics/copy-editing/SKILL.md` |
| **copywriting** | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. | `topics/copywriting/SKILL.md` |
| **cro** | When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture forms, or contact forms. | `topics/cro/SKILL.md` |
| **customer-research** | When the user wants to conduct, analyze, or synthesize customer research. | `topics/customer-research/SKILL.md` |
| **directory-submissions** | When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. | `topics/directory-submissions/SKILL.md` |
| **emails** | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. | `topics/emails/SKILL.md` |
| **events** | When the user wants to plan, run, sponsor, speak at, or get pipeline from events — webinars, conferences, trade shows, meetups, dinners, workshops, virtual summits, or user conferences. | `topics/events/SKILL.md` |
| **free-tools** | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. | `topics/free-tools/SKILL.md` |
| **image** | When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing visuals, or brand assets. | `topics/image/SKILL.md` |
| **influencer-marketing** | When the user wants to run influencer, creator, or ambassador partnerships to promote their product — finding and vetting partners, structuring deals, briefing creators, disclosure compliance, and measuring ROI. | `topics/influencer-marketing/SKILL.md` |
| **launch** | When the user wants to plan a product launch, feature announcement, or release strategy. | `topics/launch/SKILL.md` |
| **lead-magnets** | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. | `topics/lead-magnets/SKILL.md` |
| **marketing-council** | When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staffed by legendary marketers (Seth Godin, David Ogilvy, Eugene Schwartz, April Dunford, Rory Sutherland, Alex Hormozi, Byron Sharp, and more). | `topics/marketing-council/SKILL.md` |
| **marketing-ideas** | When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. | `topics/marketing-ideas/SKILL.md` |
| **marketing-loops** | When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent runs on a cadence (weekly, daily, on a trigger) rather than a one-off task. | `topics/marketing-loops/SKILL.md` |
| **marketing-plan** | When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product. | `topics/marketing-plan/SKILL.md` |
| **marketing-psychology** | When the user wants to apply psychological principles, mental models, or behavioral science to marketing. | `topics/marketing-psychology/SKILL.md` |
| **offers** | When the user wants to design, construct, or improve an offer — the thing they actually sell — including value framing, bonus stacking, guarantee design, scarcity/urgency, naming, and payment structure. | `topics/offers/SKILL.md` |
| **onboarding** | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. | `topics/onboarding/SKILL.md` |
| **paywalls** | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. | `topics/paywalls/SKILL.md` |
| **popups** | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. | `topics/popups/SKILL.md` |
| **pricing** | When the user wants help with pricing decisions, packaging, or monetization strategy. | `topics/pricing/SKILL.md` |
| **product-marketing** | When the user wants to create or update their product marketing context document. | `topics/product-marketing/SKILL.md` |
| **programmatic-seo** | When the user wants to create SEO-driven pages at scale using templates and data. | `topics/programmatic-seo/SKILL.md` |
| **prospecting** | When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general B2B, or local small businesses. | `topics/prospecting/SKILL.md` |
| **public-relations** | When the user wants help with public relations, earned media, press coverage, journalist outreach, or media strategy. | `topics/public-relations/SKILL.md` |
| **referrals** | When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. | `topics/referrals/SKILL.md` |
| **revops** | When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. | `topics/revops/SKILL.md` |
| **sales-enablement** | When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. | `topics/sales-enablement/SKILL.md` |
| **schema** | When the user wants to add, fix, or optimize schema markup and structured data on their site. | `topics/schema/SKILL.md` |
| **seo-audit** | When the user wants to audit, review, or diagnose SEO issues on their site. | `topics/seo-audit/SKILL.md` |
| **signup** | When the user wants to optimize signup, registration, account creation, or trial activation flows. | `topics/signup/SKILL.md` |
| **site-architecture** | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. | `topics/site-architecture/SKILL.md` |
| **sms** | When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart texts, post-purchase, win-back, promotional sends, or transactional/auth SMS. | `topics/sms/SKILL.md` |
| **social** | When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms, or wants to do social listening and engagement triage. | `topics/social/SKILL.md` |
| **video** | When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. | `topics/video/SKILL.md` |

## Notes

- This bundle is a snapshot of the upstream repo at the version noted in the frontmatter above. Re-sync by re-copying the `skills/` directory from https://github.com/coreyhaines31/marketingskills if a refresh is needed later.
- Never fabricate reviews, statistics, press mentions, or guarantees when executing any of these playbooks — this matches the "never fabricate" rule in the project's own `CLAUDE.md`.
