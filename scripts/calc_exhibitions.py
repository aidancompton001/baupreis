#!/usr/bin/env python3
"""
Exhibition Budget Calculator for BauPreis AI SaaS Businessplan.
Calculates costs for all planned exhibitions and recalculates Kapitalbedarfsplan.

IRON RULE: All financial calculations via code, never "in head".
"""

# ============================================================
# 1. EXHIBITION COST ESTIMATION
# ============================================================

exhibitions = {
    "DACH+HOLZ International (Köln, Feb 2026)": {
        "status": "bereits besucht",
        "month": 0,  # before founding
        "eintritt": 50,
        "anreise_rt": 180,       # München→Köln Bahn RT
        "uebernachtung": 420,    # 3 Nächte × 140€ (Köln, Messezeit)
        "verpflegung": 100,      # 4 Tage × 25€
        "druckmaterial": 100,    # Visitenkarten, Flyer
        "note": "Already in plan at 850€ (combined line)"
    },
    "digitalBAU (Köln, 24.–26.03.2026)": {
        "status": "geplant",
        "month": 1,
        "eintritt": 45,          # Tagesticket Fachmesse
        "anreise_rt": 180,       # München→Köln Bahn RT (Sparpreis ~90 one-way)
        "uebernachtung": 200,    # 2 Nächte × 100€ (Köln, Messezeit)
        "verpflegung": 75,       # 3 Tage × 25€
        "druckmaterial": 0,      # Bereits vorhanden
        "note": "Digital transformation in construction"
    },
    "ARCHITECT@WORK München (15.–16.04.2026)": {
        "status": "geplant",
        "month": 2,
        "eintritt": 0,           # Kostenlos für Fachbesucher (Registrierung)
        "anreise_rt": 12,        # MVV Tageskarte München
        "uebernachtung": 0,      # Lokal
        "verpflegung": 30,       # 2 Tage × 15€
        "druckmaterial": 0,      # Bereits vorhanden
        "note": "Local, free entry for professionals"
    },
    "Construction Summit (Hamburg, 22.–23.04.2026)": {
        "status": "geplant",
        "month": 2,
        "eintritt": 280,         # Official ticket price
        "anreise_rt": 130,       # München→Hamburg Bahn RT (Sparpreis ~65 one-way)
        "uebernachtung": 100,    # 1 Nacht × 100€
        "verpflegung": 50,       # 2 Tage × 25€
        "druckmaterial": 0,      # Bereits vorhanden
        "note": "Digital + sustainability in construction, €280 ticket"
    },
    "Zukunft Bau / HAUS Stuttgart (Herbst 2026)": {
        "status": "geplant",
        "month": 8,  # ~Month 8 (approx)
        "eintritt": 25,          # Tageskarte Fachmesse
        "anreise_rt": 60,        # München→Stuttgart Bahn RT
        "uebernachtung": 0,      # Tagesreise möglich (~2.5h)
        "verpflegung": 20,       # 1 Tag
        "druckmaterial": 0,      # Bereits vorhanden
        "note": "Regional, day trip from München"
    },
}

print("=" * 70)
print("EXHIBITION BUDGET CALCULATION — BauPreis AI SaaS")
print("=" * 70)

total_all = 0
total_new = 0  # excluding DACH+HOLZ (already budgeted at 850€)

for name, data in exhibitions.items():
    cost = (data["eintritt"] + data["anreise_rt"] +
            data["uebernachtung"] + data["verpflegung"] +
            data["druckmaterial"])
    total_all += cost
    if name != "DACH+HOLZ International (Köln, Feb 2026)":
        total_new += cost

    print(f"\n{name}")
    print(f"  Status: {data['status']} | Monat: {data['month']}")
    print(f"  Eintritt:        {data['eintritt']:>6} €")
    print(f"  Anreise RT:      {data['anreise_rt']:>6} €")
    print(f"  Übernachtung:    {data['uebernachtung']:>6} €")
    print(f"  Verpflegung:     {data['verpflegung']:>6} €")
    print(f"  Druckmaterial:   {data['druckmaterial']:>6} €")
    print(f"  ─────────────────────────")
    print(f"  SUMME:           {cost:>6} €")
    if data.get("note"):
        print(f"  Hinweis: {data['note']}")

