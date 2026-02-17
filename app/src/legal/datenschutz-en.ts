import type { LegalContent } from "./index";

const content: LegalContent = {
  heading: "Privacy Policy",
  date: "Last Updated: February 2026",
  sections: [
    {
      title: "1. Controller and Contact",
      content: `Data Controller:

Hanna Pashchenko
Individual Entrepreneur
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine

Email: pashchenkoh@gmail.com
Privacy Contact: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com`,
    },
    {
      title: "2. Legal Basis for Processing",
      content: `We process personal data in accordance with:

- EU General Data Protection Regulation (GDPR) - Regulation (EU) 2016/679
- ePrivacy Directive - Directive 2002/58/EC
- German Federal Data Protection Act (BDSG)
- German Telecommunications and Telemedia Data Protection Act (TTDSG)
- Ukrainian Data Protection Law

The specific legal basis for each processing activity is indicated in the relevant data collection section.`,
    },
    {
      title: "3. Collection and Processing of Personal Data",
      content: `3.1 REGISTRATION AND ACCOUNT DATA

When creating a user account, we collect:

Mandatory Information:
- Email address
- First and last name
- Password (encrypted with bcrypt)

Voluntary Information:
- Company name/business designation
- Country/region
- VAT identification number (VAT ID) - optional for EU business customers

Purpose: Contract fulfillment, service provision, user authentication, invoicing
Legal Basis: Art. 6(1)(b) GDPR (contract performance)

Retention Period:
- During contract term
- 90 days after contract end (read-only access)
- Invoice data: 10 years (tax retention requirement)

3.2 PAYMENT DATA

Payment processing is handled by PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembourg.

Data transmitted to PayPal:
- Email address
- Amount and currency
- Transaction description
- Billing address (if provided)

WE DO NOT STORE:
- Credit card numbers
- Bank account details
- Complete payment information

We receive from PayPal only:
- Transaction ID
- Payment status
- Payment timestamp

Purpose: Payment processing, fraud prevention, invoicing
Legal Basis: Art. 6(1)(b) GDPR (contract performance)

PayPal Privacy Policy:
https://www.paypal.com/privacy

PayPal Data Transfer: Data may be transferred to the USA. PayPal is certified under the EU-US Data Privacy Framework and uses Standard Contractual Clauses (SCC) pursuant to Art. 46 GDPR.

Retention Period: 10 years (tax retention requirement)

3.3 USAGE DATA (AUTOMATICALLY COLLECTED)

When accessing our website and service, we automatically collect:

Technical Data:
- IP address (anonymized after 24 hours)
- Browser type and version
- Operating system
- Referrer URL (previously visited page)
- Hostname of accessing computer
- Time of server request
- HTTP status code

Usage Behavior:
- Pages visited
- Duration of visit
- Click path
- Device information (Desktop/Mobile/Tablet)

Purpose:
- Ensuring system stability
- Detection and defense against attacks
- Error analysis and optimization
- Statistical evaluation

Legal Basis: Art. 6(1)(f) GDPR (legitimate interest)
Legitimate Interest: Ensuring IT security, improving user experience, preventing abuse

Retention Period:
- IP addresses: Anonymization after 24 hours
- Logs: 7 days
- Aggregated statistics (anonymized): unlimited

3.4 COMMUNICATION DATA

When you contact us (email, support ticket):

Collected Data:
- Email address
- Name
- Message content
- Communication timestamp
- Attachments (if any)

Purpose: Processing your inquiry, customer support, pre-contractual measures

Legal Basis:
- Art. 6(1)(b) GDPR (pre-contractual measures)
- Art. 6(1)(f) GDPR (legitimate interest for general inquiries)

Retention Period:
- Until complete processing of inquiry
- Plus 3 years (for potential follow-up questions)

3.5 SERVICE USAGE DATA

Your configurations and settings in the service:

Stored Data:
- Selected materials to monitor
- Price alerts and thresholds
- Notification settings
- Telegram account link (if activated)
- API keys (Team plan only)
- Exported reports and data

Purpose: Provision of contractually agreed functions
Legal Basis: Art. 6(1)(b) GDPR (contract performance)

Retention Period:
- During contract term
- 90 days after contract end
- Then: Permanent deletion`,
    },
    {
      title: "4. Hosting and Infrastructure",
      content: `4.1 HETZNER ONLINE GMBH

Our service is hosted by:

Provider: Hetzner Online GmbH
Address: Industriestr. 25, 91710 Gunzenhausen, Germany
Website: https://www.hetzner.com
Server Location: Nuremberg, Germany (EU)

Processed Data:
- All website and application data
- Databases with user information
- Server logs (IP addresses, access times)
- Backup data

Purpose: Provision of technical infrastructure
Legal Basis: Art. 6(1)(b) GDPR (contract performance)
Data Processing Agreement (DPA): Concluded pursuant to Art. 28 GDPR

Data Security:
- ISO 27001 certified data centers
- Redundant power supply
- Fire protection systems
- Physical access control
- 24/7 monitoring

Privacy Policy: https://www.hetzner.com/legal/privacy-policy

Backup Strategy:
- Daily backups (complete)
- Retention: 7 days
- Encrypted storage
- Geographically separated backup locations (Germany)`,
    },
    {
      title: "5. Third-Party Services",
      content: `5.1 PAYPAL (PAYMENT PROCESSING)

Provider: PayPal (Europe) S.à r.l. et Cie, S.C.A.
Address: 22-24 Boulevard Royal, L-2449 Luxembourg

Purpose: Payment processing, fraud prevention, invoicing

Processed Data:
- Email address
- Payment information
- Transaction data
- Amount and currency
- Billing address

Legal Basis: Art. 6(1)(b) GDPR (contract performance)

Data Transfer to Third Countries:
- PayPal may transfer data to the USA
- Certification: EU-US Data Privacy Framework
- Safeguards: Standard Contractual Clauses (SCC) pursuant to Art. 46 GDPR
- Adequacy decision for USA participants

Privacy Policy:
https://www.paypal.com/privacy

5.2 CLERK (AUTHENTICATION AND USER MANAGEMENT)

Provider: Clerk, Inc.
Address: USA

Purpose: User authentication, session management, account security

Processed Data:
- Email address
- Name
- Password (hashed, never in plain text)
- Login timestamps
- Session data
- Authentication tokens
- IP address (for security checks)

Legal Basis: Art. 6(1)(b) GDPR (contract performance)

Server Location: AWS EU Region (Frankfurt, Germany)

Special Note: Although Clerk is a US company, all data of European users is stored on servers in the EU (Frankfurt).

Data Transfer: Minimal transfer to USA only for:
- Technical support
- Security analyses

Safeguards: Standard Contractual Clauses (SCC)
Data Processing Agreement: Available upon request
Privacy Policy: https://clerk.com/legal/privacy

Security Measures:
- Multi-factor authentication (MFA) available
- Encrypted communication (TLS 1.3)
- Password hashing with bcrypt
- Anomaly detection for logins

5.3 GOOGLE ANALYTICS (OPTIONAL - ONLY WITH CONSENT)

If activated, we use Google Analytics for web analysis:

Provider: Google Ireland Limited
Address: Gordon House, Barrow Street, Dublin 4, Ireland
Parent Company: Google LLC, USA

Purpose: Website analysis, user behavior analysis, optimization

Processed Data:
- IP address (ANONYMIZED - last octet removed)
- Browser and device information
- Pages and subpages visited
- Duration on pages
- Referrer URL (source page)
- Approximate geographic location (country, region, city)
- Screen resolution
- Language settings

Legal Basis: Art. 6(1)(a) GDPR (consent via cookie banner)

Cookie Name and Duration:
- _ga: 2 years
- _ga_<container-id>: 2 years

Data Transfer to USA:
- Data may be transferred to Google servers in the USA
- Data Processing Agreement with Google Ireland Limited
- Google uses Standard Contractual Clauses (SCC)
- Google is certified under EU-US Data Privacy Framework

Our Google Analytics Configuration:
- IP anonymization enabled ("anonymizeIp": true)
- Data sharing with Google disabled
- User-ID tracking disabled
- Remarketing disabled
- Advertising reporting features disabled
- Google Consent Mode v2 enabled
- Data retention: 14 months

Google Consent Mode v2:
We use Google Consent Mode v2 to communicate your consent decision to Google services. This ensures that Google Analytics only collects data when you have consented.

Opt-Out Options:
1. Cookie Banner Settings
Reject analytics cookies via our cookie banner.
2. Browser Plugin
Install the Google Analytics Opt-out Browser Plugin:
https://tools.google.com/dlpage/gaoptout
3. Browser Settings
Block cookies in your browser settings.
4. Do Not Track (DNT)
Enable the "Do Not Track" feature in your browser. Note: Not all services respect DNT signals.

Google Privacy Policy:
https://policies.google.com/privacy

More information about Google Analytics:
https://support.google.com/analytics/answer/6004245

5.4 METALS.DEV API (PRICE DATA)

Provider: Metals.Dev

Purpose: Retrieval of metal price data (London Metal Exchange)

Transmitted Data: NO personal data

Only technical API requests with:
- API key (our internal key)
- Requested materials
- Timestamp

NO user data is transmitted to Metals.Dev.`,
    },
    {
      title: "6. Cookies and Tracking Technologies",
      content: `6.1 WHAT ARE COOKIES?

Cookies are small text files stored on your device when you visit a website. They enable recognition upon return visit.

6.2 COOKIE CATEGORIES

We use the following types of cookies:

A) NECESSARY COOKIES (NO CONSENT REQUIRED)

Purpose: Basic website functions

Cookies:
- clerk_session: Session cookie for login (session duration)
- language_preference: Language selection (1 year)

Legal Basis: Art. 6(1)(f) GDPR (legitimate interest - technical necessity)

These cookies are essential and cannot be disabled without impairing website functionality.

B) ANALYTICS COOKIES (CONSENT REQUIRED)

If you have consented:

Cookies:
- _ga: Google Analytics main cookie (2 years)
- _ga_<container-id>: Session persistence (2 years)

Purpose: Usage analysis, optimization
Legal Basis: Art. 6(1)(a) GDPR (consent)

You can disable these cookies anytime via:
- Cookie settings on our website
- Your browser settings

C) MARKETING COOKIES

We currently use NO marketing or advertising cookies.

6.3 COOKIE MANAGEMENT

You can change your cookie settings anytime:

1. Cookie Banner
Upon first visit, a cookie banner appears for selection.

2. Cookie Settings
Link in footer: "Cookie Settings"
There you can change your preferences.

3. Browser Settings
All browsers allow cookie management:
- Chrome: Settings → Privacy → Cookies
- Firefox: Settings → Privacy → Cookies
- Safari: Settings → Privacy → Cookies
- Edge: Settings → Privacy → Cookies

4. Delete Cookies
You can delete cookies anytime in your browser settings.

Note: Disabling necessary cookies may limit website functionality.

6.4 COOKIE DURATIONS

Cookie Type              | Duration
-------------------------|------------------
Session Cookies          | Until browser closed
clerk_session            | Session
language_preference      | 1 year
_ga (Analytics)          | 2 years
_ga_<container-id>       | 2 years`,
    },
    {
      title: "7. Your Rights as Data Subject",
      content: `You have the following rights regarding your personal data:

7.1 RIGHT OF ACCESS (ART. 15 GDPR)

You have the right to information about:
- What data we process about you
- For what purposes
- To whom data was disclosed
- How long data is stored
- Origin of data

Request via email to: privacy@baupreis.ai
Processing time: 30 days
Cost: Free (first request)

7.2 RIGHT TO RECTIFICATION (ART. 16 GDPR)

You can have incorrect data corrected.

Method:
- Account settings (self-service)
- Email to: privacy@baupreis.ai

7.3 RIGHT TO ERASURE (ART. 17 GDPR)

You can request deletion of your data ("right to be forgotten").

Method:
- Account cancellation → Automatic deletion after 90 days
- Email to: privacy@baupreis.ai

Exceptions to deletion:
- Fulfillment of legal obligations (e.g., retention periods)
- Assertion of legal claims
- Contract fulfillment

7.4 RIGHT TO RESTRICTION OF PROCESSING (ART. 18 GDPR)

You can request that your data be only stored but no longer processed if:
- You contest the accuracy of the data
- Processing is unlawful
- We no longer need the data, but you need it for legal claims

Request via email to: privacy@baupreis.ai

7.5 RIGHT TO DATA PORTABILITY (ART. 20 GDPR)

You can receive your data in a structured, commonly used, and machine-readable format.

Available Formats:
- JSON (complete, machine-readable)
- CSV (tables, Excel-compatible)

Export Method:
- Account settings → Data export
- Email request to: pashchenkoh@gmail.com

Included Data:
- Account information
- Configurations
- Price alerts
- Historical data
- Exported reports

Processing Time: Within 72 hours

7.6 RIGHT TO OBJECT (ART. 21 GDPR)

You can object to processing of your data if it is based on legitimate interest (Art. 6(1)(f) GDPR).

Particularly affects:
- Usage data collection (logs, analytics)
- Marketing communication (currently not active)

Objection via email to: pashchenkoh@gmail.com

7.7 WITHDRAWAL OF CONSENT (ART. 7(3) GDPR)

If processing is based on consent (e.g., analytics cookies), you can withdraw consent at any time.

Method:
- Change cookie settings (in footer)
- Email to: privacy@baupreis.ai

Consequence: Processing ends from the moment of withdrawal. The lawfulness of processing until then remains unaffected.

7.8 RIGHT TO LODGE COMPLAINT WITH SUPERVISORY AUTHORITY (ART. 77 GDPR)

You have the right to lodge a complaint with a data protection supervisory authority.

Competent Authority for Ukraine:
Ukrainian Parliamentary Commissioner for Human Rights
Website: https://www.ombudsman.gov.ua

For EU Citizens: You may contact the data protection authority of your country of residence.

Germany - Federal Commissioner for Data Protection:
Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
Graurheindorfer Str. 153, 53117 Bonn, Germany
Website: https://www.bfdi.bund.de
Phone: +49 (0)228 997799-0
Email: poststelle@bfdi.bund.de

List of all EU data protection authorities:
https://edpb.europa.eu/about-edpb/board/members_en`,
    },
    {
      title: "8. Data Storage and Deletion",
      content: `8.1 RETENTION PERIOD DURING CONTRACT TERM

During active use of the Service, we store your data to provide the contractually agreed services.

8.2 RETENTION PERIOD AFTER CONTRACT END

After cancellation or contract end:

Day 0-90:  Read-only access to account data
           Data can be exported
           No new data collected
Day 90:    PERMANENT DELETION of all customer data
           - Account information
           - Configurations
           - Price alerts
           - Usage data
Exception: Invoice data retained for 10 years
           (tax retention requirement)

8.3 DELETION PERIODS FOR DIFFERENT DATA TYPES

Data Type                    | Deletion Period
-----------------------------|---------------------------
Session Data                 | Upon browser closure
IP Addresses (Logs)          | Anonymization after 24h
Server Logs                  | 7 days
Support Tickets              | 3 years after closure
Invoice Data                 | 10 years (statutory)
Account Data (active)        | During contract term
Account Data (after cancel)  | 90 days, then deletion
Backups                      | 7 days (then overwritten)
Analytics Data (anonymous)   | Unlimited (anonymized)

8.4 BACKUP DELETION

Data in backups is deleted by:
- Automatic overwriting after 7 days
- Manual deletion upon request (within 30 days)`,
    },
    {
      title: "9. Data Security",
      content: `We implement comprehensive technical and organizational measures to protect your data:

9.1 TECHNICAL SECURITY MEASURES

Encryption:
- TLS 1.3 for all data transmissions (HTTPS)
- Encrypted password storage (bcrypt with salt)
- Encrypted database connections
- Encrypted backups

Access Control:
- Two-factor authentication (2FA) available
- Session management with automatic logout
- Role-based access control (RBAC)
- IP-based access restrictions for admin areas

Network Security:
- Firewalls and Intrusion Detection Systems (IDS)
- DDoS protection
- Regular security scans
- Penetration testing (annually)

Software Security:
- Regular security updates
- Dependency scanning
- Code reviews
- Vulnerability scanning

9.2 ORGANIZATIONAL SECURITY MEASURES

Access Restriction:
- Access to production data only for authorized personnel
- Need-to-know principle
- Logging of all accesses
- Regular review of permissions

Employee Training:
- Data protection training
- Security awareness training
- Confidentiality commitments

Incident Response:
- Emergency plan for data breaches
- 72-hour notification requirement to supervisory authority (Art. 33 GDPR)
- Notification of affected persons in case of high risk

Data Protection Management:
- Record of processing activities (Art. 30 GDPR)
- Data Protection Impact Assessment (DPIA) for high-risk processing
- Regular review of data protection compliance

9.3 PHYSICAL SECURITY (HETZNER DATA CENTER)

- ISO 27001 certified data centers
- Biometric access control
- Video surveillance
- Fire protection systems
- Redundant power supply (UPS + diesel generators)
- Climate control
- 24/7 security personnel`,
    },
    {
      title: "10. International Data Transfers",
      content: `10.1 DATA TRANSFERS WITHIN EU/EEA

Our primary data processing takes place in the EU:
- Hosting: Germany (Hetzner)
- Payments: Luxembourg (PayPal Europe)
- Authentication: Germany (Clerk AWS Frankfurt)

These transfers do not require special safeguards as they occur within the EU/EEA area.

10.2 DATA TRANSFERS TO THIRD COUNTRIES (OUTSIDE EU/EEA)

The following services may transfer data to third countries:

A) PAYPAL → USA
Safeguards:
- EU-US Data Privacy Framework certification
- Standard Contractual Clauses (SCC) pursuant to Art. 46 GDPR
- EU Commission adequacy decision for Framework participants

B) GOOGLE ANALYTICS → USA (if activated)
Safeguards:
- Data Processing Agreement with Google Ireland Limited
- Standard Contractual Clauses (SCC)
- EU-US Data Privacy Framework certification
- Additional measures: IP anonymization

C) CLERK → USA (Minimal Transfer)
Special Note: Data stored in EU (Frankfurt)
Transfer only for:
- Technical support
- Security analyses
Safeguards: Standard Contractual Clauses (SCC)

10.3 YOUR RIGHTS REGARDING THIRD COUNTRY TRANSFERS

You have the right to:
- Be informed about third country transfers (hereby done)
- Receive copies of safeguards (upon request)
- Object to processing

10.4 NO TRANSFERS TO:

We do NOT transfer data to:
- China
- Russia
- Other countries without adequate data protection level`,
    },
    {
      title: "11. Processors (Sub-Processors)",
      content: `Pursuant to Art. 28 GDPR, we engage the following processors:

No | Service Provider         | Purpose          | Location      | Third Country
---|--------------------------|------------------|---------------|---------------
1  | Hetzner Online GmbH      | Hosting          | Germany       | No
2  | PayPal (Europe) S.à r.l. | Payments         | Luxembourg    | USA (with SCC)
3  | Clerk, Inc.              | Authentication   | Germany (AWS) | USA (minimal)
4  | Google Ireland Limited   | Analytics (opt.) | Ireland       | USA (with SCC)
5  | Metals.Dev               | Price data API   | Outside EU    | USA (with SCC)

We have concluded contracts with all processors pursuant to Art. 28 GDPR ensuring GDPR-compliant data processing.

11.1 CURRENT LIST

The always current list of all sub-processors can be found at:
https://baupreis.ais152.com/sub-processors

11.2 CHANGE NOTIFICATION

Changes or additions of sub-processors will be announced 30 days in advance via email.

You have the right to object to new sub-processors. In case of justified objection, you may terminate extraordinarily.`,
    },
    {
      title: "12. Data Processing Agreement (DPA) for Customers",
      content: `For business customers on the Team plan who process their own customer data via our service, we provide a separate Data Processing Agreement (DPA) pursuant to Art. 28 GDPR.

The DPA regulates:
- Type and purpose of data processing
- Type of personal data
- Categories of data subjects
- Obligations and rights of the controller
- Technical and organizational measures
- Sub-processors
- Support with data subject rights
- Deletion or return of data

Request a DPA:
Email to: pashchenkoh@gmail.com
Subject: "DPA Request for Team Plan"
Provision: Within 5 business days via email (PDF)`,
    },
    {
      title: "13. No Automated Decision-Making",
      content: `We do NOT use automated decision-making including profiling within the meaning of Art. 22 GDPR that produces legal effects concerning you or similarly significantly affects you.

IMPORTANT NOTE ON AI FORECASTS:

Our AI-powered price forecasts are purely informational and serve as decision support. They do NOT constitute automated decision-making because:
- No automatic purchasing decisions are made
- No legal effect arises
- You are free to decide whether to follow the forecast
- Forecasts have only recommendatory character

The final purchasing decision always lies with you.`,
    },
    {
      title: "14. Protection of Minors",
      content: `Our Service is not directed at persons under 16 years of age. We do not knowingly collect personal data from children under 16.

If we determine that we have inadvertently collected data from persons under 16, it will be deleted immediately.

Note to Parents/Guardians:
If you suspect that your child has provided us with personal data, please contact us immediately: privacy@baupreis.ai`,
    },
    {
      title: "15. Changes to This Privacy Policy",
      content: `15.1 UPDATES

We reserve the right to update this Privacy Policy to:
- Comply with legal changes
- Account for new features or services
- Provide clarifications
- Implement improvements

15.2 NOTIFICATION

Material changes will be communicated to you at least 30 days before taking effect via email.

The current version is always available at:
https://baupreis.ais152.com/privacy

15.3 VERSION HISTORY

Version | Date          | Change
--------|---------------|----------------------------------------
1.0     | February 2026 | Initial publication`,
    },
    {
      title: "16. Contact and Questions",
      content: `For questions about data protection, exercising your rights, or this Privacy Policy:

PRIVACY CONTACT:
Email: pashchenkoh@gmail.com
Response time: Within 5 business days

GENERAL CONTACT:
Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
Email: pashchenkoh@gmail.com

CUSTOMER SUPPORT:
Email: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com

We strive to answer all inquiries promptly and comprehensively.

LEGAL NOTES

This Privacy Policy fulfills the requirements of:
- Art. 13, 14 GDPR (Information obligations)
- Art. 12 GDPR (Transparent information)
- § 13 TMG (Imprint requirement)
- TTDSG (Cookie consent)

In case of conflicts between this Privacy Policy and other documents (e.g., Terms of Service), this Privacy Policy prevails in data protection matters.

Last Updated: February 2026
Version: 1.0`,
    },
  ],
};

export default content;
