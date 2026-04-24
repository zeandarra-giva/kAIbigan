---
tags: [mvp, features, kAIbigan, product]
created: 2026-04-22
updated: 2026-04-24
project: kAIbigan
source: MVP Features.docx
version: v2
---

# kAIbigan — MVP Features (MoSCoW)

> v2 aligns with [[kAIbigan Business Plan]] v2: L2 = partner school's guidance counselor (not an employed coach); L3 = partnered pool of psychologists, psychiatrists, and therapists; three B2B tiers (Starter / Growth / Premium); B2C marketplace runs alongside.

## Must-Have

### Student Mobile App
- **Anonymous sign-in** — verified school credentials generate an anonymous alias; no identity surfaced in product.
- **Clinical intake & triage** — PHQ-9 / GAD-7 scoring routes student to L1 / L2 / L3 or Red Flag.
- **L1 — AI CBT Companion** — 24/7 chat-based companion delivering CBT coping (breathing, grounding, reframing). Available in every tier.
- **L2 — Guidance Counselor booking + async chat** — directory of the school's own counselors, async messaging, in-app scheduling. (Growth + Premium.)
- **L3 — Professional Directory** — filterable list of psychologists, psychiatrists, therapists with discipline filter + expertise chips.
- **L3 — Professional Profile** — license number (verified), prescribing-status pill, photo, name + extensions, expertise, years of experience, hospital/clinic affiliation, bio, session fee / Premium-covered state.
- **Booking Calendar UI** — shared by L2 + L3; Month + Week views, time-of-day grouped slots.
- **Booking Confirmation** — generic confirmation for both counselor and professional bookings; surfaces "Covered by your school partnership" when applicable.
- **Red Flag Protocol** — keyword detection in chat + intake Q5 + SOS button; opens crisis-routing modal with hotlines + school emergency contact.
- **Mood check-in + Mood Calendar** — daily mood logging, visualized over time.
- **Localized resource library** — articles, podcasts, meditations grounded in Filipino youth context.

### B2B Admin Dashboard (Institution View)
- **Overview page** — KPIs for active users, sessions, wellbeing, Red Flag events, **counselor activation**.
- **Triage funnel** — L1 → L2 → L3 routing with drop-off.
- **Crisis log** — anonymized Case IDs, trigger, severity, response, status — never any student identity.
- **Wellbeing trends** — PHQ-9 / GAD-7 movement by cohort.
- **Privacy badge** pinned on every page; k-anonymity and aggregation are invariants.

### Counselor Workspace (NEW in v2)
- **My Caseload** — queue of students needing response, scheduled today, and post-intake reviews.
- **Messages** — async chat threads with students (aliases only); intake summary drawer; Red Flag safety banner.
- **Schedule** — counselor's own Week-view calendar that auto-populates from student mobile bookings.

### Platform / Back-Office
- **Partnered Professional Pool onboarding** — credentialing (license validation), pay-per-booking contracting, scope-of-practice agreement.
- **Marketplace transaction flow** — card-on-file booking; charge on session completion; 15% commission (0% for Premium students after included 2).
- **Data Privacy Act compliance** — NPC registration, DPO, encrypted storage, anonymization pipeline.

## Should-Have
- **In-platform crisis protocol automation** — Red Flag events automatically notify the partner school's designated contact with an anonymized case summary.
- **Institutional advanced dashboard** — cohort analysis, predictive high-risk period alerts, ROI reporting (Premium tier).
- **Counselor intake pre-reads** — auto-generated summary of a newly triaged student's intake for the counselor's first contact.
- **Reminder notifications** — session reminders 30 min before for both student and counselor/professional.
- **Language toggle (EN / FIL)** — translate key student-facing strings.

## Could-Have
- In-app native video conferencing (replaces Zoom/Google Meet links).
- Peer support forums (anonymous, moderated).
- Gamification (badges, streaks) — validated carefully against clinical guidance.
- Proactive AI sentiment analysis over time.
- Professional Pool rating & review system (double-blind).
- Bulk institutional reporting automation (quarterly wellness report PDF).

## Won't-Have (MVP)
- HMO / insurance integration — PH ecosystem too fragmented; B2B model bypasses this.
- Full EHR system — encrypted storage per DPA is sufficient.
- Wearable device integration.
- Parental access portal — would break student trust and anonymity.
- Multi-institution admin switcher — pilot is single-school.
- kAIbigan-employed coach network — **explicitly removed in v2**; L2 is staffed by partner schools' existing guidance counselors.

---

## Core User Flows (v2)

1. **L1 path** — Splash → Anon Sign-in → Intake Triage → Result: L1 → AI Chat → (optional) Red Flag Modal
2. **L2 path (Growth/Premium)** — Result: L2 → Counselor Directory → Booking Calendar → Booking Confirm → async Messages thread appears in counselor workspace
3. **L3 path (Premium included / marketplace)** — Result: L3 → Professional Directory (filter by discipline) → Professional Profile (credential review) → Booking Calendar → Booking Confirm ("Covered" or paid)
4. **Red Flag path** — any trigger → Red Flag Modal → crisis routing (hotline / guidance office / professional) → event logged anonymously in Admin Crisis Log
5. **Counselor path** — Counselor logs into workspace → Caseload → Messages thread → reply / schedule session → session auto-appears on Schedule

---

## Related
- [[kAIbigan Business Plan]]
- [[kAIbigan Mobile App PRD]]
- [[kAIbigan Admin Dashboard PRD]]
- [[kAIbigan 5-Minute Pitch]]
- [[kAIbigan Market Research]]
- [[kAIbigan MVP Design Walkthrough]]