print(f"\n{'=' * 70}")
print(f"TOTAL alle Messen:           {total_all:>6} €")
print(f"TOTAL neue Messen (ohne DACH+HOLZ): {total_new:>6} €")

# ============================================================
# 2. KAPITALBEDARFSPLAN RECALCULATION
# ============================================================

print(f"\n{'=' * 70}")
print("KAPITALBEDARFSPLAN RECALCULATION")
print("=" * 70)

# A. Grundkosten (unchanged)
grundkosten = {
    "Gewerbeanmeldung (KVR München)": 60,
    "Server Hetzner CX32 (1 Jahr)": 300,
    "Domain + SSL (1 Jahr)": 15,
    "Claude API Credits (6 Monate)": 300,
    "Buchhaltungssoftware lexoffice (1 Jahr)": 96,
}
zwischensumme_grundkosten = sum(grundkosten.values())
print(f"\nA. Grundkosten: {zwischensumme_grundkosten} €")
for k, v in grundkosten.items():
    print(f"   {k}: {v} €")

# B. Marketing und Kundenakquise
# DACH+HOLZ stays at 850€ (combined line as before)
# New: "Weitere Messebesuche" line with calculated total
dach_holz = 850  # existing, already budgeted
weitere_messen = total_new  # calculated above

marketing = {
    "Messebesuch DACH+HOLZ (Köln, Feb. 2026 — bereits besucht)": dach_holz,
    "Weitere Messebesuche (digitalBAU, ARCHITECT@WORK, Construction Summit, Zukunft Bau)": weitere_messen,
    "Google Ads (6 Monate × 100 €)": 600,
    "LinkedIn Sales Navigator (6 Monate)": 480,
    "Marketing-Tools (E-Mail, CRM, 6 Monate)": 300,
    "Druckmaterial (Visitenkarten, Flyer)": 150,
}
zwischensumme_marketing = sum(marketing.values())
print(f"\nB. Marketing: {zwischensumme_marketing} €")
for k, v in marketing.items():
    print(f"   {k}: {v} €")

# C. Betriebliche Infrastruktur
# Recalculate Sicherheitspuffer to fit target budget
infrastruktur_base = {
    "Metals.dev API (1 Jahr)": 360,
    "Resend E-Mail-Service (Pro, 6 Monate)": 120,
    "IHK-Mitgliedsbeitrag (1 Jahr)": 150,
    "Externe Datenquellen (APIs, 1 Jahr)": 240,
}
infra_base_sum = sum(infrastruktur_base.values())

# Total without buffer
total_without_buffer = zwischensumme_grundkosten + zwischensumme_marketing + infra_base_sum
print(f"\nTotal without buffer: {total_without_buffer} €")

# Calculate options
print(f"\nTotal without buffer: {total_without_buffer} €")

# DECISION: Round to clean number 5.500€
# Reasoning: Kapitalbedarf > 5.000€ JUSTIFIES the full Investitionszuschuss (§16c max 5.000€)
# Remaining 300€ covered by Eigenkapital (200€) + Einstiegsgeld
# The Sicherheitspuffer must remain positive and reasonable
chosen_total = 5500
chosen_buffer = chosen_total - total_without_buffer
print(f"Chosen total: {chosen_total} € → Buffer = {chosen_buffer} €")
assert chosen_buffer > 0, f"Buffer negative: {chosen_buffer}€!"

infrastruktur = dict(infrastruktur_base)
infrastruktur["Sicherheitspuffer (unvorhergesehen)"] = chosen_buffer
zwischensumme_infrastruktur = infra_base_sum + chosen_buffer

print(f"\nC. Infrastruktur: {zwischensumme_infrastruktur} €")
for k, v in infrastruktur.items():
    print(f"   {k}: {v} €")

gesamter_kapitalbedarf = zwischensumme_grundkosten + zwischensumme_marketing + zwischensumme_infrastruktur

