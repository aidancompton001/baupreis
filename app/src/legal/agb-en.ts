import type { LegalContent } from "./index";

const content: LegalContent = {
  heading: "Terms of Service",
  date: "Last Updated: February 2026",
  sections: [
    {
      title: "1. Scope of Application",
      content: `(1) APPLICABILITY

These Terms of Service ("Terms") govern your use of the BauPreis AI service (the "Service") provided by Hanna Pashchenko, Individual Entrepreneur ("we", "us", or "our").

By accessing or using our Service, you agree to be bound by these Terms.

These Terms apply to all contracts for the use of our Service between us and our customers ("Customer" or "you").

Service Provider:
Hanna Pashchenko
Individual Entrepreneur
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
Email: pashchenkoh@gmail.com

(hereinafter "Provider", "we" or "us")

(2) BUSINESS AND CONSUMER CUSTOMERS

Our Service is available for both business customers (B2B) and individual consumers (B2C). Additional consumer protection provisions apply to consumers (see Section 6.5 - Right of Withdrawal).

(3) NO ACCEPTANCE OF CUSTOMER TERMS

We do not accept any conflicting or deviating terms and conditions of the Customer unless we have expressly agreed to their validity in writing.`,
    },
    {
      title: "2. Service Description and Scope",
      content: `(1) OVERVIEW

BauPreis AI provides a Software-as-a-Service (SaaS) platform for real-time monitoring of construction material prices, including:
- Price monitoring for up to 16 construction materials
- AI-powered price forecasts and recommendations
- Price alerts via email and/or Telegram
- Historical price data and trend analysis
- API access (Team plan only)

(2) SUBSCRIPTION PLANS

We offer three subscription plans:

BASIS PLAN (\u20AC49/month or \u20AC470/year)
\u2713 Monitor 5 materials
\u2713 1 user
\u2713 3 price alerts
\u2713 Daily email reports
\u2713 2x daily price updates
\u2713 30-day price history
\u2717 Telegram alerts
\u2717 AI forecasts
\u2717 API access

PRO PLAN (\u20AC149/month or \u20AC1,430/year)
\u2713 All 16 materials
\u2713 1 user
\u2713 Unlimited price alerts
\u2713 Daily + weekly reports
\u2713 4x daily price updates
\u2713 Telegram alerts
\u2713 AI forecasts & recommendations
\u2713 90-day price history
\u2717 API access
\u2717 Multi-user access

TEAM PLAN (\u20AC299/month or \u20AC2,870/year)
\u2713 All 16 materials
\u2713 Up to 5 users
\u2713 Unlimited price alerts
\u2713 All reports incl. PDF export
\u2713 4x daily price updates
\u2713 Telegram + Email alerts
\u2713 AI forecasts & recommendations
\u2713 365-day price history
\u2713 API access (10,000 requests/day)
\u2713 Dedicated support (24h response time)
\u2713 Priority onboarding

Detailed feature descriptions: https://baupreis.ais152.com/pricing

(3) SERVICE LEVEL

We strive to provide reliable service:

a) Target Availability: 99.5% monthly uptime (excluding planned maintenance)

b) Planned Maintenance:
- Announced at least 72 hours in advance via email
- Preferably outside business hours (20:00-06:00 CET)
- Maximum duration: 4 hours per month

c) Emergency Maintenance:
- For critical security issues or severe errors
- Immediate notification via email and status page
- May be performed without advance notice

d) Support Response Times (Business days Mon-Fri, 09:00-17:00 CET):
- Basis Plan: 48 hours
- Pro Plan: 48 hours
- Team Plan: 24 hours

e) Downtime Compensation:
For unplanned outages exceeding 4 hours (cumulative per month):
- Credit: 1 day service fee per 4 hours downtime
- Maximum credit: 30% of monthly fee
- Credit request: within 14 days via email

(4) SERVICE LIMITATIONS

The Service is provided "as is". We do not guarantee:
a) Uninterrupted or error-free operation
b) Complete accuracy or timeliness of all price data
c) Availability of all data sources at all times
d) Specific results or savings from AI forecasts
e) Compatibility with all devices, browsers, or operating systems

(5) DATA SOURCES

Price data is sourced from:
- London Metal Exchange (LME) via Metals.Dev API
- National statistical offices (e.g., Destatis)
- Market data providers

We make reasonable efforts to ensure data quality but cannot guarantee completeness, accuracy, or timeliness of all data as we depend on third-party sources.`,
    },
    {
      title: "3. Registration and User Account",
      content: `(1) ACCOUNT CREATION

To use the Service, you must create an account by providing:
- Email address
- Full name
- Company name (optional, for business customers)
- Password
- Country/region

(2) ACCURACY REQUIREMENT

You must provide accurate and complete information and keep it up to date.

(3) ACCOUNT SECURITY

You are responsible for:
a) Maintaining the confidentiality of your account credentials
b) All activities that occur under your account
c) Notifying us immediately of any unauthorized use
d) Using a secure password

(4) USAGE RESTRICTIONS

You may not use the Service for:
a) Unlawful purposes or violations of applicable law
b) Reverse engineering, decompiling, or disassembling the software
c) Resale, rental, or sublicensing without permission
d) Creating a competing product or service
e) Attempting to hack, disrupt, or damage the Service
f) Automated mass queries (except via official API in Team plan)
g) Benchmarking purposes without written permission
h) Sharing your account with third parties

(5) ACCOUNT SUSPENSION

Upon violation of (4), we may:
a) Temporarily suspend access (after warning with deadline)
b) Terminate the contract extraordinarily (for serious violations)
c) Claim damages`,
    },
    {
      title: "4. Free Trial",
      content: `(1) TRIAL PERIOD

New customers receive a 7-day free trial period from registration. During the trial:
- Full access to all features of the selected plan
- No payment required
- No credit card required
- Cancellable anytime without reason

(2) AFTER TRIAL END

After the 7-day trial period:
- Access will be automatically suspended
- No automatic charges without your explicit consent
- Prompt to select a paid subscription plan
- Data retained for 30 days (for potential activation)

(3) TRIAL LIMITATIONS

The free trial is limited to one trial per customer/company. We reserve the right to prevent abuse through:
- Email verification
- Rejection upon suspicion of multiple registrations
- IP-based restrictions`,
    },
    {
      title: "5. Pricing, Payment, and Invoicing",
      content: `(1) PRICES

Current prices are available at https://baupreis.ais152.com/pricing
All prices are final prices.

Annual payment: Discount of 2 months (pay for 10, use for 12 months).

(2) VALUE ADDED TAX (VAT)

As a Ukrainian individual entrepreneur based outside the European Union, we are not subject to EU VAT obligations.

a) GENERAL PRINCIPLE:
All displayed prices are final prices.
No EU VAT will be added.

b) FOR EU BUSINESS CUSTOMERS (B2B with valid VAT ID):
The reverse charge mechanism applies pursuant to Art. 196 of Directive 2006/112/EC (VAT Directive):
- Our invoice shows NO VAT
- Invoice note: "Reverse Charge - Customer liable for VAT"
- You are obligated to self-account VAT in your country
- Your VAT ID will be validated upon registration (optional)
- This is tax-neutral as you can simultaneously deduct VAT as input tax

c) FOR EU PRIVATE CUSTOMERS (B2C):
The displayed price is the final price.
No additional taxes will be charged.
As a provider based outside the EU, we do not charge EU VAT. This is your price advantage compared to EU providers.

d) FOR NON-EU CUSTOMERS:
No EU VAT.
Any local taxes (e.g., Sales Tax, GST) applicable in your country are your responsibility.

(3) PAYMENT TERMS

a) Payment Provider:
Payment is processed exclusively via PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembourg.

b) Billing Cycles:
- MONTHLY: Billed monthly in advance, automatic renewal
- ANNUALLY: Billed annually in advance, automatic renewal

c) Authorization:
By subscribing to a paid plan, you authorize PayPal to automatically charge fees.

d) Due Date:
Fees are due immediately upon subscription or renewal.

(4) INVOICING

a) Invoices sent electronically via email
b) Sent within 3 business days after payment receipt
c) Invoices in PDF format
d) Retention requirement: Customer must retain invoices for tax purposes

(5) PAYMENT DEFAULT

If payment fails:
Day 0: Payment attempt fails
Day 3: Automatic second payment attempt
Day 7: Email notification + third attempt
Day 10: Warning email - access will be suspended in 4 days
Day 14: Access suspended (read-only mode)
Day 30: Contract may be terminated extraordinarily

Payment obligations for services already rendered remain upon suspension.

(6) PRICE CHANGES

a) We reserve the right to change prices with 30 days' notice
b) Existing customers: New prices apply from next renewal
c) Upon price increase: Special termination right within 14 days of announcement`,
    },
    {
      title: "6. Contract Term and Termination",
      content: `(1) CONTRACT START AND DURATION

The contract begins upon completion of registration and runs for the selected billing period (1 month or 12 months) with automatic renewal for the same period.

(2) ORDINARY TERMINATION BY CUSTOMER

a) Termination option: Anytime
b) Notice period: None
c) Effect: At the end of current billing period
d) Termination method:
- Via account settings (self-service)
- Via email to: pashchenkoh@gmail.com
- Written form (email) sufficient
e) No refund for unused period
f) Access remains active until end of paid period

(3) ORDINARY TERMINATION BY PROVIDER

We may terminate the contract with 30 days' notice to the end of a billing period.

(4) EXTRAORDINARY TERMINATION

Both parties may terminate the contract for cause without notice.

Cause for us includes:
a) Violation of Section 3(4) (usage restrictions)
b) Unlawful use of the Service
c) Payment default exceeding 30 days
d) Attempting to hack, disrupt, or damage the Service
e) Sharing account with third parties
f) Using for benchmarking without permission
g) Repeated violations despite warning

We will generally set a reasonable deadline for remedy (14 days) before extraordinary termination, unless the violation is so severe that a deadline is unreasonable.

(5) RIGHT OF WITHDRAWAL FOR CONSUMERS

CONSUMERS HAVE A 14-DAY RIGHT OF WITHDRAWAL

RIGHT OF WITHDRAWAL NOTICE

Right of Withdrawal

You have the right to withdraw from this contract within fourteen days without giving any reason.

The withdrawal period is fourteen days from the date of contract conclusion.

To exercise your right of withdrawal, you must inform us:

Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
Email: pashchenkoh@gmail.com

by means of a clear statement (e.g., a letter sent by post or email) of your decision to withdraw from this contract. You may use the model withdrawal form below, but this is not mandatory.

To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.

Consequences of Withdrawal

If you withdraw from this contract, we shall reimburse to you all payments received from you, without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.

Early Expiration of Right of Withdrawal

The right of withdrawal expires prematurely if you have expressly consented to us beginning the execution of the contract before the expiry of the withdrawal period, and you have confirmed your knowledge that you will lose your right of withdrawal upon commencement of contract execution.

END OF RIGHT OF WITHDRAWAL NOTICE

MODEL WITHDRAWAL FORM

(Complete and return this form only if you wish to withdraw from the contract)

To:
Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
Email: pashchenkoh@gmail.com

I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service:

BauPreis AI - Plan: _________________
Ordered on (*)/received on (*): _________________
Name of consumer(s): _________________
Address of consumer(s): _________________
Signature of consumer(s) (only if this form is notified on paper): _________________
Date: _________________

(*) Delete as applicable.

(6) EFFECTS OF TERMINATION

After contract end (cancellation or withdrawal):
a) Access to Service ends (or remains until end of paid period)
b) Data enters "read-only" mode for 90 days
c) Within 90 days: Customer may export data
d) After 90 days: Permanent deletion of all customer data
e) Exception: Invoice data (10-year retention requirement)
f) Outstanding payment obligations remain`,
    },
    {
      title: "7. Availability and Maintenance",
      content: `(1) AVAILABILITY TARGET

We strive for 99.5% availability per calendar month (excluding planned maintenance).

(2) PLANNED MAINTENANCE

a) Announcement: At least 72 hours in advance via email
b) Timing: Preferably 20:00-06:00 CET (outside business hours)
c) Frequency: Maximum once monthly
d) Duration: Maximum 4 hours per occurrence

(3) EMERGENCY MAINTENANCE

For critical security vulnerabilities or severe technical issues, maintenance may be performed without advance notice. We will notify immediately via email and status page.

(4) DOWNTIME COMPENSATION

For unplanned outages exceeding 4 hours cumulative per month:

Downtime Duration    | Credit
---------------------|-------------------------
4-8 hours            | 1 day (\u22483.3% monthly fee)
8-12 hours           | 2 days (\u22486.6% monthly fee)
12-24 hours          | 4 days (\u224813.3% monthly fee)
>24 hours            | 30% monthly fee (maximum)

Credit request within 14 days via email.
Credit applied to next invoice.

(5) FORCE MAJEURE

No liability for outages due to force majeure (natural disasters, war, terrorism, power failures, internet backbone disruptions, etc.).`,
    },
    {
      title: "8. Warranty and Liability",
      content: `(1) LEGAL BASIS

We are liable according to statutory provisions, unless otherwise specified below.

(2) UNLIMITED LIABILITY

We are fully liable without limitation for:
a) Intent or gross negligence
b) Injury to life, body, or health
c) Claims under product liability laws
d) Warranties or guarantees expressly given by us
e) Fraudulent concealment of defects

(3) LIMITED LIABILITY FOR SIMPLE NEGLIGENCE

For simple negligence, we are liable only:
a) For breach of essential contractual obligations (cardinal obligations)
b) Limited to the typical, foreseeable damage

Essential contractual obligations (cardinal obligations) are those obligations whose fulfillment enables the proper execution of the contract and upon whose compliance the customer regularly relies.

(4) LIABILITY CAPS

For simple negligence, our liability is limited to:
a) Per incident: \u20AC50,000
b) Per year (aggregate): \u20AC100,000
c) For data loss: Costs of data recovery from backups

(5) EXCLUSION OF LIABILITY

Liability is excluded for:
a) Indirect or consequential damages
b) Loss of profit or revenue
c) Loss of data or business opportunities
d) Data loss due to customer's lack of backups
e) Disruptions by third-party providers (PayPal, data sources, hosting)
f) Force majeure and extraordinary circumstances
g) Actions or omissions of the customer
h) Inaccuracies in data from third-party sources
i) Financial losses due to purchasing decisions

(6) NO INVESTMENT ADVICE - IMPORTANT DISCLAIMER

IMPORTANT NOTICE - PLEASE READ CAREFULLY

The AI forecasts, price recommendations, and market analyses provided by BauPreis AI are for INFORMATIONAL PURPOSES ONLY.

They do NOT constitute:
\u2717 Investment advice
\u2717 Purchase recommendations
\u2717 Financial advice
\u2717 Guarantees of future price developments
\u2717 Legal advice

The Customer bears SOLE RESPONSIBILITY for:
\u2713 Their purchasing decisions
\u2713 The timing of orders
\u2713 The selection of suppliers
\u2713 All financial consequences of their decisions

Historical price developments and AI forecasts are NOT guarantees of future results. Construction material prices can fluctuate unpredictably.

WE ARE NOT LIABLE for:
- Financial losses from purchasing decisions
- Lost profits from missed price opportunities
- Losses from inaccurate forecasts
- Damages from delays in data updates

(7) BURDEN OF PROOF

The customer bears the burden of proof for the existence of the prerequisites of a damage claim.

(8) LIMITATION PERIOD

Damage claims are subject to statutory limitation periods.`,
    },
    {
      title: "9. Data Processing and Privacy",
      content: `(1) APPLICATION OF PRIVACY POLICY

The processing of personal data is carried out in accordance with our Privacy Policy and the requirements of the EU General Data Protection Regulation (GDPR).

The Privacy Policy is available at:
https://baupreis.ais152.com/privacy

(2) DATA PROCESSING AGREEMENT (DPA)

For business customers on the Team plan who process their own customer data, we provide a separate Data Processing Agreement (DPA) pursuant to Art. 28 GDPR upon request.

Request via email to: privacy@baupreis.ai

(3) SUB-PROCESSORS

We engage the following sub-processors:

1. Hetzner Online GmbH (Hosting)
   Location: Nuremberg, Germany

2. PayPal (Europe) S.à r.l. et Cie, S.C.A. (Payments)
   Location: Luxembourg

3. Clerk, Inc. (Authentication)
   Location: USA (Servers: AWS Frankfurt, Germany)

4. Google Ireland Limited (Analytics, optional)
   Location: Ireland (data may be transferred to USA)

5. Metals.Dev (API data)
   Governing law: India (Servers: Council Bluffs, Iowa, USA via Google Cloud)

Current list: https://baupreis.ais152.com/sub-processors

Changes or additions of new sub-processors will be announced 30 days in advance.

(4) DATA RETENTION AFTER CONTRACT END

After contract termination:
- 0-90 days: Data in read-only mode (export option)
- After 90 days: Permanent deletion of all customer data
- Exception: Invoice data (10-year statutory retention)

(5) DATA EXPORT

Customer may export data at any time:
- Format: JSON or CSV
- Via account settings \u2192 Data export
- Or via email request to: pashchenkoh@gmail.com

(6) DATA SECURITY

We implement technical and organizational measures:
- SSL/TLS encryption (HTTPS)
- Encrypted password storage (bcrypt)
- Access restrictions
- Regular security updates
- Daily backups (7-day retention)`,
    },
    {
      title: "10. Usage Rights and Intellectual Property",
      content: `(1) LICENSE GRANT

We grant the customer for the contract duration a simple, non-exclusive, non-transferable, non-sublicensable license to use the Service.

(2) SOFTWARE OWNERSHIP

All rights, title, and interest in the software, including:
- Source code and object code
- Algorithms and AI models
- Designs and user interfaces
- Documentation
- Trademarks and logos
remain exclusively with us.

(3) PROHIBITED ACTIONS

The customer may not:
a) Copy, modify, or create derivative works of the software
b) Reverse engineer, decompile, or disassemble
c) Remove copyright or proprietary notices
d) Use the software to create a competing product
e) Circumvent technical protection measures
f) Use parts of the software in isolation

(4) CUSTOMER DATA

The customer retains all rights to their own data (configurations, exported reports, etc.). We do not claim ownership of customer data.

(5) FEEDBACK AND SUGGESTIONS

If the customer provides feedback, suggestions, or improvement ideas, we may use them without compensation or obligation.

(6) API USAGE (TEAM PLAN ONLY)

For API usage, additionally apply:
- Rate limit: 10,000 requests per day
- Only for own business purposes
- No resale of API data
- API key may not be shared`,
    },
    {
      title: "11. Changes to Terms",
      content: `(1) RIGHT TO MODIFY

We reserve the right to modify these Terms if:
a) Legal or regulatory requirements mandate it
b) Court decisions necessitate adjustments
c) Technical changes to the Service require it
d) Market-related adjustments are reasonable
e) Changes are reasonable and not disadvantageous to the customer

(2) NOTIFICATION OF CHANGES

Material changes will be communicated to the customer at least 30 days before taking effect via email. Changes will be highlighted in the email.

(3) RIGHT TO OBJECT

The customer may object to changes within 30 days after receipt of the change notification.

Objection must be:
- In writing (email sufficient)
- To: pashchenkoh@gmail.com
- Within 30 days

(4) CONSEQUENCES OF OBJECTION

Upon timely objection:
a) The changes do not apply to the objecting customer
b) We may terminate the contract with 30 days' notice
c) The customer may also terminate extraordinarily

(5) DEEMED ACCEPTANCE

If the customer does not object within 30 days and continues to use the Service, the amended Terms are deemed accepted.`,
    },
    {
      title: "12. Governing Law and Jurisdiction",
      content: `(1) GOVERNING LAW

These Terms and all legal relationships between us and the customer are governed by the law of Ukraine, excluding the UN Convention on Contracts for the International Sale of Goods (CISG).

(2) EU CONSUMER PROTECTION

For consumers residing in the European Union, mandatory consumer protection provisions of their country of residence additionally apply, particularly regarding:
- Right of withdrawal (14 days)
- Warranty rights
- Information obligations
- Prohibition of abusive clauses
- Price indication requirements

These Terms cannot restrict mandatory consumer rights.

(3) JURISDICTION

a) FOR DISPUTES WITH BUSINESS CUSTOMERS:
Exclusive jurisdiction is Kyiv, Ukraine.

b) FOR DISPUTES WITH CONSUMERS:
- Consumers may sue at the court of their residence
- We may only sue consumers at their place of residence
- For cross-border disputes: Jurisdiction according to Brussels Ia Regulation or national provisions

(4) ALTERNATIVE DISPUTE RESOLUTION

We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.

Information about alternative dispute resolution bodies for EU consumers:
https://consumer-redress.ec.europa.eu/dispute-resolution-bodies

Note: The EU Online Dispute Resolution Platform (ec.europa.eu/odr) was discontinued on July 20, 2025.`,
    },
    {
      title: "13. Miscellaneous Provisions",
      content: `(1) ENTIRE AGREEMENT

These Terms together with the Privacy Policy constitute the entire agreement between the parties and supersede all prior oral or written agreements.

(2) ASSIGNMENT AND TRANSFER

a) Customer may not assign or transfer rights and obligations from this contract without our written consent.
b) We may transfer our rights and obligations to:
- Affiliated companies
- In connection with company sales, mergers, or restructurings
- Customer notification 30 days in advance

(3) SEVERABILITY CLAUSE

If individual provisions of these Terms are or become invalid or unenforceable, the validity of the remaining provisions remains unaffected.

The invalid provision shall be replaced by a valid one that comes closest to the economic purpose of the invalid provision.

(4) NO WAIVER

Failure to exercise or delay in exercising a right under these Terms does not constitute a waiver of that right.

(5) LANGUAGE

These Terms are drafted in English. In case of translations into other languages, the English version prevails in case of doubt.

(6) WRITTEN FORM REQUIREMENT

Amendments and supplements to these Terms require written form. This also applies to the waiver of this written form requirement.

Written form is maintained for:
- Signed document (paper or PDF)
- Email with express confirmation by both parties
- Digital signature

Exception: Section 11 (Changes to Terms) establishes a special procedure.

(7) NOTIFICATIONS

All notifications under these Terms are made:
- To Customer: To the email address provided upon registration
- To Us: To pashchenkoh@gmail.com

Notifications are deemed received:
- For email: Upon receipt in inbox (delivery confirmation)
- For post: 3 business days after mailing

Customer is obligated to keep their email address up to date.`,
    },
    {
      title: "Contact Information",
      content: `For questions about these Terms:

Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine

Email: pashchenkoh@gmail.com
Support: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com

Support Business Hours:
Monday - Friday, 09:00 - 17:00 CET

Last Updated: February 2026
Version: 1.0`,
    },
  ],
};

export default content;
