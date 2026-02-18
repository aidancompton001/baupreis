import type { LegalContent } from "./index";

const content: LegalContent = {
  heading: "Allgemeine Geschäftsbedingungen (AGB)",
  date: "Stand: Februar 2026",
  sections: [
    {
      title: "\u00A7 1 Geltungsbereich",
      content: `(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für die Nutzung des SaaS-Dienstes "BauPreis AI" (nachfolgend "Dienst"), bereitgestellt durch:

Hanna Pashchenko
Einzelunternehmer
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
E-Mail: pashchenkoh@gmail.com

(nachfolgend "Anbieter", "wir" oder "uns")

(2) Der Dienst richtet sich primär an Unternehmer im Sinne des § 14 BGB. Verbraucher im Sinne des § 13 BGB können den Dienst ebenfalls nutzen; für sie gelten zusätzliche Schutzvorschriften (siehe insbesondere § 6 Abs. 5 - Widerrufsrecht).

(3) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, wir stimmen ihrer Geltung ausdrücklich schriftlich zu.

(4) Diese AGB gelten auch für alle zukünftigen Geschäftsbeziehungen, auch wenn sie nicht nochmals ausdrücklich vereinbart werden.`,
    },
    {
      title: "\u00A7 2 Vertragsgegenstand und Leistungsumfang",
      content: `(1) BauPreis AI bietet einen webbasierten Dienst (Software as a Service - SaaS) zur Echtzeitüberwachung von Baustoffpreisen mit KI-gestützten Analysen und Prognosen.

(2) Der konkrete Leistungsumfang richtet sich nach dem vom Kunden gewählten Tarif. Folgende Tarife stehen zur Verfügung:

BASIS-TARIF (€49/Monat oder €470/Jahr)
\u2713 Überwachung von 5 Baustoffen
\u2713 1 Benutzer
\u2713 3 Preisalarme
\u2713 Tägliche E-Mail-Berichte
\u2713 2x täglich Preisupdates
\u2713 30-Tage Preisverlauf
\u2717 Telegram-Alarme
\u2717 KI-Prognosen
\u2717 API-Zugang

PRO-TARIF (€149/Monat oder €1.430/Jahr)
\u2713 Alle 16 Baustoffe
\u2713 1 Benutzer
\u2713 Unbegrenzte Preisalarme
\u2713 Tägliche und wöchentliche Berichte
\u2713 4x täglich Preisupdates
\u2713 Telegram-Alarme
\u2713 KI-Prognosen und Empfehlungen
\u2713 90-Tage Preisverlauf
\u2717 API-Zugang
\u2717 Mehrbenutzer-Zugang

TEAM-TARIF (€299/Monat oder €2.870/Jahr)
\u2713 Alle 16 Baustoffe
\u2713 Bis zu 5 Benutzer
\u2713 Unbegrenzte Preisalarme
\u2713 Alle Berichte inkl. PDF-Export
\u2713 4x täglich Preisupdates
\u2713 Telegram + E-Mail-Alarme
\u2713 KI-Prognosen und Empfehlungen
\u2713 365-Tage Preisverlauf
\u2713 API-Zugang (10.000 Anfragen/Tag)
\u2713 Dedizierter Support (24h Reaktionszeit)
\u2713 Priority-Onboarding

Die detaillierte Leistungsbeschreibung ist auf https://baupreis.ais152.com/preise einsehbar.

(3) SERVICE LEVEL

Wir bemühen uns um eine hohe Verfügbarkeit und Zuverlässigkeit des Dienstes:

a) Angestrebte Verfügbarkeit: 99,5% pro Kalendermonat (ohne geplante Wartungsarbeiten)

b) Geplante Wartungsarbeiten:
- Ankündigung mindestens 72 Stunden im Voraus per E-Mail
- Bevorzugt außerhalb der üblichen Geschäftszeiten (20:00-06:00 MEZ)
- Maximale Dauer: 4 Stunden pro Monat

c) Notfallwartung:
- Bei kritischen Sicherheitslücken oder schwerwiegenden Fehlern
- Sofortige Benachrichtigung per E-Mail und Status-Seite
- Durchführung ohne Vorankündigung möglich

d) Support-Reaktionszeiten (Werktage Mo-Fr, 09:00-17:00 MEZ):
- Basis-Tarif: 48 Stunden
- Pro-Tarif: 48 Stunden
- Team-Tarif: 24 Stunden

e) Kompensation bei Ausfällen:
Bei ungeplanten Ausfällen über 4 Stunden (kumulativ pro Monat):
- Gutschrift: 1 Tag Service-Gebühr pro angefangene 4 Stunden Ausfall
- Maximale Gutschrift: 30% der Monatsgebühr
- Antrag auf Gutschrift: binnen 14 Tagen per E-Mail

(4) EINSCHRÄNKUNGEN UND HAFTUNGSAUSSCHLÜSSE

Der Dienst wird bereitgestellt "wie besehen" (as is). Wir garantieren nicht:
a) Ununterbrochenen oder fehlerfreien Betrieb
b) Vollständige Genauigkeit oder Aktualität aller Preisdaten
c) Verfügbarkeit aller Datenquellen zu jeder Zeit
d) Spezifische Ergebnisse oder Einsparungen durch KI-Prognosen
e) Kompatibilität mit allen Geräten, Browsern oder Betriebssystemen

(5) DATENQUELLEN

Preisdaten werden bezogen von:
- London Metal Exchange (LME) via Metals.Dev API
- Statistisches Bundesamt Deutschland (Destatis)
- Weitere Marktdatenquellen

Wir bemühen uns um höchste Datenqualität, können jedoch keine Gewähr für Vollständigkeit, Richtigkeit oder Aktualität aller Daten übernehmen, da wir von Drittquellen abhängig sind.`,
    },
    {
      title: "\u00A7 3 Registrierung und Nutzerkonto",
      content: `(1) KONTOERSTELLUNG

Für die Nutzung des Dienstes ist eine Registrierung erforderlich. Bei der Registrierung sind folgende Angaben zu machen:
- E-Mail-Adresse
- Vor- und Nachname
- Firmenname (bei Geschäftskunden, optional)
- Passwort
- Land/Region

(2) WAHRHEITSPFLICHT

Der Kunde ist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen und diese aktuell zu halten.

(3) KONTOSICHERHEIT

Der Kunde ist verantwortlich für:
a) Die Geheimhaltung seiner Zugangsdaten (Passwort)
b) Alle Aktivitäten, die unter seinem Konto stattfinden
c) Die unverzügliche Mitteilung bei Verdacht auf unbefugte Nutzung
d) Die Verwendung eines sicheren Passworts

(4) NUTZUNGSBESCHRÄNKUNGEN

Der Kunde darf den Dienst nicht nutzen für:
a) Rechtswidrige Zwecke oder Verstöße gegen geltendes Recht
b) Reverse Engineering, Dekompilierung oder Disassemblierung der Software
c) Weiterverkauf, Vermietung oder Unterlizenzierung ohne Genehmigung
d) Erstellung eines konkurrierenden Produkts oder Dienstes
e) Versuch des Hackens, der Störung oder Schädigung des Dienstes
f) Automatisierte Massenabrufe (außer über offizielle API im Team-Tarif)
g) Verwendung für Benchmark-Zwecke ohne schriftliche Genehmigung
h) Weitergabe des Kontos an Dritte

(5) KONTOSPERRE

Bei Verstoß gegen Abs. 4 sind wir berechtigt:
a) Den Zugang vorübergehend zu sperren (nach Abmahnung mit Fristsetzung)
b) Den Vertrag außerordentlich zu kündigen (bei schweren Verstößen)
c) Schadensersatzansprüche geltend zu machen`,
    },
    {
      title: "\u00A7 4 Kostenlose Testphase",
      content: `(1) TESTBEDINGUNGEN

Neukunden erhalten eine kostenlose Testphase von 7 Tagen ab Registrierung. Während der Testphase:
- Vollzugriff auf alle Funktionen des gewählten Tarifs
- Keine Zahlungsverpflichtung
- Keine Kreditkarte erforderlich
- Jederzeit kündbar ohne Angabe von Gründen

(2) NACH TESTENDE

Nach Ablauf der 7-tägigen Testphase:
- Wird der Zugriff automatisch gesperrt
- Keine automatischen Abbuchungen ohne ausdrückliche Zustimmung
- Aufforderung zur Auswahl eines kostenpflichtigen Tarifs
- Daten bleiben 30 Tage gespeichert (für eventuelle Aktivierung)

(3) TESTEINSCHRÄNKUNGEN

Die kostenlose Testphase ist auf einen Test pro Kunde/Unternehmen beschränkt. Wir behalten uns vor, Missbrauch zu verhindern durch:
- E-Mail-Verifizierung
- Ablehnung bei Verdacht auf Mehrfachregistrierungen
- IP-basierte Einschränkungen`,
    },
    {
      title: "\u00A7 5 Preise, Zahlung und Rechnungsstellung",
      content: `(1) PREISE

Die aktuellen Preise sind auf https://baupreis.ais152.com/preise einsehbar. Alle Preise sind Endpreise.

Bei jährlicher Zahlung: Rabatt von 2 Monaten (Zahlung für 10 Monate, Nutzung für 12 Monate).

(2) UMSATZSTEUER

Als ukrainischer Einzelunternehmer mit Sitz außerhalb der Europäischen Union sind wir nicht EU-umsatzsteuerpflichtig.

a) GRUNDSATZ:
Alle angezeigten Preise sind Endpreise.
Es wird keine EU-Umsatzsteuer hinzugefügt.

b) FÜR EU-GESCHÄFTSKUNDEN (B2B mit gültiger USt-IdNr.):
Es gilt das Reverse-Charge-Verfahren gemäß Art. 196 der Richtlinie 2006/112/EG (MwStSystRL):
- Unsere Rechnung weist KEINE Umsatzsteuer aus
- Vermerk auf Rechnung: "Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)"
- Sie sind verpflichtet, die Umsatzsteuer in Ihrem Land selbst anzumelden und abzuführen
- Ihre USt-IdNr. wird bei Registrierung validiert (optional)
- Dies ist steuerlich neutral, da Sie die Umsatzsteuer gleichzeitig als Vorsteuer abziehen können

c) FÜR EU-PRIVATKUNDEN (B2C):
Der angezeigte Preis ist der finale Endpreis.
Es werden keine zusätzlichen Steuern erhoben.
Als außerhalb der EU ansässiger Anbieter erheben wir keine EU-Umsatzsteuer. Dies ist Ihr Preisvorteil gegenüber EU-Anbietern.

d) FÜR NICHT-EU-KUNDEN:
Keine EU-Umsatzsteuer.
Eventuelle in Ihrem Land anfallende lokale Steuern (z.B. Sales Tax, GST, lokale Umsatzsteuer) liegen in Ihrer Verantwortung.

(3) ZAHLUNGSMODALITÄTEN

a) Zahlungsanbieter:
Die Zahlung erfolgt ausschließlich über PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg.

b) Zahlungszyklen:
- MONATLICH: Abbuchung monatlich im Voraus, automatische Verlängerung
- JÄHRLICH: Abbuchung jährlich im Voraus, automatische Verlängerung

c) Autorisierung:
Mit Abschluss eines kostenpflichtigen Abonnements autorisiert der Kunde PayPal zur automatischen Abbuchung der Gebühren.

d) Fälligkeit:
Gebühren sind sofort bei Abonnement bzw. bei Verlängerung fällig.

(4) RECHNUNGSSTELLUNG

a) Rechnungen werden elektronisch per E-Mail versendet
b) Versand innerhalb von 3 Werktagen nach Zahlungseingang
c) Rechnungen im PDF-Format
d) Aufbewahrungspflicht: Kunde muss Rechnungen für Steuerzwecke aufbewahren

(5) ZAHLUNGSVERZUG

Bei fehlgeschlagener Zahlung:
Tag 0: Zahlungsversuch schlägt fehl
Tag 3: Automatischer zweiter Zahlungsversuch
Tag 7: E-Mail-Benachrichtigung + dritter Versuch
Tag 10: Warnung per E-Mail - Zugang wird in 4 Tagen gesperrt
Tag 14: Zugang wird gesperrt (read-only Modus)
Tag 30: Vertrag kann außerordentlich gekündigt werden

Bei Sperrung bleiben Zahlungsverpflichtungen für bereits erbrachte Leistungen bestehen.

(6) PREISÄNDERUNGEN

a) Wir behalten uns vor, Preise mit einer Ankündigungsfrist von 30 Tagen zu ändern
b) Bestandskunden: Neue Preise gelten ab nächster Verlängerung
c) Bei Preiserhöhung: Sonderkündigungsrecht binnen 14 Tagen nach Ankündigung`,
    },
    {
      title: "\u00A7 6 Vertragslaufzeit und Kündigung",
      content: `(1) VERTRAGSBEGINN UND LAUFZEIT

Der Vertrag beginnt mit Abschluss der Registrierung und läuft für den gewählten Abrechnungszeitraum (1 Monat oder 12 Monate) mit automatischer Verlängerung um jeweils denselben Zeitraum.

(2) ORDENTLICHE KÜNDIGUNG DURCH KUNDEN

a) Kündigungsmöglichkeit: Jederzeit
b) Kündigungsfrist: Keine
c) Wirkung: Zum Ende des laufenden Abrechnungszeitraums
d) Kündigungsweg:
- Via Account-Einstellungen (Selbstbedienung)
- Per E-Mail an: kontakt@baupreis.ai
- Schriftform (E-Mail) genügt
e) Keine Rückerstattung für ungenutzten Zeitraum
f) Zugang bleibt bis Ende des bezahlten Zeitraums aktiv

(3) ORDENTLICHE KÜNDIGUNG DURCH ANBIETER

Wir können den Vertrag mit einer Frist von 30 Tagen zum Ende eines Abrechnungszeitraums kündigen.

(4) AUSSERORDENTLICHE KÜNDIGUNG

Beide Parteien können den Vertrag aus wichtigem Grund außerordentlich und fristlos kündigen.

Wichtige Gründe für uns sind insbesondere:
a) Verstoß gegen § 3 Abs. 4 (Nutzungsbeschränkungen)
b) Rechtswidrige Nutzung des Dienstes
c) Zahlungsverzug über 30 Tage
d) Versuch des Hackens, der Störung oder Beschädigung des Dienstes
e) Weitergabe des Kontos an Dritte
f) Verwendung für Benchmark-Zwecke ohne Genehmigung
g) Wiederholte Verstöße gegen diese AGB trotz Abmahnung

Vor außerordentlicher Kündigung setzen wir in der Regel eine angemessene Frist zur Abhilfe (14 Tage), es sei denn, der Verstoß ist so schwerwiegend, dass eine Frist nicht zumutbar ist.

(5) WIDERRUFSRECHT FÜR VERBRAUCHER

VERBRAUCHER HABEN EIN 14-TÄGIGES WIDERRUFSRECHT

WIDERRUFSBELEHRUNG

Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns

Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
E-Mail: pashchenkoh@gmail.com

mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Folgen des Widerrufs

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Vorzeitiges Erlöschen des Widerrufsrechts

Das Widerrufsrecht erlischt vorzeitig, wenn Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrages vor Ablauf der Widerrufsfrist beginnen, und Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrages Ihr Widerrufsrecht verlieren.

ENDE DER WIDERRUFSBELEHRUNG

MUSTER-WIDERRUFSFORMULAR

(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

An:
Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine
E-Mail: pashchenkoh@gmail.com

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:

BauPreis AI - Tarif: _________________
Bestellt am (*)/erhalten am (*): _________________
Name des/der Verbraucher(s): _________________
Anschrift des/der Verbraucher(s): _________________
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________
Datum: _________________

(*) Unzutreffendes streichen.

(6) FOLGEN DER BEENDIGUNG

Nach Vertragsende (Kündigung oder Widerruf):
a) Zugang zum Dienst endet (oder bleibt bis Ende des bezahlten Zeitraums aktiv)
b) Daten werden in einen "Read-Only" Modus versetzt für 90 Tage
c) Innerhalb von 90 Tagen: Kunde kann Daten exportieren
d) Nach 90 Tagen: Permanente Löschung aller Kundendaten
e) Ausnahme: Rechnungsdaten (10 Jahre Aufbewahrungspflicht)
f) Offene Zahlungsverpflichtungen bleiben bestehen`,
    },
    {
      title: "\u00A7 7 Verfügbarkeit und Wartung",
      content: `(1) VERFÜGBARKEITSZIEL

Wir bemühen uns um eine Verfügbarkeit von 99,5% pro Kalendermonat (ohne geplante Wartungsarbeiten).

(2) GEPLANTE WARTUNG

a) Ankündigung: Mindestens 72 Stunden im Voraus per E-Mail
b) Zeitpunkt: Bevorzugt 20:00-06:00 MEZ (außerhalb Geschäftszeiten)
c) Häufigkeit: Maximal 1x monatlich
d) Dauer: Maximal 4 Stunden pro Vorgang

(3) NOTFALLWARTUNG

Bei kritischen Sicherheitslücken oder schwerwiegenden technischen Problemen können Wartungsarbeiten ohne Vorankündigung durchgeführt werden. Wir informieren unverzüglich per E-Mail und Status-Seite.

(4) KOMPENSATION BEI AUSFÄLLEN

Bei ungeplanten Ausfällen über 4 Stunden kumulativ pro Monat:

Ausfalldauer       | Gutschrift
-------------------|------------------------
4-8 Stunden        | 1 Tag (\u22483,3% Monatsgebühr)
8-12 Stunden       | 2 Tage (\u22486,6% Monatsgebühr)
12-24 Stunden      | 4 Tage (\u224813,3% Monatsgebühr)
>24 Stunden        | 30% Monatsgebühr (Maximum)

Antrag auf Gutschrift binnen 14 Tagen per E-Mail.
Gutschrift wird auf nächste Rechnung angerechnet.

(5) HÖHERE GEWALT

Keine Haftung bei Ausfällen durch höhere Gewalt (Naturkatastrophen, Krieg, Terrorismus, Stromausfälle, Internet-Backbone-Störungen, etc.).`,
    },
    {
      title: "\u00A7 8 Gewährleistung und Haftung",
      content: `(1) GESETZLICHE GRUNDLAGE

Wir haften nach den gesetzlichen Bestimmungen, soweit nachstehend nichts Abweichendes geregelt ist.

(2) UNBESCHRÄNKTE HAFTUNG

Wir haften unbeschränkt und uneingeschränkt für:
a) Vorsatz oder grobe Fahrlässigkeit
b) Verletzung von Leben, Körper oder Gesundheit
c) Ansprüche nach dem Produkthaftungsgesetz
d) Von uns ausdrücklich gegebene Garantien
e) Arglistiges Verschweigen von Mängeln

(3) BESCHRÄNKTE HAFTUNG BEI LEICHTER FAHRLÄSSIGKEIT

Bei leichter Fahrlässigkeit haften wir nur:
a) Für die Verletzung wesentlicher Vertragspflichten (Kardinalspflichten)
b) Die Haftung ist begrenzt auf den vertragstypischen, vorhersehbaren Schaden

Wesentliche Vertragspflichten (Kardinalspflichten) sind solche Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf.

(4) HAFTUNGSHÖCHSTGRENZEN

Bei einfacher Fahrlässigkeit ist unsere Haftung begrenzt auf:
a) Pro Schadensfall: \u20AC50.000
b) Pro Jahr (Gesamthaftung): \u20AC100.000
c) Bei Datenverlust: Kosten der Datenwiederherstellung aus Backups

(5) AUSSCHLUSS DER HAFTUNG

Ausgeschlossen ist die Haftung für:
a) Mittelbare oder Folgeschäden
b) Entgangenen Gewinn oder Umsatz
c) Verlust von Daten oder Geschäftsmöglichkeiten
d) Datenverlust bei fehlendem eigenem Backup des Kunden
e) Störungen durch Drittanbieter (PayPal, Datenquellen, Hoster)
f) Höhere Gewalt und außergewöhnliche Umstände
g) Handlungen oder Unterlassungen des Kunden
h) Ungenauigkeiten in Daten von Drittquellen
i) Finanzielle Verluste aufgrund von Kaufentscheidungen

(6) KEINE ANLAGEBERATUNG - WICHTIGER HAFTUNGSAUSSCHLUSS

WICHTIGER HINWEIS - BITTE SORGFÄLTIG LESEN

Die von BauPreis AI bereitgestellten KI-Prognosen, Preisempfehlungen und Marktanalysen dienen AUSSCHLIESSLICH zu Informationszwecken.

Sie stellen KEINE dar:
\u2717 Anlageberatung
\u2717 Kaufempfehlung
\u2717 Finanzberatung
\u2717 Garantie für zukünftige Preisentwicklungen
\u2717 Rechtsberatung

Der Kunde trägt die ALLEINIGE VERANTWORTUNG für:
\u2713 Seine Kaufentscheidungen
\u2713 Den Zeitpunkt von Bestellungen
\u2713 Die Auswahl von Lieferanten
\u2713 Alle finanziellen Konsequenzen seiner Entscheidungen

Historische Preisentwicklungen und KI-Prognosen sind KEINE Garantie für zukünftige Ergebnisse. Baustoffpreise können unvorhersehbar schwanken.

WIR HAFTEN NICHT für:
- Finanzielle Verluste durch Kaufentscheidungen
- Entgangene Gewinne durch verpasste Preis-Gelegenheiten
- Verluste durch ungenaue Prognosen
- Schäden durch Verzögerungen in Datenaktualisierungen

(7) BEWEISLAST

Die Beweislast für das Vorliegen der Voraussetzungen eines Schadensersatzanspruchs trägt der Kunde.

(8) VERJÄHRUNG

Schadensersatzansprüche verjähren nach den gesetzlichen Verjährungsfristen.`,
    },
    {
      title: "\u00A7 9 Datenverarbeitung und Datenschutz",
      content: `(1) GELTUNG DER DATENSCHUTZERKLÄRUNG

Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den Vorgaben der EU-Datenschutz-Grundverordnung (DSGVO).

Die Datenschutzerklärung ist abrufbar unter:
https://baupreis.ais152.com/datenschutz

(2) AUFTRAGSVERARBEITUNGSVERTRAG (AVV)

Für Geschäftskunden des Team-Tarifs, die eigene Kundendaten verarbeiten, stellen wir auf Anfrage einen separaten Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO zur Verfügung.

Anforderung per E-Mail an: pashchenkoh@gmail.com

(3) SUBAUFTRAGSVERARBEITER

Wir setzen folgende Subauftragsverarbeiter ein:

1. Hetzner Online GmbH (Hosting)
   Standort: Nürnberg, Deutschland

2. PayPal (Europe) S.à r.l. et Cie, S.C.A. (Zahlungen)
   Standort: Luxemburg

3. Clerk, Inc. (Authentifizierung)
   Standort: USA (Server: AWS Frankfurt, Deutschland)

4. Google Ireland Limited (Analytics, optional)
   Standort: Irland (Daten können in USA übertragen werden)

5. Metals.Dev (API-Daten)
   Vertragsrecht: Indien (Server: Council Bluffs, Iowa, USA über Google Cloud)

Aktuelle Liste: https://baupreis.ais152.com/sub-processors

Bei Änderungen oder Hinzufügen neuer Subauftragsverarbeiter informieren wir 30 Tage im Voraus.

(4) DATENAUFBEWAHRUNG NACH VERTRAGSENDE

Nach Beendigung des Vertrags:
- 0-90 Tage: Daten im Read-Only Modus (Exportmöglichkeit)
- Nach 90 Tagen: Permanente Löschung aller Kundendaten
- Ausnahme: Rechnungsdaten (10 Jahre gesetzliche Aufbewahrungspflicht)

(5) DATENEXPORT

Der Kunde kann jederzeit seine Daten exportieren:
- Format: JSON oder CSV
- Via Account-Einstellungen \u2192 Datenexport
- Oder per E-Mail-Anfrage an: pashchenkoh@gmail.com

(6) DATENSICHERHEIT

Wir setzen technische und organisatorische Maßnahmen um:
- SSL/TLS-Verschlüsselung (HTTPS)
- Verschlüsselte Passwortspeicherung (bcrypt)
- Zugriffsbeschränkungen
- Regelmäßige Sicherheits-Updates
- Tägliche Backups (7 Tage Aufbewahrung)`,
    },
    {
      title: "\u00A7 10 Nutzungsrechte und Geistiges Eigentum",
      content: `(1) LIZENZGEWÄHRUNG

Wir räumen dem Kunden für die Dauer des Vertrags ein einfaches, nicht-ausschließliches, nicht übertragbares, nicht unterlizenzierbares Nutzungsrecht am Dienst ein.

(2) EIGENTUM AN DER SOFTWARE

Alle Rechte, Titel und Interessen an der Software, einschließlich:
- Quellcode und Objektcode
- Algorithmen und KI-Modelle
- Designs und Benutzeroberflächen
- Dokumentation
- Marken und Logos
verbleiben ausschließlich bei uns.

(3) VERBOTENE HANDLUNGEN

Der Kunde darf nicht:
a) Die Software kopieren, modifizieren oder abgeleitete Werke erstellen
b) Reverse Engineering, Dekompilierung oder Disassemblierung vornehmen
c) Urheberrechts- oder Eigentumshinweise entfernen
d) Die Software zur Erstellung eines Konkurrenzprodukts nutzen
e) Technische Schutzmaßnahmen umgehen
f) Teile der Software isoliert nutzen

(4) KUNDENDATEN

Der Kunde behält alle Rechte an seinen eigenen Daten (Konfigurationen, exportierte Berichte, etc.). Wir erheben keine Eigentumsansprüche an Kundendaten.

(5) FEEDBACK UND VORSCHLÄGE

Wenn der Kunde Feedback, Vorschläge oder Verbesserungsideen mitteilt, können wir diese ohne Vergütung oder Verpflichtung nutzen und in den Dienst einbauen.

(6) API-NUTZUNG (NUR TEAM-TARIF)

Bei API-Nutzung gelten zusätzlich:
- Rate Limit: 10.000 Anfragen pro Tag
- Nur für eigene geschäftliche Zwecke
- Kein Weiterverkauf von API-Daten
- API-Schlüssel darf nicht weitergegeben werden`,
    },
    {
      title: "\u00A7 11 Änderungen der AGB",
      content: `(1) ÄNDERUNGSRECHT

Wir behalten uns vor, diese AGB zu ändern, wenn:
a) Gesetzliche oder behördliche Anforderungen dies erfordern
b) Gerichtliche Entscheidungen Anpassungen notwendig machen
c) Technische Änderungen am Dienst dies erforderlich machen
d) Marktbedingte Anpassungen sinnvoll sind
e) Die Änderungen angemessen und für den Kunden nicht nachteilig sind

(2) ANKÜNDIGUNG VON ÄNDERUNGEN

Wesentliche Änderungen werden dem Kunden mindestens 30 Tage vor Inkrafttreten per E-Mail angekündigt. Die Änderungen werden in der E-Mail hervorgehoben.

(3) WIDERSPRUCHSRECHT

Der Kunde kann Änderungen innerhalb von 30 Tagen nach Zugang der Änderungsmitteilung widersprechen.

Widerspruch muss erfolgen:
- Schriftlich (E-Mail genügt)
- An: kontakt@baupreis.ai
- Binnen 30 Tagen

(4) FOLGEN DES WIDERSPRUCHS

Bei fristgerechtem Widerspruch:
a) Die Änderungen gelten für den widersprechenden Kunden nicht
b) Wir können den Vertrag mit einer Frist von 30 Tagen kündigen
c) Der Kunde kann seinerseits außerordentlich kündigen

(5) STILLSCHWEIGENDE ZUSTIMMUNG

Widerspricht der Kunde nicht innerhalb von 30 Tagen und nutzt den Dienst weiter, gelten die geänderten AGB als akzeptiert.`,
    },
    {
      title: "\u00A7 12 Anwendbares Recht und Gerichtsstand",
      content: `(1) ANWENDBARES RECHT

Für diese AGB und alle Rechtsbeziehungen zwischen uns und dem Kunden gilt das Recht der Ukraine, unter Ausschluss des UN-Kaufrechts (CISG).

(2) VERBRAUCHERSCHUTZ IN DER EU

Für Verbraucher mit Wohnsitz in der Europäischen Union gelten zusätzlich die zwingenden Verbraucherschutzvorschriften ihres Wohnsitzstaates, insbesondere hinsichtlich:
- Widerrufsrecht (14 Tage)
- Gewährleistungsrechte
- Informationspflichten
- Verbot missbräuchlicher Klauseln
- Preisangabenvorschriften

Diese AGB können zwingende Verbraucherrechte nicht einschränken.

(3) GERICHTSSTAND

a) FÜR STREITIGKEITEN MIT UNTERNEHMERN:
Ausschließlicher Gerichtsstand ist Kyiv, Ukraine.

b) FÜR STREITIGKEITEN MIT VERBRAUCHERN:
- Verbraucher können am Gerichtsstand ihres Wohnsitzes klagen
- Wir können Verbraucher nur an deren Wohnsitz verklagen
- Bei grenzüberschreitenden Streitigkeiten: Gerichtsstand nach Brüssel-Ia-VO oder nationalen Vorschriften

(4) AUSSERGERICHTLICHE STREITBEILEGUNG

Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.

Informationen zu alternativen Streitbeilegungsstellen für EU-Verbraucher:
https://consumer-redress.ec.europa.eu/dispute-resolution-bodies

Hinweis: Die EU Online Dispute Resolution Plattform (ec.europa.eu/odr) wurde am 20. Juli 2025 eingestellt.`,
    },
    {
      title: "\u00A7 13 Schlussbestimmungen",
      content: `(1) GESAMTVEREINBARUNG

Diese AGB zusammen mit der Datenschutzerklärung bilden die gesamte Vereinbarung zwischen den Parteien und ersetzen alle vorherigen mündlichen oder schriftlichen Vereinbarungen.

(2) ABTRETUNG UND ÜBERTRAGUNG

a) Der Kunde darf seine Rechte und Pflichten aus diesem Vertrag nicht ohne unsere schriftliche Zustimmung abtreten oder übertragen.
b) Wir können unsere Rechte und Pflichten übertragen auf:
- Verbundene Unternehmen
- Im Rahmen von Unternehmensverkäufen, Fusionen oder Umstrukturierungen
- Benachrichtigung des Kunden erfolgt 30 Tage im Voraus

(3) SALVATORISCHE KLAUSEL

Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.

Die unwirksame Bestimmung ist durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.

(4) VERZICHT

Das Unterlassen der Ausübung oder Verzögerung bei der Ausübung eines Rechts aus diesen AGB stellt keinen Verzicht auf dieses Recht dar.

(5) SPRACHE

Diese AGB sind in deutscher Sprache verfasst. Bei Übersetzungen in andere Sprachen hat im Zweifelsfall die deutsche Version Vorrang.

(6) SCHRIFTFORMERFORDERNIS

Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für die Abbedingung dieses Schriftformerfordernisses.

Schriftform ist gewahrt bei:
- Unterzeichnetem Dokument (Papier oder PDF)
- E-Mail mit ausdrücklicher Bestätigung beider Parteien
- Digitale Signatur

Ausnahme: § 11 (Änderungen der AGB) regelt ein besonderes Verfahren.

(7) MITTEILUNGEN

Alle Mitteilungen im Rahmen dieser AGB erfolgen:
- An Kunde: An die bei Registrierung angegebene E-Mail-Adresse
- An uns: An kontakt@baupreis.ai

Mitteilungen gelten als zugegangen:
- Bei E-Mail: Bei Eingang im Posteingang (Zustellbestätigung)
- Bei Post: 3 Werktage nach Aufgabe

Der Kunde ist verpflichtet, seine E-Mail-Adresse aktuell zu halten.`,
    },
    {
      title: "Kontaktinformationen",
      content: `Bei Fragen zu diesen AGB:

Hanna Pashchenko
Oleksandra Myshyhy Street, 2, Apt. 329
02141 Kyiv, Ukraine

E-Mail: pashchenkoh@gmail.com
Support: pashchenkoh@gmail.com
Website: https://baupreis.ais152.com

Geschäftszeiten Support:
Montag - Freitag, 09:00 - 17:00 Uhr MEZ

Stand: Februar 2026
Version: 1.0`,
    },
  ],
};

export default content;
