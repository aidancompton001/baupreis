# FOCUS GROUP REPORT -- BauPreis AI SaaS

**Conducted by:** #11 UX Research Lead -- Dr. Katrin Engel (Principal, 15+ years)
**Date:** 2026-02-26
**Environment:** Production (https://baupreis.ais152.com)
**Method:** Heuristic walkthrough from 10 user personas against 7 public pages
**Billing tested:** No (Paddle not approved; checkout blocked)

---

## Pages Tested

| # | URL | Status |
|---|-----|--------|
| 1 | `/` (Landing) | Live, full content |
| 2 | `/preise` (Pricing) | Live, 3 plans with toggle |
| 3 | `/kontakt` (Contact) | Live, form + email |
| 4 | `/sign-in` (Login) | Live, Clerk-based auth |
| 5 | `/sign-up` (Registration) | Live, Clerk-based auth |
| 6 | `/ueber-uns` (About Us) | Live, text only |
| 7 | `/blog` | Live, empty placeholder |

---

## PERSONA #1: Klaus Bergmann -- Einkaufer (57, Tech 4/10, Desktop + iPad, Team plan)

### Test Scenarios

1. **Morning price check:** Open landing page at 7:30, understand value, find pricing for Team plan
2. **Trust verification:** Look for data sources, GDPR compliance, company details (Impressum)
3. **Sign-up for Team trial:** Navigate from landing to registration, complete sign-up
4. **Contact support:** Find how to ask a question about API integration with SAP
5. **Mobile check (iPad):** Review pricing on tablet during a meeting

### Walkthrough

**Scenario 1 -- Morning price check:**
Klaus arrives at the landing page. The hero headline about saving 15-30% on material costs through timing resonates immediately -- this is his exact pain point. He sees 16 materials, 4x daily updates, LME/Destatis sources mentioned. The three-step process (Register, Select materials, Save money) is clear. He scrolls to pricing and finds the Team plan at 299 EUR with API access and 5 users -- matches his department needs. Navigation is straightforward. HOWEVER: no screenshot or demo of the actual dashboard. Klaus, being conservative (tech 4/10), wants to see what the product looks like before signing up. He sees no product screenshots, no demo video, no sample dashboard.

**Scenario 2 -- Trust verification:**
Klaus looks for trust signals. He finds: GDPR mention (Hetzner Nuremberg), data sources (LME, Destatis). He checks the About Us page -- it describes the mission and data approach but has NO team information, NO founding story, NO company name prominently displayed, NO customer logos, NO testimonials. For a 57-year-old Einkaufsleiter at a STRABAG subsidiary spending 299 EUR/month, this is a red flag. The Impressum page exists (legal requirement met), but the contact page shows a gmail address (pashchenkoh@gmail.com) -- this is a serious trust problem for German B2B. No phone number, no physical address on the contact page.

**Scenario 3 -- Sign-up:**
Sign-up flow is clean: email, name, company fields. "7 Tage kostenlos, keine Kreditkarte" is good. AGB and Datenschutz links present. Clerk handles the actual auth. However, there is no plan selection during sign-up -- Klaus does not know if he is signing up for Basis, Pro, or Team.

**Scenario 4 -- Contact about API:**
Contact form has 3 fields (name, email, message). Functional but minimal. No phone number for urgent questions. No mention of response time. The gmail address undermines professionalism.

**Scenario 5 -- iPad:**
Responsive layout works. Mobile nav hamburger menu present. Pricing cards stack vertically. Adequate.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 5/10 | Clean design but lacks product visuals and social proof |
| Navigation | 7/10 | Simple, clear structure, few pages |
| Value Clarity | 6/10 | Promise is clear but unproven -- no demo, no testimonials |
| Willingness to Pay | 3/10 | 299 EUR/month to an unknown company with a gmail contact? No. |
| **Overall** | **5/10** | Would not sign up without seeing a demo and talking to someone |

### Blockers
- Gmail contact address destroys B2B trust
- No product screenshots or demo
- No customer testimonials or case studies
- No plan selection in sign-up flow

---

## PERSONA #2: Stefan Hofer -- Bauleiter (43, Tech 5/10, Smartphone, Pro plan)

### Test Scenarios

1. **Quick mobile check:** Open landing on Samsung Galaxy S24, understand value in < 30 seconds
2. **Find pricing for Pro:** Determine if Pro plan has Telegram alerts
3. **Sign up on mobile:** Complete registration from phone
4. **Check blog for market insights:** Look for construction market news

### Walkthrough

**Scenario 1 -- Quick mobile check:**
Stefan opens the site on his Samsung between tasks. The page loads (Next.js SSR is fast). The hero text is large and readable. However, the landing page is text-heavy -- no visual hero image, no dashboard mockup. On mobile, Stefan must scroll extensively to understand what the product does. The three features (Echtzeit-Monitoring, KI-Prognosen, Sofort-Alarme) are clear but require scrolling past the hero. For someone with 2 minutes on a lunch break, this is borderline.

**Scenario 2 -- Find Pro pricing:**
Stefan clicks "Preise" in the nav. The pricing page clearly shows Pro at 149 EUR with Telegram mentioned. Monthly/yearly toggle works. Feature list is clear. He can see that Basis does NOT have Telegram (shown in "not included" list). Good differentiation.

**Scenario 3 -- Sign up on mobile:**
Sign-up form is mobile-friendly. Fields are large enough (py-3 padding). One-hand operation possible. "Kostenlos starten" button is prominent. No friction here.

**Scenario 4 -- Blog:**
Stefan taps Blog -- empty. "Beitrage werden in Kurze veroffentlicht." Dead end. Slight negative impression but not a deal-breaker for him.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 6/10 | Clean but text-heavy for mobile; no visual proof |
| Navigation | 7/10 | Mobile nav works, simple structure |
| Value Clarity | 7/10 | Telegram alerts prominently mentioned -- his key need |
| Willingness to Pay | 5/10 | Would try free trial but hesitant at 149 EUR without seeing the product |
| **Overall** | **6/10** | Might sign up for trial out of curiosity but not convinced enough |

### Blockers
- No product screenshots showing mobile/PWA experience
- Cannot tell if PWA push notifications actually work before sign-up
- Blog is empty -- missed content marketing opportunity

---

## PERSONA #3: Markus Zimmermann -- Kalkulator (48, Tech 6/10, Desktop, Pro plan)

### Test Scenarios

1. **Evaluate for tender calculations:** Does BauPreis provide historical data for Preisgleitklausel?
2. **Check data sources and accuracy:** Are prices reliable enough for official tender documentation?
3. **Find Preisgleitklausel feature:** Is this mentioned anywhere?
4. **Compare plans:** Which plan gives him 90-day history and Excel export?

### Walkthrough

**Scenario 1 -- Evaluate for tenders:**
Markus arrives looking for historical price data. The landing page mentions "16 Baumaterialien" and "KI-Prognosen" but does NOT specifically mention Preisgleitklausel, historical data depth, or Excel/CSV export. He must dig into the pricing page to find "90-Tage-Historien" under Pro. The FAQ section mentions data sources (LME, Destatis) but does not address accuracy guarantees or suitability for tender documentation.

**Scenario 2 -- Data reliability:**
Markus needs data he can cite in official documents. The About Us page mentions LME and Destatis as sources. However, there is no data methodology page, no accuracy statement, no comparison with official Destatis indices. For a Kalkulator who stakes 200K EUR per tender on these numbers, this is insufficient.

**Scenario 3 -- Preisgleitklausel:**
Searching the landing page and pricing page: no mention of Preisgleitklausel. No mention of BauPreis Index. No mention of Excel/CSV export. These are Markus's three most important features, and none are visible on the public pages.

**Scenario 4 -- Plan comparison:**
Pro plan shows "90-Tage-Historien" -- good. But no mention of export capabilities (Excel, CSV). Markus cannot determine if the product will integrate with his workflow.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 5/10 | Generic SaaS look; doesn't speak his language (tenders, Kalkulation) |
| Navigation | 7/10 | Easy to find pricing; no feature detail pages |
| Value Clarity | 4/10 | His key features (Preisgleitklausel, export, accuracy) not mentioned |
| Willingness to Pay | 3/10 | Cannot determine if product meets his needs from public pages |
| **Overall** | **5/10** | Would not sign up -- key features invisible |

### Blockers
- Preisgleitklausel not mentioned anywhere on public pages
- No Excel/CSV export mentioned
- No data accuracy/methodology documentation
- No dedicated feature pages

---

## PERSONA #4: Jorg Seidel -- Geschaftsfuhrer (54, Tech 5/10, MacBook + iPhone, Basis plan)

### Test Scenarios

1. **Quick value assessment:** Understand ROI in < 2 minutes from landing page
2. **Find cheapest plan:** Determine if Basis (49 EUR) is enough for his needs
3. **AI recommendations check:** Can AI tell him "buy copper now"?
4. **Mobile check (iPhone):** Quick look during commute

### Walkthrough

**Scenario 1 -- Quick value assessment:**
Jorg reads the hero: "15-30% sparen beim richtigen Einkaufszeitpunkt." This resonates -- he is an entrepreneur who thinks in ROI. The problem section explains material price volatility. The solution section highlights AI forecasts. However, the language is still somewhat technical. Jorg's quote was: "Sagen Sie mir: 'Jetzt kaufen, nachste Woche wird es teurer.'" -- the landing page does not demonstrate this specific AI output. No example AI recommendation is shown.

**Scenario 2 -- Cheapest plan:**
Basis at 49 EUR is clearly presented. Feature list shows 5 materials, 1 user, 3 alerts, email reports. The "not included" list shows NO Telegram, NO AI forecasts, NO API. BUT -- Jorg needs AI recommendations, which are Pro-only. The landing page attracted him with AI promises that require a 3x more expensive plan. This is a bait-and-switch feeling. The pricing page does not guide him: "If you need AI recommendations, choose Pro."

**Scenario 3 -- AI feature preview:**
No demo of AI recommendations visible anywhere. No sample analysis. No "here is what our AI told a customer last week." Jorg cannot evaluate the AI quality before paying 149 EUR/month.

**Scenario 4 -- Mobile:**
Mobile version works. Text is readable. CTA buttons are tappable. Adequate but unremarkable.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 6/10 | ROI message resonates; clean design |
| Navigation | 7/10 | Easy to find what he needs |
| Value Clarity | 5/10 | AI promised but invisible; Basis plan frustratingly limited |
| Willingness to Pay | 4/10 | Interested at 49 EUR but realizes he needs 149 EUR -- cold feet |
| **Overall** | **5/10** | Attracted by headline, disappointed by plan limitations |

### Blockers
- AI features (his primary interest) require 3x the entry price
- No AI demo/preview to justify the upgrade
- Pricing page lacks recommendation guidance ("Best for you: ...")

---

## PERSONA #5: Anna-Lena Fischer -- Projektleiterin (38, Tech 7/10, Surface Pro + iPhone, Team plan)

### Test Scenarios

1. **Evaluate for multi-project management:** Can she group materials by project?
2. **Team features assessment:** 5 users, PDF reports for Bauherr
3. **Sign-up and onboarding expectations:** Is the flow smooth?
4. **Professional appearance for Bauherr:** Would she show this to her client?

### Walkthrough

**Scenario 1 -- Multi-project management:**
The landing page does not mention project grouping, multiple watchlists, or project-based alerts. Anna-Lena's key need is managing different material sets per project. This feature is not visible anywhere on the public site. She cannot determine if BauPreis supports her workflow.

**Scenario 2 -- Team features:**
Team plan clearly shows: 5 users, all reports with PDF, API, dedicated support. The 365-day history is impressive. However, "PDF reports" is mentioned without showing a sample. Anna-Lena sends reports to Bauherren -- she needs to know if these look professional.

**Scenario 3 -- Sign-up:**
Clean flow. However, no plan selection during sign-up is confusing. She wants Team. How does she get it? The sign-up just says "7 Tage kostenlos testen" -- which plan is the trial for?

**Scenario 4 -- Professional appearance:**
The site looks modern and professional. However, the About Us page lacks substance -- no team photos, no credentials. The blog is empty. If Anna-Lena showed this to a Bauherr as her data source, the lack of company transparency might raise questions.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 7/10 | Professional look, good responsive design |
| Navigation | 7/10 | Clear structure, easy to find pricing |
| Value Clarity | 5/10 | Her key need (project grouping) not mentioned |
| Willingness to Pay | 5/10 | Team at 299 EUR needs justification; no PDF sample, no demo |
| **Overall** | **6/10** | Interested but cannot validate key workflow fit |

### Blockers
- No project grouping feature mentioned
- No sample PDF report shown
- No plan selection during sign-up
- Unclear trial experience (which plan features available?)

---

## PERSONA #6: Tim Winkler -- Junior Einkaufer (25, Tech 9/10, MacBook + iPhone, Pro plan)

### Test Scenarios

1. **Modern SaaS evaluation:** Does the product meet his standards for modern software?
2. **AI chat discovery:** Can he find and evaluate the AI assistant?
3. **Quick sign-up (expects < 60 seconds):** Fast registration with Google OAuth
4. **Dark mode / shortcuts:** Does the product feel "native"?

### Walkthrough

**Scenario 1 -- Modern SaaS evaluation:**
Tim opens the landing page. Design is clean, uses Tailwind/shadcn -- recognizable modern stack. However, compared to products Tim uses daily (Notion, Linear, Figma), the landing page is relatively basic: no animations, no interactive demos, no product tour, no video. The typography is good, white space is decent. It is functional but not "wow."

**Scenario 2 -- AI chat:**
The landing page mentions "KI-Prognosen" (AI forecasts) but does NOT highlight the AI chat feature. For Tim, the AI chat IS the product -- his "experienced colleague" he can ask questions. This key feature is buried or invisible on the public pages. No mention of "Chat," "Fragen stellen," or "KI-Assistent."

**Scenario 3 -- Quick sign-up:**
Tim sees Clerk-based sign-up. Google OAuth is available (Clerk supports it). Email + name + company fields. Quick. However, no social login buttons are visible on the sign-up page itself -- only email-based local auth or Clerk widget. If Clerk is properly configured with Google, the Clerk widget handles this, but it is not immediately apparent.

**Scenario 4 -- Dark mode:**
No dark mode toggle visible. No keyboard shortcuts documented. No command palette. Tim would notice these absences.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 6/10 | Clean but basic for a tech-savvy 25-year-old |
| Navigation | 8/10 | Simple, fast, no friction |
| Value Clarity | 5/10 | AI chat (his key feature) not mentioned on public pages |
| Willingness to Pay | 6/10 | Low risk at 149 EUR with trial; would try it |
| **Overall** | **6/10** | Willing to try but not excited |

### Blockers
- AI chat feature not promoted on landing/marketing pages
- No dark mode
- No interactive demo or product tour
- Landing page design is functional but not inspiring for digital natives

---

## PERSONA #7: Rainer Bock -- Metallhandler (51, Tech 5/10, Desktop + Samsung, Pro plan)

### Test Scenarios

1. **Find Legierungsrechner:** Is the alloy calculator mentioned anywhere?
2. **Metal prices evaluation:** Are all his metals (Cu, Al, Zn, Ni) covered?
3. **Update frequency:** Can he confirm 4x daily updates?
4. **Compare with current tools (metals.dev, LME):** Is BauPreis a replacement?

### Walkthrough

**Scenario 1 -- Legierungsrechner:**
Rainer searches the landing page for "Legierung," "Messing," "Bronze," "Rechner." None of these terms appear on the landing page. The pricing page does not mention the Legierungsrechner either. This is the feature Rainer called "Gold wert" -- and it is completely invisible to him on the public site. He would never discover it without signing up.

**Scenario 2 -- Metal prices:**
The landing page mentions "16 Baumaterialien" and the FAQ lists "Stahl, Kupfer, Holz, Zement" as examples. Copper is there, but aluminum, zinc, and nickel are not explicitly listed. Rainer needs ALL of these for daily operations. He cannot confirm the product covers his needs.

**Scenario 3 -- Update frequency:**
Pro plan mentions "4x taglich aktualisiert" -- this matches his minimum requirement. However, he needs "real-time" (several times per day), and 4x may feel slow for a metals trader.

**Scenario 4 -- Comparison:**
The About Us page mentions LME as a data source, which is good. But there is no feature comparison with metals.dev or other tools. Rainer has no way to evaluate if BauPreis would replace or complement his existing workflow.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 4/10 | Looks like a construction site, not a metals trading tool |
| Navigation | 6/10 | Standard but no metals-specific content |
| Value Clarity | 3/10 | His key feature (Legierungsrechner) is invisible |
| Willingness to Pay | 2/10 | Cannot confirm coverage of his metals; key feature hidden |
| **Overall** | **4/10** | Would leave and continue using metals.dev |

### Blockers
- Legierungsrechner (alloy calculator) completely absent from marketing
- Metal coverage (Al, Zn, Ni) not explicitly listed
- No dedicated metals trader landing page or use case
- Positioned as "Baustoffe" (construction materials), not "Metalle" (metals)

---

## PERSONA #8: Prof. Dr. Michael Hartmann -- Architekt (46, Tech 7/10, iMac + MacBook + iPad, Pro plan)

### Test Scenarios

1. **Preisgleitklausel evaluation:** Does BauPreis support price escalation clauses?
2. **Data citability:** Can he reference BauPreis in official documentation?
3. **PDF report quality:** Professional enough for Bauherr?
4. **DIN 276 compliance:** Any mention of standards?

### Walkthrough

**Scenario 1 -- Preisgleitklausel:**
Same issue as Markus (Persona #3). No mention of Preisgleitklausel on any public page. This is a critical feature for architects under HOAI/VOB, and its absence from marketing is a significant miss.

**Scenario 2 -- Data citability:**
The About Us page mentions LME and Destatis as sources. However, there is no statement like "unsere Daten sind zitierfähig" or "anerkannte Datenquelle." For an architect who includes data in Kostenberechnung (DIN 276), the question is: will a Bauherr accept BauPreis as a legitimate source? The site provides no answer.

**Scenario 3 -- PDF quality:**
PDF reports are mentioned under Team plan only. Pro plan (which Michael would choose) does NOT include PDF. This is a problem: he needs PDF for Bauherr documentation but does not need 5 users or API. The plan structure forces him to pay 299 EUR for a feature (PDF) when everything else at 149 EUR is sufficient.

**Scenario 4 -- DIN 276:**
No mention of DIN 276, HOAI, VOB, or any German construction standards. For a licensed architect, regulatory compliance language would increase trust dramatically.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 6/10 | Professional but generic; does not speak to architects |
| Navigation | 7/10 | Clean, standard |
| Value Clarity | 3/10 | Preisgleitklausel absent; DIN 276 not mentioned |
| Willingness to Pay | 3/10 | Needs PDF (Team-only) but does not need Team features |
| **Overall** | **5/10** | Feature he needs most (Preisgleitklausel) is invisible; pricing mismatch |

### Blockers
- Preisgleitklausel not mentioned
- PDF restricted to Team plan (architectural use case needs PDF at Pro level)
- No DIN 276 / HOAI / VOB references
- No sample PDF to evaluate quality

---

## PERSONA #9: Sabine Kruger -- Buchhalterin (52, Tech 3/10, Desktop Windows, Team plan)

### Test Scenarios

1. **Can she understand the product in < 60 seconds?** Minimal tech literacy
2. **Find how to get PDF reports:** One button, one click
3. **German language check:** Any English or technical jargon?
4. **Font size and readability:** Can she read comfortably?

### Walkthrough

**Scenario 1 -- Understand product:**
Sabine opens the landing page. "Sparen Sie 15-30% bei Baustoffen durch den richtigen Einkaufszeitpunkt." She understands this. But then: "KI-Prognosen," "Echtzeit-Monitoring," "LME," "Destatis" -- technical terms that mean nothing to her. She needs: "Einmal pro Woche einen Bericht als PDF." She cannot find this promise on the landing page without scrolling through feature jargon.

**Scenario 2 -- PDF reports:**
Sabine scans the pricing section. PDF is under Team (299 EUR). She was told by her Geschaftsfuhrer to "find a tool for weekly price reports." Now she must tell him it costs 299 EUR/month because the feature she needs (PDF) is locked to the highest tier. She cannot evaluate if the product is worth it because there is no PDF sample.

**Scenario 3 -- German language:**
The entire public site is in German -- good. However, terms like "AI," "KI-Prognosen," "API-Zugang," "Telegram" are confusing for Sabine. She does not use Telegram. She does not know what an API is. The site assumes tech literacy she does not have.

**Scenario 4 -- Readability:**
Font sizes are standard (base 16px). Tailwind defaults are readable. Color contrast is good (gray-900 on white). However, there is no font size adjustment option, and the design relies on icons (emoji) that may not render well on her older Windows desktop.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 4/10 | Too technical; jargon-heavy for a non-tech user |
| Navigation | 6/10 | Simple enough, but cannot find her use case |
| Value Clarity | 3/10 | Her need (weekly PDF) buried under tech features |
| Willingness to Pay | 2/10 | 299 EUR for "one PDF per week" is hard to justify to her boss |
| **Overall** | **4/10** | Would tell her boss "this is not for us" |

### Blockers
- PDF locked to Team (299 EUR) -- overkill for her use case
- Too much technical jargon for low-tech users
- No "Buchhalter/Finanzabteilung" use case on the site
- No font size or accessibility options

---

## PERSONA #10: Oliver Brandt -- Freelance Bauberater (41, Tech 8/10, MacBook + iPhone + iPad, Pro plan)

### Test Scenarios

1. **Evaluate as competitive advantage tool:** Can he show this to clients on iPad?
2. **Professional reports:** Can he export branded reports?
3. **Multi-client management:** Different materials per client?
4. **AI analysis quality:** Preview AI insights?
5. **Cross-device experience:** Seamless between MacBook, iPhone, iPad?

### Walkthrough

**Scenario 1 -- Competitive advantage:**
Oliver sees the landing page as promising. "KI-Prognosen," real-time data, alerts -- this is the toolkit he imagined. However, the site does not position itself as a tool for consultants. No mention of "Berater," "Sachverstandiger," or "client management." He must extrapolate.

**Scenario 2 -- Professional reports:**
PDF export is Team-only (299 EUR). Oliver is a freelancer -- 299 EUR/month is expensive for someone billing 4-6 clients. He would prefer Pro (149 EUR) with PDF. The plan structure does not serve his use case.

**Scenario 3 -- Multi-client:**
Like Anna-Lena, no project/client grouping is visible. Oliver manages 4-6 clients, each with different materials. He cannot tell if BauPreis supports this.

**Scenario 4 -- AI preview:**
No AI demo. No sample analysis. No case study. Oliver cannot evaluate the AI quality, which is his primary selling point to clients.

**Scenario 5 -- Cross-device:**
Responsive design works. PWA is mentioned in the tech stack but not on the public site. Oliver would benefit from knowing about PWA/offline capabilities.

### Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| First Impression | 7/10 | Professional, modern; he can imagine showing it to clients |
| Navigation | 7/10 | Clean and fast |
| Value Clarity | 5/10 | Features exist but consultant use case not addressed |
| Willingness to Pay | 5/10 | Would try trial; 149 EUR acceptable but needs PDF |
| **Overall** | **6/10** | Interested but pricing structure is a barrier |

### Blockers
- PDF locked to Team plan -- freelancers need it at Pro level
- No consultant/Berater use case on the site
- No AI demo to show to potential clients
- No client/project grouping feature mentioned

---

## SUMMARY

### Score Matrix

| # | Persona | Role | First Impression | Navigation | Value Clarity | Willingness to Pay | Overall |
|---|---------|------|:----------------:|:----------:|:-------------:|:-----------------:|:-------:|
| 1 | Klaus Bergmann | Einkaufer | 5 | 7 | 6 | 3 | 5 |
| 2 | Stefan Hofer | Bauleiter | 6 | 7 | 7 | 5 | 6 |
| 3 | Markus Zimmermann | Kalkulator | 5 | 7 | 4 | 3 | 5 |
| 4 | Jorg Seidel | Geschaftsfuhrer | 6 | 7 | 5 | 4 | 5 |
| 5 | Anna-Lena Fischer | Projektleiterin | 7 | 7 | 5 | 5 | 6 |
| 6 | Tim Winkler | Junior Einkaufer | 6 | 8 | 5 | 6 | 6 |
| 7 | Rainer Bock | Metallhandler | 4 | 6 | 3 | 2 | 4 |
| 8 | Prof. Dr. Hartmann | Architekt | 6 | 7 | 3 | 3 | 5 |
| 9 | Sabine Kruger | Buchhalterin | 4 | 6 | 3 | 2 | 4 |
| 10 | Oliver Brandt | Bauberater | 7 | 7 | 5 | 5 | 6 |
| | **AVERAGE** | | **5.6** | **6.9** | **4.6** | **3.8** | **5.2** |

### Key Metrics

| Metric | Value |
|--------|-------|
| **Average Overall Score** | 5.2 / 10 |
| **Average First Impression** | 5.6 / 10 |
| **Average Navigation** | 6.9 / 10 |
| **Average Value Clarity** | 4.6 / 10 |
| **Average Willingness to Pay** | 3.8 / 10 |
| **Personas completing Landing -> Understand Value -> Sign Up** | 3 / 10 (30%) |
| **Personas who understand the value clearly** | 2 / 10 (20%) -- #2 Stefan (Telegram alerts), #6 Tim (would try anything) |
| **Personas blocked by missing key feature visibility** | 7 / 10 (70%) |

### Which Personas Complete the Main Flow?

The main flow is: Landing -> Understand Value -> Sign Up.

| Persona | Completes Flow? | Blocker |
|---------|:--------------:|---------|
| #1 Klaus | NO | Trust deficit (gmail, no testimonials) |
| #2 Stefan | YES (tentative) | Would sign up for trial on curiosity |
| #3 Markus | NO | Key features (Preisgleitklausel, export) invisible |
| #4 Jorg | NO | AI features require 3x entry price; no demo |
| #5 Anna-Lena | MAYBE | Interested but cannot validate project grouping |
| #6 Tim | YES | Low friction threshold, would try anything with a free trial |
| #7 Rainer | NO | Key feature (Legierungsrechner) invisible |
| #8 Prof. Hartmann | NO | Preisgleitklausel missing; PDF pricing mismatch |
| #9 Sabine | NO | Too technical; PDF too expensive |
| #10 Oliver | YES (tentative) | Would try trial; PDF pricing is a concern |

**Conversion estimate: 30% of personas would sign up for trial.** Only 20% would convert to paid.

---

## TOP 5 PROBLEMS (Ranked by Severity x Personas Affected)

### Problem #1: No Product Demo, Screenshots, or Video (CRITICAL)
- **Severity:** 9/10
- **Personas affected:** 10/10 (all)
- **Impact:** No persona can see what the dashboard looks like before signing up. German B2B buyers are conservative -- they need to see the product working before committing time to a trial. The absence of a single dashboard screenshot, an interactive demo, or a 60-second video is the #1 conversion killer.
- **Fix:** Add 3-5 product screenshots to the landing page. Create a 60-second video walkthrough. Consider an interactive demo (public read-only dashboard with sample data).

### Problem #2: Key Features Invisible on Marketing Pages (CRITICAL)
- **Severity:** 9/10
- **Personas affected:** 7/10 (#1, #3, #5, #6, #7, #8, #10)
- **Impact:** The features that differentiate BauPreis -- Legierungsrechner, Preisgleitklausel, AI Chat, project grouping, PDF reports -- are not mentioned or are barely mentioned on the landing page. Personas arrive looking for specific capabilities and leave without discovering them.
- **Fix:** Create dedicated feature sections or pages: "Legierungsrechner," "Preisgleitklausel," "KI-Assistent." Add use-case sections to the landing page targeting specific roles (Einkaufer, Kalkulator, Architekt, Metallhandler).

### Problem #3: Trust Deficit for German B2B Market (HIGH)
- **Severity:** 8/10
- **Personas affected:** 8/10 (#1, #3, #4, #5, #7, #8, #9, #10)
- **Impact:** The contact page shows a personal Gmail address. The About Us page has no team information, no company story, no customer testimonials, no logos, no certifications. For German B2B users (especially in construction), trust is non-negotiable. A company asking for 49-299 EUR/month must demonstrate credibility.
- **Fix:** Replace gmail with a professional @baupreis.ai email. Add team section to About Us. Add 3-5 customer testimonials (even if initially from beta users). Add trust badges (GDPR, German hosting, data sources). Display a professional address in the Impressum.

### Problem #4: PDF Reports Locked to Team Plan -- Pricing Mismatch (HIGH)
- **Severity:** 7/10
- **Personas affected:** 5/10 (#1, #5, #8, #9, #10)
- **Impact:** PDF export is a critical feature for architects, accountants, project managers, and consultants. It is currently only available on the Team plan (299 EUR/month), which also bundles 5 users and API access. Personas #8 (Architect) and #10 (Consultant) need PDF but not multi-user -- they are forced to overpay 2x. This creates a pricing mismatch that blocks conversion.
- **Fix:** Consider adding PDF export to Pro plan (perhaps limited to X reports/month) or create a "Pro Plus" tier. Alternatively, offer PDF as an add-on.

### Problem #5: No Plan Selection in Sign-Up Flow (MEDIUM)
- **Severity:** 6/10
- **Personas affected:** 10/10 (all)
- **Impact:** All sign-up CTAs go to the same `/sign-up` page without indicating which plan the user is signing up for. The trial experience is undefined -- does the trial include Pro features? Team features? Personas who clicked "7 Tage kostenlos" on the Team plan card expect Team features, but the sign-up does not confirm this. This creates uncertainty and may lead to post-signup disappointment.
- **Fix:** Pass plan selection to sign-up (e.g., `/sign-up?plan=pro`). Show selected plan on the sign-up page. Clarify trial features: "7 Tage alle Pro-Funktionen kostenlos."

---

## ADDITIONAL PROBLEMS (Ranked)

### Problem #6: Blog is Empty (MEDIUM)
- **Severity:** 5/10
- **Personas affected:** 6/10 (anyone checking credibility)
- **Impact:** An empty blog signals "nobody is working on this product." Content marketing is critical for SEO and trust in German B2B. Delete the link or publish initial content.

### Problem #7: No Role-Based or Use-Case Messaging (MEDIUM)
- **Severity:** 5/10
- **Personas affected:** 7/10
- **Impact:** The landing page speaks to a generic "Bauunternehmen" but does not address specific roles (Einkaufer, Kalkulator, Bauleiter, Architekt, Metallhandler, Buchhalter). Each persona has different pain points and priorities. A section like "Fur Einkaufer | Fur Kalkulatoren | Fur Architekten" would dramatically improve value clarity.

### Problem #8: No Data Methodology or Accuracy Statement (MEDIUM)
- **Severity:** 5/10
- **Personas affected:** 4/10 (#1, #3, #7, #8)
- **Impact:** Users who make purchasing decisions based on price data need to trust its accuracy. No accuracy guarantees, methodology descriptions, or data freshness indicators are provided.

### Problem #9: AI Features Promised but Not Demonstrated (MEDIUM)
- **Severity:** 6/10
- **Personas affected:** 6/10 (#3, #4, #5, #6, #8, #10)
- **Impact:** "KI-Prognosen" is a headline feature but no sample output, accuracy metrics, or demo is shown. Users cannot evaluate AI quality before paying.

### Problem #10: No Contact Phone Number or Response Time SLA (LOW)
- **Severity:** 4/10
- **Personas affected:** 4/10 (#1, #5, #8, #9)
- **Impact:** German B2B buyers expect a phone number or at least a response time guarantee. "Wir melden uns schnellstmoglich" is vague.

---

## RECOMMENDATIONS FOR NEXT SPRINT (Priority Order)

### Sprint Priority 1 -- Trust & Conversion (1-2 weeks)
1. **Add 3-5 dashboard screenshots to the landing page** -- show the product
2. **Replace gmail with @baupreis.ai contact email** -- basic B2B hygiene
3. **Add team section to About Us** -- names, roles, optional photos
4. **Add 2-3 testimonials** (beta users, early adopters, or crafted credible examples)
5. **Either publish 2-3 blog posts or remove the Blog link from navigation**

### Sprint Priority 2 -- Feature Visibility (1-2 weeks)
6. **Add dedicated feature sections** on the landing page for: Legierungsrechner, KI-Chat, Preisgleitklausel, Telegram-Alarme
7. **Add role-based use cases** section: "Fur Einkaufer | Fur Architekten | Fur Metallhandler"
8. **Show sample AI analysis** output on the landing page (even a static example)
9. **Add a materials list** page or section showing all 16 materials explicitly

### Sprint Priority 3 -- Pricing & Sign-Up (1 week)
10. **Pass plan parameter to sign-up** (e.g., `/sign-up?plan=pro`)
11. **Clarify trial features** on the sign-up page
12. **Consider PDF at Pro level** (limited reports/month)
13. **Add a plan recommendation quiz** or "Best for your role" guidance

### Sprint Priority 4 -- Content & SEO (Ongoing)
14. **Publish initial blog content:** market analysis, Preisgleitklausel guide, material trend overview
15. **Add FAQ to pricing page** (already exists on landing; replicate or link)
16. **Create a data methodology page** describing sources, update frequency, accuracy approach

---

## VERDICT

**Overall Product Score: 5.2 / 10**

The technical foundation is solid (Next.js, responsive, fast). The core value proposition (save money on material procurement through better timing) is strong and resonates with 8/10 personas. However, the public-facing marketing fails to convert because:

1. The product is invisible -- no one can see what they are buying
2. Key differentiating features are hidden behind the paywall
3. Trust signals are inadequate for the German B2B construction market
4. The pricing structure creates mismatches for 5/10 personas

**The product is better than its marketing.** Fixing the top 5 problems would likely raise the conversion estimate from 30% to 60%+ of target personas reaching the trial sign-up.

---

*Report prepared by: #11 UX Research Lead -- Dr. Katrin Engel*
*Date: 2026-02-26*
*Next review: After Sprint Priority 1 changes are deployed*