print(f"\n{'─' * 50}")
print(f"Zwischensumme Grundkosten:    {zwischensumme_grundkosten:>6} €")
print(f"Zwischensumme Marketing:      {zwischensumme_marketing:>6} €")
print(f"Zwischensumme Infrastruktur:  {zwischensumme_infrastruktur:>6} €")
print(f"{'─' * 50}")
print(f"GESAMTER KAPITALBEDARF:       {gesamter_kapitalbedarf:>6} €")

# Verify
assert gesamter_kapitalbedarf == zwischensumme_grundkosten + zwischensumme_marketing + zwischensumme_infrastruktur
print(f"✓ Summation verified: {zwischensumme_grundkosten} + {zwischensumme_marketing} + {zwischensumme_infrastruktur} = {gesamter_kapitalbedarf}")

# ============================================================
# 3. FINANZIERUNGSPLAN RECALCULATION
# ============================================================

print(f"\n{'=' * 70}")
print("FINANZIERUNGSPLAN RECALCULATION")
print("=" * 70)

eigenkapital = 200
einstiegsgeld_monat = 282  # 563 × 50%
einstiegsgeld_monate = 12  # in Jahr 1
einstiegsgeld_jahr1 = einstiegsgeld_monat * einstiegsgeld_monate
investitionszuschuss = 5000  # max § 16c SGB II

gesamtfinanzierung = eigenkapital + einstiegsgeld_jahr1 + investitionszuschuss
ueberdeckung = gesamtfinanzierung - gesamter_kapitalbedarf

print(f"Eigenkapital:            {eigenkapital:>6} €")
print(f"Einstiegsgeld (282×12):  {einstiegsgeld_jahr1:>6} €")
print(f"Investitionszuschuss:    {investitionszuschuss:>6} €")
print(f"{'─' * 50}")
print(f"Gesamtfinanzierung J1:   {gesamtfinanzierung:>6} €")
print(f"Kapitalbedarf:           {gesamter_kapitalbedarf:>6} €")
print(f"Überdeckung:             {ueberdeckung:>+6} €")

assert ueberdeckung > 0, f"FEHLER: Überdeckung negativ ({ueberdeckung}€)!"
print(f"✓ Überdeckung positiv: +{ueberdeckung} € Sicherheitspuffer")

# ============================================================
# 4. SUMMARY FOR BUSINESSPLAN UPDATE
# ============================================================

print(f"\n{'=' * 70}")
print("SUMMARY — VALUES FOR BUSINESSPLAN")
print("=" * 70)

print(f"""
KAPITALBEDARFSPLAN:
  A. Grundkosten:         {zwischensumme_grundkosten:>6} €  (unchanged)
  B. Marketing:           {zwischensumme_marketing:>6} €  (was 2.380 €, +{zwischensumme_marketing - 2380} € for new exhibitions)
  C. Infrastruktur:       {zwischensumme_infrastruktur:>6} €  (was 1.349 €, buffer adjusted)
  TOTAL:                  {gesamter_kapitalbedarf:>6} €  (was 4.500 €, +{gesamter_kapitalbedarf - 4500} €)
  → Investitionszuschuss deckt 5.000 €, Rest aus Eigenkapital/Einstiegsgeld

NEW LINE IN MARKETING:
  "Weitere Messebesuche (digitalBAU Köln, ARCHITECT@WORK München,
   Construction Summit Hamburg, Zukunft Bau Stuttgart)"
  Betrag: {weitere_messen} €

SICHERHEITSPUFFER: {chosen_buffer} € (was 479 €)

FINANZIERUNGSPLAN:
  Gesamtfinanzierung:     {gesamtfinanzierung:>6} €  (unchanged)
  Kapitalbedarf:          {gesamter_kapitalbedarf:>6} €  (was 4.500 €)
  Überdeckung:            {ueberdeckung:>+6} €  (was +4.084 €)

EXHIBITION SCHEDULE:
  ✓ DACH+HOLZ International (Köln, Feb. 2026)          — BEREITS BESUCHT
  → digitalBAU (Köln, 24.–26.03.2026)                  — Monat 1
  → ARCHITECT@WORK München (15.–16.04.2026)             — Monat 2
  → Construction Summit (Hamburg, 22.–23.04.2026)       — Monat 2
  → Zukunft Bau / HAUS (Stuttgart, Herbst 2026)         — Monat 7–9
""")
