import type { LegalContent } from "./index";

const content: LegalContent = {
  heading: "Datenschutzerklärung",
  date: "Stand: Februar 2026",
  sections: [
    {
      title: "1. Verantwortlicher",
      content: `Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):

Hanna Pashchenko
Einzelunternehmer
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine

E-Mail: pashchenkoh@gmail.com
Datenschutz-Kontakt: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com`,
    },
    {
      title: "2. Rechtsgrundlagen der Verarbeitung",
      content: `Wir verarbeiten personenbezogene Daten im Einklang mit:

- EU-Datenschutz-Grundverordnung (DSGVO) - Verordnung (EU) 2016/679
- ePrivacy-Richtlinie - Richtlinie 2002/58/EG
- Deutsches Bundesdatenschutzgesetz (BDSG)
- Deutsches Telekommunikation-Telemedien-Datenschutz-Gesetz (TTDSG)
- Ukrainisches Datenschutzrecht

Die spezifische Rechtsgrundlage für jede Verarbeitung ist bei der jeweiligen Datenerhebung angegeben.`,
    },
    {
      title: "3. Erhebung und Verarbeitung personenbezogener Daten",
      content: `3.1 REGISTRIERUNGS- UND KONTODATEN

Bei der Erstellung eines Benutzerkontos erheben wir:

Pflichtangaben:
- E-Mail-Adresse
- Vor- und Nachname
- Passwort (verschlüsselt gespeichert mit bcrypt)

Freiwillige Angaben:
- Firmenname/Unternehmensbezeichnung
- Land/Region
- Umsatzsteuer-Identifikationsnummer (USt-IdNr.)

Zweck: Vertragserfüllung, Bereitstellung des Dienstes, Benutzer-Authentifizierung, Rechnungsstellung
Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)

Speicherdauer:
- Während der Vertragslaufzeit
- 90 Tage nach Vertragsende (Read-Only Zugriff)
- Rechnungsdaten: 10 Jahre (steuerrechtliche Aufbewahrungspflicht)

3.2 ZAHLUNGSDATEN

Die Zahlungsabwicklung erfolgt durch PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg.

An PayPal übermittelte Daten:
- E-Mail-Adresse
- Betrag und Währung
- Transaktionsbeschreibung
- Rechnungsadresse (falls angegeben)

WIR SPEICHERN KEINE:
- Kreditkartennummern
- Bankverbindungen
- Vollständige Zahlungsinformationen

Wir erhalten von PayPal nur:
- Transaktions-ID
- Zahlungsstatus
- Zeitpunkt der Zahlung

Zweck: Zahlungsabwicklung, Betrugsprävention, Rechnungsstellung
Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)

Datenschutzerklärung von PayPal:
https://www.paypal.com/de/webapps/mpp/ua/privacy-full

PayPal-Datentransfer: Daten können in die USA übertragen werden. PayPal ist nach dem EU-US Data Privacy Framework zertifiziert und nutzt Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO.

Speicherdauer: 10 Jahre (steuerrechtliche Aufbewahrungspflicht)

3.3 NUTZUNGSDATEN (AUTOMATISCH ERHOBEN)

Bei jedem Zugriff auf unsere Website und den Dienst erheben wir automatisch:

Technische Daten:
- IP-Adresse (anonymisiert nach 24 Stunden)
- Browser-Typ und Version
- Betriebssystem
- Referrer-URL (zuvor besuchte Seite)
- Hostname des zugreifenden Rechners
- Uhrzeit der Serveranfrage
- HTTP-Statuscode

Nutzungsverhalten:
- Besuchte Seiten
- Verweildauer
- Klickpfad
- Geräteinformationen (Desktop/Mobile/Tablet)

Zweck:
- Sicherstellung der Systemstabilität
- Erkennung und Abwehr von Angriffen
- Fehleranalyse und Optimierung
- Statistische Auswertung

Rechtsgrundlage: Art. 6(1)(f) DSGVO (berechtigtes Interesse)
Berechtigtes Interesse: Gewährleistung der IT-Sicherheit, Verbesserung der Benutzerfreundlichkeit, Verhinderung von Missbrauch

Speicherdauer:
- IP-Adressen: Anonymisierung nach 24 Stunden
- Logs: 7 Tage
- Aggregierte Statistiken (anonymisiert): unbegrenzt

3.4 KOMMUNIKATIONSDATEN

Wenn Sie uns kontaktieren (E-Mail, Support-Ticket):

Erhobene Daten:
- E-Mail-Adresse
- Name
- Inhalt der Nachricht
- Zeitpunkt der Kommunikation
- Anhänge (falls vorhanden)

Zweck: Bearbeitung Ihrer Anfrage, Kundensupport, Vertragsanbahnung

Rechtsgrundlage:
- Art. 6(1)(b) DSGVO (vorvertragliche Maßnahmen)
- Art. 6(1)(f) DSGVO (berechtigtes Interesse bei allgemeinen Anfragen)

Speicherdauer:
- Bis zur vollständigen Bearbeitung der Anfrage
- Plus 3 Jahre (für eventuelle Anschlussfragen)

3.5 SERVICE-NUTZUNGSDATEN

Ihre Konfigurationen und Einstellungen im Dienst:

Gespeicherte Daten:
- Ausgewählte Materialien zur Überwachung
- Preisalarme und Schwellenwerte
- Benachrichtigungseinstellungen
- Telegram-Konto-Verknüpfung (falls aktiviert)
- API-Schlüssel (nur Team-Tarif)
- Exportierte Berichte und Daten

Zweck: Bereitstellung der vertraglich vereinbarten Funktionen
Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)

Speicherdauer:
- Während der Vertragslaufzeit
- 90 Tage nach Vertragsende
- Danach: Permanente Löschung`,
    },
    {
      title: "4. Hosting und Infrastruktur",
      content: `4.1 HETZNER ONLINE GMBH

Unser Dienst wird gehostet bei:

Anbieter: Hetzner Online GmbH
Adresse: Industriestr. 25, 91710 Gunzenhausen, Deutschland
Website: https://www.hetzner.com
Server-Standort: Nürnberg, Deutschland (EU)

Verarbeitete Daten:
- Alle Website- und Anwendungsdaten
- Datenbanken mit Nutzerinformationen
- Server-Logs (IP-Adressen, Zugriffszeiten)
- Backup-Daten

Zweck: Bereitstellung der technischen Infrastruktur
Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)
Auftragsverarbeitungsvertrag (AVV): Abgeschlossen gemäß Art. 28 DSGVO

Datensicherheit:
- ISO 27001 zertifizierte Rechenzentren
- Redundante Stromversorgung
- Brandschutzsysteme
- Physische Zugangskontrolle
- 24/7 Überwachung

Datenschutzerklärung: https://www.hetzner.com/de/legal/privacy-policy

Backup-Strategie:
- Tägliche Backups (vollständig)
- Aufbewahrung: 7 Tage
- Verschlüsselte Speicherung
- Geografisch getrennte Backup-Standorte (Deutschland)`,
    },
    {
      title: "5. Drittanbieter-Dienste",
      content: `5.1 PAYPAL (ZAHLUNGSABWICKLUNG)

Anbieter: PayPal (Europe) S.à r.l. et Cie, S.C.A.
Adresse: 22-24 Boulevard Royal, L-2449 Luxemburg

Zweck: Zahlungsabwicklung, Betrugsprävention, Rechnungsstellung

Verarbeitete Daten:
- E-Mail-Adresse
- Zahlungsinformationen
- Transaktionsdaten
- Betrag und Währung
- Rechnungsadresse

Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)

Datentransfer in Drittländer:
- PayPal kann Daten in die USA übertragen
- Zertifizierung: EU-US Data Privacy Framework
- Garantien: Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO
- Angemessenheitsbeschluss für USA-Teilnehmer

Datenschutzerklärung:
https://www.paypal.com/de/webapps/mpp/ua/privacy-full

5.2 CLERK (AUTHENTIFIZIERUNG UND BENUTZERVERWALTUNG)

Anbieter: Clerk, Inc.
Adresse: USA

Zweck: Benutzer-Authentifizierung, Session-Management, Kontosicherheit

Verarbeitete Daten:
- E-Mail-Adresse
- Name
- Passwort (gehasht, nie im Klartext)
- Login-Zeitstempel
- Session-Daten
- Authentifizierungs-Token
- IP-Adresse (für Sicherheitsprüfungen)

Rechtsgrundlage: Art. 6(1)(b) DSGVO (Vertragserfüllung)

Server-Standort: AWS EU-Region (Frankfurt, Deutschland)

Besonderheit: Obwohl Clerk ein US-Unternehmen ist, werden alle Daten europäischer Nutzer auf Servern in der EU (Frankfurt) gespeichert.

Datentransfer: Minimaler Transfer in die USA nur für:
- Technischen Support
- Sicherheitsanalysen

Garantien: Standardvertragsklauseln (SCC)
Auftragsverarbeitungsvertrag: Auf Anfrage verfügbar
Datenschutzerklärung: https://clerk.com/legal/privacy

Sicherheitsmaßnahmen:
- Multi-Faktor-Authentifizierung (MFA) verfügbar
- Verschlüsselte Kommunikation (TLS 1.3)
- Passwort-Hashing mit bcrypt
- Anomalie-Erkennung bei Logins

5.3 GOOGLE ANALYTICS (OPTIONAL - NUR MIT EINWILLIGUNG)

Falls aktiviert, verwenden wir Google Analytics zur Webanalyse:

Anbieter: Google Ireland Limited
Adresse: Gordon House, Barrow Street, Dublin 4, Irland
Muttergesellschaft: Google LLC, USA

Zweck: Website-Analyse, Nutzerverhalten-Analyse, Optimierung

Verarbeitete Daten:
- IP-Adresse (ANONYMISIERT - letztes Oktett entfernt)
- Browser- und Geräteinformationen
- Besuchte Seiten und Unterseiten
- Verweildauer auf Seiten
- Referrer-URL (Herkunftsseite)
- Ungefähre geografische Lage (Land, Region, Stadt)
- Bildschirmauflösung
- Spracheinstellungen

Rechtsgrundlage: Art. 6(1)(a) DSGVO (Einwilligung via Cookie-Banner)

Cookie-Name und Laufzeit:
- _ga: 2 Jahre
- _ga_<container-id>: 2 Jahre

Datentransfer in die USA:
- Daten können auf Google-Server in den USA übertragen werden
- Auftragsverarbeitungsvertrag mit Google Ireland Limited
- Google nutzt Standardvertragsklauseln (SCC)
- Google ist nach EU-US Data Privacy Framework zertifiziert

Unsere Google Analytics Konfiguration:
- IP-Anonymisierung aktiviert ("anonymizeIp": true)
- Datenfreigabe mit Google deaktiviert
- User-ID-Tracking deaktiviert
- Remarketing deaktiviert
- Werbeberichtsfunktionen deaktiviert
- Google Consent Mode v2 aktiviert
- Datenaufbewahrung: 14 Monate

Google Consent Mode v2:
Wir verwenden Google Consent Mode v2, um Ihre Einwilligungsentscheidung an Google-Dienste zu kommunizieren. Dies stellt sicher, dass Google Analytics nur Daten erfasst, wenn Sie zugestimmt haben.

Widerspruchsmöglichkeiten:
1. Cookie-Banner Einstellungen
Lehnen Sie Analytics-Cookies über unseren Cookie-Banner ab.
2. Browser-Plugin
Installieren Sie das Google Analytics Opt-out Browser-Plugin:
https://tools.google.com/dlpage/gaoptout
3. Browser-Einstellungen
Blockieren Sie Cookies in Ihren Browser-Einstellungen.
4. Do Not Track (DNT)
Aktivieren Sie die "Do Not Track" Funktion in Ihrem Browser. Hinweis: Nicht alle Dienste respektieren DNT-Signale.

Datenschutzerklärung von Google:
https://policies.google.com/privacy

Weitere Informationen zu Google Analytics:
https://support.google.com/analytics/answer/6004245

5.4 METALS.DEV API (PREISDATEN)

Anbieter: Metals.Dev

Zweck: Abruf von Metallpreis-Daten (London Metal Exchange)

Übertragene Daten: KEINE personenbezogenen Daten

Nur technische API-Anfragen mit:
- API-Schlüssel (unser interner Schlüssel)
- Angefragte Materialien
- Zeitstempel

Es werden KEINE Nutzerdaten an Metals.Dev übermittelt.`,
    },
    {
      title: "6. Cookies und Tracking-Technologien",
      content: `6.1 WAS SIND COOKIES?

Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie ermöglichen es, Sie bei einem erneuten Besuch wiederzuerkennen.

6.2 COOKIE-KATEGORIEN

Wir verwenden folgende Arten von Cookies:

A) NOTWENDIGE COOKIES (KEINE EINWILLIGUNG ERFORDERLICH)

Zweck: Grundlegende Website-Funktionen

Cookies:
- clerk_session: Session-Cookie für Anmeldung (Session-Dauer)
- language_preference: Sprachauswahl (1 Jahr)

Rechtsgrundlage: Art. 6(1)(f) DSGVO (berechtigtes Interesse - technische Notwendigkeit)

Diese Cookies sind essentiell und können nicht deaktiviert werden, ohne die Funktionalität der Website zu beeinträchtigen.

B) ANALYTIK-COOKIES (EINWILLIGUNG ERFORDERLICH)

Falls Sie zugestimmt haben:

Cookies:
- _ga: Google Analytics Hauptcookie (2 Jahre)
- _ga_<container-id>: Session-Persistierung (2 Jahre)

Zweck: Nutzungsanalyse, Optimierung
Rechtsgrundlage: Art. 6(1)(a) DSGVO (Einwilligung)

Sie können diese Cookies jederzeit deaktivieren über:
- Cookie-Einstellungen auf unserer Website
- Ihre Browser-Einstellungen

C) MARKETING-COOKIES

Wir verwenden derzeit KEINE Marketing- oder Werbe-Cookies.

6.3 COOKIE-VERWALTUNG

Sie können Ihre Cookie-Einstellungen jederzeit ändern:

1. Cookie-Banner
Beim ersten Besuch erscheint ein Cookie-Banner zur Auswahl.

2. Cookie-Einstellungen
Link im Footer: "Cookie-Einstellungen"
Dort können Sie Ihre Präferenzen ändern.

3. Browser-Einstellungen
Alle Browser ermöglichen die Verwaltung von Cookies:
- Chrome: Einstellungen → Datenschutz → Cookies
- Firefox: Einstellungen → Datenschutz → Cookies
- Safari: Einstellungen → Datenschutz → Cookies
- Edge: Einstellungen → Datenschutz → Cookies

4. Cookies löschen
Sie können Cookies jederzeit in Ihren Browser-Einstellungen löschen.

Hinweis: Das Deaktivieren notwendiger Cookies kann die Funktionalität der Website einschränken.

6.4 COOKIE-LAUFZEITEN

Cookie-Typ              | Laufzeit
-------------------------|------------------
Session-Cookies          | Bis Browser geschlossen wird
clerk_session            | Session
language_preference      | 1 Jahr
_ga (Analytics)          | 2 Jahre
_ga_<container-id>       | 2 Jahre`,
    },
    {
      title: "7. Ihre Rechte als betroffene Person",
      content: `Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:

7.1 AUSKUNFTSRECHT (ART. 15 DSGVO)

Sie haben das Recht auf Auskunft über:
- Welche Daten wir über Sie verarbeiten
- Zu welchen Zwecken
- An wen Daten weitergegeben wurden
- Wie lange Daten gespeichert werden
- Herkunft der Daten

Anfrage per E-Mail an: privacy@baupreis.ai
Bearbeitungsfrist: 30 Tage
Kosten: Kostenlos (erste Anfrage)

7.2 BERICHTIGUNGSRECHT (ART. 16 DSGVO)

Sie können unrichtige Daten korrigieren lassen.

Methode:
- Account-Einstellungen (Selbstbedienung)
- E-Mail an: privacy@baupreis.ai

7.3 LÖSCHUNGSRECHT (ART. 17 DSGVO)

Sie können die Löschung Ihrer Daten verlangen ("Recht auf Vergessenwerden").

Methode:
- Account-Kündigung → Automatische Löschung nach 90 Tagen
- E-Mail an: pashchenkoh@gmail.com

Ausnahmen von der Löschung:
- Erfüllung rechtlicher Verpflichtungen (z.B. Aufbewahrungsfristen)
- Geltendmachung rechtlicher Ansprüche
- Erfüllung eines Vertrags

7.4 EINSCHRÄNKUNG DER VERARBEITUNG (ART. 18 DSGVO)

Sie können verlangen, dass Ihre Daten nur noch gespeichert, aber nicht mehr verarbeitet werden, wenn:
- Sie die Richtigkeit der Daten bestreiten
- Die Verarbeitung unrechtmäßig ist
- Wir die Daten nicht mehr benötigen, Sie diese aber zur Geltendmachung von Rechtsansprüchen benötigen

Anfrage per E-Mail an: pashchenkoh@gmail.com

7.5 DATENPORTABILITÄT (ART. 20 DSGVO)

Sie können Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format erhalten.

Verfügbare Formate:
- JSON (vollständig, maschinenlesbar)
- CSV (Tabellen, Excel-kompatibel)

Export-Methode:
- Account-Einstellungen → Datenexport
- E-Mail-Anfrage an: pashchenkoh@gmail.com

Enthaltene Daten:
- Kontoinformationen
- Konfigurationen
- Preisalarme
- Historische Daten
- Exportierte Berichte

Bearbeitungszeit: Innerhalb 72 Stunden

7.6 WIDERSPRUCHSRECHT (ART. 21 DSGVO)

Sie können der Verarbeitung Ihrer Daten widersprechen, wenn diese auf berechtigtem Interesse (Art. 6(1)(f) DSGVO) basiert.

Betrifft insbesondere:
- Nutzungsdatenerfassung (Logs, Analytics)
- Marketing-Kommunikation (derzeit nicht aktiv)

Widerspruch per E-Mail an: pashchenkoh@gmail.com

7.7 WIDERRUF DER EINWILLIGUNG (ART. 7(3) DSGVO)

Wenn Verarbeitung auf Einwilligung basiert (z.B. Analytics-Cookies), können Sie die Einwilligung jederzeit widerrufen.

Methode:
- Cookie-Einstellungen ändern (im Footer)
- E-Mail an: pashchenkoh@gmail.com

Folge: Die Verarbeitung wird ab dem Zeitpunkt des Widerrufs beendet. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.

7.8 BESCHWERDERECHT BEI AUFSICHTSBEHÖRDE (ART. 77 DSGVO)

Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.

Zuständige Behörde für Ukraine:
Уповноважений Верховної Ради України з прав людини
(Ukrainian Parliamentary Commissioner for Human Rights)
Website: https://www.ombudsman.gov.ua

Für EU-Bürger: Sie können sich an die Datenschutzbehörde Ihres Wohnsitzlandes wenden.

Deutschland - Bundesbeauftragter für Datenschutz:
Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
Graurheindorfer Str. 153, 53117 Bonn
Website: https://www.bfdi.bund.de
Telefon: +49 (0)228 997799-0
E-Mail: poststelle@bfdi.bund.de

Liste aller EU-Datenschutzbehörden:
https://edpb.europa.eu/about-edpb/board/members_en`,
    },
    {
      title: "8. Datenspeicherung und Löschung",
      content: `8.1 SPEICHERDAUER WÄHREND DER VERTRAGSLAUFZEIT

Während der aktiven Nutzung des Dienstes speichern wir Ihre Daten, um die vertraglich vereinbarten Leistungen zu erbringen.

8.2 SPEICHERDAUER NACH VERTRAGSENDE

Nach Kündigung oder Vertragsende:

Tag 0 - 90: Read-Only Zugriff auf Kontodaten
             Daten können exportiert werden
             Keine neuen Daten werden erfasst
Tag 90:     PERMANENTE LÖSCHUNG aller Kundendaten
             - Kontoinformationen
             - Konfigurationen
             - Preisalarme
             - Nutzungsdaten
Ausnahme:   Rechnungsdaten werden 10 Jahre aufbewahrt
             (§ 147 AO - steuerrechtliche Aufbewahrungspflicht)

8.3 LÖSCHFRISTEN FÜR VERSCHIEDENE DATENARTEN

Datenart                     | Löschfrist
-----------------------------|---------------------------
Session-Daten                | Bei Browser-Schließung
IP-Adressen (Logs)           | Anonymisierung nach 24h
Server-Logs                  | 7 Tage
Support-Tickets              | 3 Jahre nach Schließung
Rechnungsdaten               | 10 Jahre (gesetzlich)
Kontodaten (aktiv)           | Während Vertragslaufzeit
Kontodaten (nach Kündigung)  | 90 Tage, dann Löschung
Backups                      | 7 Tage (dann überschrieben)
Analytics-Daten (anonym)     | Unbegrenzt (anonymisiert)

8.4 BACKUP-LÖSCHUNG

Daten in Backups werden gelöscht durch:
- Automatisches Überschreiben nach 7 Tagen
- Manuelles Löschen bei Anfrage (innerhalb 30 Tagen)`,
    },
    {
      title: "9. Datensicherheit",
      content: `Wir setzen umfassende technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein:

9.1 TECHNISCHE SICHERHEITSMASSNAHMEN

Verschlüsselung:
- TLS 1.3 für alle Datenübertragungen (HTTPS)
- Verschlüsselte Passwortspeicherung (bcrypt mit Salt)
- Verschlüsselte Datenbankverbindungen
- Verschlüsselte Backups

Zugriffskontrolle:
- Zwei-Faktor-Authentifizierung (2FA) verfügbar
- Session-Management mit automatischem Logout
- Rollenbasierte Zugriffskontrolle (RBAC)
- IP-basierte Zugriffsbeschränkungen für Admin-Bereiche

Netzwerksicherheit:
- Firewalls und Intrusion Detection Systems (IDS)
- DDoS-Schutz
- Regelmäßige Sicherheits-Scans
- Penetrationstests (jährlich)

Software-Sicherheit:
- Regelmäßige Security-Updates
- Dependency-Scanning
- Code-Reviews
- Vulnerability-Scanning

9.2 ORGANISATORISCHE SICHERHEITSMASSNAHMEN

Zugriffsbeschränkung:
- Zugriff auf Produktionsdaten nur für autorisiertes Personal
- Need-to-know Prinzip
- Protokollierung aller Zugriffe
- Regelmäßige Überprüfung von Berechtigungen

Mitarbeiter-Schulung:
- Datenschutz-Schulungen
- Sicherheits-Awareness-Training
- Vertraulichkeitsverpflichtungen

Incident Response:
- Notfallplan bei Datenschutzverletzungen
- 72-Stunden-Meldepflicht an Aufsichtsbehörde (Art. 33 DSGVO)
- Benachrichtigung betroffener Personen bei hohem Risiko

Datenschutz-Management:
- Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO)
- Datenschutz-Folgenabschätzung (DSFA) bei risikoreichen Verarbeitungen
- Regelmäßige Überprüfung der Datenschutz-Compliance

9.3 PHYSISCHE SICHERHEIT (HETZNER RECHENZENTRUM)

- ISO 27001 zertifizierte Rechenzentren
- Biometrische Zugangskontrolle
- Videoüberwachung
- Brandschutzsysteme
- Redundante Stromversorgung (USV + Dieselgeneratoren)
- Klimatisierung
- 24/7 Security-Personal`,
    },
    {
      title: "10. Internationale Datentransfers",
      content: `10.1 DATENTRANSFERS INNERHALB DER EU/EWR

Unsere primären Datenverarbeitungen finden in der EU statt:
- Hosting: Deutschland (Hetzner)
- Zahlungen: Luxemburg (PayPal Europe)
- Authentifizierung: Deutschland (Clerk AWS Frankfurt)

Diese Transfers erfordern keine besonderen Garantien, da sie innerhalb des EU/EWR-Raums erfolgen.

10.2 DATENTRANSFERS IN DRITTLÄNDER (AUSSERHALB EU/EWR)

Folgende Dienste können Daten in Drittländer übertragen:

A) PAYPAL → USA
Garantien:
- EU-US Data Privacy Framework Zertifizierung
- Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO
- Angemessenheitsbeschluss der EU-Kommission für Framework-Teilnehmer

B) GOOGLE ANALYTICS → USA (falls aktiviert)
Garantien:
- Auftragsverarbeitungsvertrag mit Google Ireland Limited
- Standardvertragsklauseln (SCC)
- EU-US Data Privacy Framework Zertifizierung
- Zusätzliche Maßnahmen: IP-Anonymisierung

C) CLERK → USA (Minimaler Transfer)
Besonderheit: Daten werden in EU (Frankfurt) gespeichert
Transfer nur für:
- Technischen Support
- Sicherheitsanalysen
Garantien: Standardvertragsklauseln (SCC)

10.3 IHRE RECHTE BEI DRITTLAND-TRANSFERS

Sie haben das Recht:
- Über Drittland-Transfers informiert zu werden (hiermit erfolgt)
- Kopien der Garantien zu erhalten (auf Anfrage)
- Der Verarbeitung zu widersprechen

10.4 KEINE TRANSFERS NACH:

Wir übertragen KEINE Daten nach:
- China
- Russland
- Andere Länder ohne angemessenes Datenschutzniveau`,
    },
    {
      title: "11. Auftragsverarbeiter (Subprocessors)",
      content: `Gemäß Art. 28 DSGVO setzen wir folgende Auftragsverarbeiter ein:

Nr | Dienstleister            | Zweck              | Standort         | Drittland
---|--------------------------|--------------------|-----------------|-----------
1  | Hetzner Online GmbH      | Hosting            | Deutschland      | Nein
2  | PayPal (Europe) S.à r.l. | Zahlungen          | Luxemburg        | USA (SCC)
3  | Clerk, Inc.              | Authentifizierung   | Deutschland      | USA (SCC)
4  | Google Ireland Limited   | Analytics (opt.)    | Irland           | USA (SCC)
5  | Metals.Dev               | Preisdaten-API      | Außerhalb der EU | USA (SCC)

Mit allen Auftragsverarbeitern haben wir Verträge gemäß Art. 28 DSGVO abgeschlossen, die DSGVO-konforme Datenverarbeitung sicherstellen.

11.1 AKTUELLE LISTE

Die stets aktuelle Liste aller Subauftragsverarbeiter finden Sie unter:
https://baupreis.ais152.com/sub-processors

11.2 ÄNDERUNGSBENACHRICHTIGUNG

Änderungen oder Hinzufügungen von Subauftragsverarbeitern werden 30 Tage im Voraus per E-Mail angekündigt.

Sie haben das Recht, gegen neue Subauftragsverarbeiter Widerspruch einzulegen. Bei begründetem Widerspruch können Sie außerordentlich kündigen.`,
    },
    {
      title: "12. Auftragsverarbeitungsvertrag (AVV) für Kunden",
      content: `Für Geschäftskunden des Team-Tarifs, die eigene Kundendaten über unseren Dienst verarbeiten, stellen wir einen separaten Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO zur Verfügung.

Der AVV regelt:
- Art und Zweck der Datenverarbeitung
- Art der personenbezogenen Daten
- Kategorien betroffener Personen
- Pflichten und Rechte des Verantwortlichen
- Technische und organisatorische Maßnahmen
- Subauftragsverarbeiter
- Unterstützung bei Betroffenenrechten
- Löschung oder Rückgabe von Daten

Anforderung eines AVV:
E-Mail an: pashchenkoh@gmail.com
Betreff: "AVV-Anfrage für Team-Tarif"
Bereitstellung: Innerhalb 5 Werktagen per E-Mail (PDF)`,
    },
    {
      title: "13. Keine automatisierte Entscheidungsfindung",
      content: `Wir setzen KEINE automatisierte Entscheidungsfindung einschließlich Profiling im Sinne des Art. 22 DSGVO ein, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt.

WICHTIGER HINWEIS ZU KI-PROGNOSEN:

Unsere KI-gestützten Preisprognosen sind rein informativ und dienen als Entscheidungshilfe. Sie stellen KEINE automatisierte Entscheidungsfindung dar, da:
- Keine automatischen Kaufentscheidungen getroffen werden
- Keine rechtliche Wirkung entsteht
- Sie frei entscheiden, ob Sie der Prognose folgen
- Die Prognosen nur Empfehlungscharakter haben

Die finale Kaufentscheidung liegt immer bei Ihnen.`,
    },
    {
      title: "14. Minderjährigenschutz",
      content: `Unser Dienst richtet sich nicht an Personen unter 16 Jahren. Wir erheben wissentlich keine personenbezogenen Daten von Kindern unter 16 Jahren.

Falls wir feststellen, dass wir versehentlich Daten von Personen unter 16 Jahren erhoben haben, werden diese unverzüglich gelöscht.

Hinweis an Eltern/Erziehungsberechtigte:
Falls Sie vermuten, dass Ihr Kind uns personenbezogene Daten bereitgestellt hat, kontaktieren Sie uns bitte umgehend: pashchenkoh@gmail.com`,
    },
    {
      title: "15. Änderungen dieser Datenschutzerklärung",
      content: `15.1 AKTUALISIERUNGEN

Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um:
- Gesetzlichen Änderungen Rechnung zu tragen
- Neue Funktionen oder Dienste zu berücksichtigen
- Klarstellungen vorzunehmen
- Verbesserungen umzusetzen

15.2 BENACHRICHTIGUNG

Wesentliche Änderungen werden Ihnen mindestens 30 Tage vor Inkrafttreten per E-Mail mitgeteilt.

Die jeweils aktuelle Version ist stets abrufbar unter:
https://baupreis.ais152.com/datenschutz

15.3 VERSIONSHISTORIE

Version | Datum        | Änderung
--------|--------------|------------------------------------------
1.0     | Februar 2026 | Erstveröffentlichung`,
    },
    {
      title: "16. Kontakt und Fragen",
      content: `Bei Fragen zum Datenschutz, zur Ausübung Ihrer Rechte oder zu dieser Datenschutzerklärung:

DATENSCHUTZ-KONTAKT:
E-Mail: pashchenkoh@gmail.com
Antwortzeit: Innerhalb 5 Werktagen

ALLGEMEINER KONTAKT:
Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
E-Mail: pashchenkoh@gmail.com

KUNDENSUPPORT:
E-Mail: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com

Wir bemühen uns, alle Anfragen zügig und umfassend zu beantworten.

RECHTLICHE HINWEISE

Diese Datenschutzerklärung erfüllt die Anforderungen:
- Art. 13, 14 DSGVO (Informationspflichten)
- Art. 12 DSGVO (Transparente Information)
- § 13 TMG (Impressumspflicht)
- TTDSG (Cookie-Einwilligung)

Bei Widersprüchen zwischen dieser Datenschutzerklärung und anderen Dokumenten (z.B. AGB) gilt: Diese Datenschutzerklärung hat Vorrang in Datenschutzfragen.

Stand: Februar 2026
Version: 1.0`,
    },
  ],
};

export default content;
