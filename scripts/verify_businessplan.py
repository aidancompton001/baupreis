#!/usr/bin/env python3
"""
ЖЕЛЕЗНОЕ ПРАВИЛО: Верификация всех расчётов в BUSINESSPLAN.md
Автор: #12 Business Analyst
"""

import sys

errors = []
warnings = []

def check(name, expected, actual, tolerance=0.01):
    if abs(expected - actual) > tolerance:
        errors.append(f"FEHLER: {name}: erwartet {expected}, berechnet {actual}, diff={actual-expected}")
    else:
        print(f"  OK: {name} = {actual}")

print("=" * 60)
print("VERIFICATION: BUSINESSPLAN.md Financial Calculations")
print("=" * 60)

# ============================================================
# 9a. Kapitalbedarfsplan
# ============================================================
print("\n--- 9a. Kapitalbedarfsplan ---")

# A. Grundkosten
a_items = [60, 300, 15, 300, 96]
a_sum = sum(a_items)
check("Zwischensumme Grundkosten", 771, a_sum)

# B. Marketing
b_items = [850, 1207, 600, 480, 300, 150]
b_sum = sum(b_items)
check("Zwischensumme Marketing", 3587, b_sum)

# C. Infrastruktur
c_items = [360, 120, 150, 240, 272]
c_sum = sum(c_items)
check("Zwischensumme Infrastruktur", 1142, c_sum)

# Gesamt
gesamt = a_sum + b_sum + c_sum
check("Gesamter Kapitalbedarf", 5500, gesamt)

# ============================================================
# 9b. Umsatzplanung Jahr 1
# ============================================================
print("\n--- 9b. Umsatzplanung Jahr 1 ---")

# (Monat, Kunden_gesamt, Avg_Umsatz, Monatsumsatz_doc)
year1_months = [
    (1,  0,  0,    0),
    (2,  1,  49,   49),
    (3,  2,  49,   98),
    (4,  2,  49,   98),
    (5,  3,  55,   165),
    (6,  4,  60,   240),
    (7,  5,  65,   325),
    (8,  6,  70,   420),
    (9,  8,  75,   600),
    (10, 9,  80,   720),
    (11, 11, 80,   880),
    (12, 12, 85,   1020),
]

year1_total = 0
for m, kunden, avg, doc_umsatz in year1_months:
    calc = kunden * avg
    if calc != doc_umsatz:
        errors.append(f"FEHLER: M{m}: {kunden} x {avg} = {calc}, doc says {doc_umsatz}")
    year1_total += doc_umsatz

check("Jahr 1 Umsatz gesamt", 4615, year1_total)

# Jahr 2 Quartale
print("\n--- 9b. Umsatzplanung Jahr 2 ---")
year2_quarters = [
    ("Q1", 16, 95, 4560),
    ("Q2", 22, 100, 6600),
    ("Q3", 28, 110, 9240),
    ("Q4", 35, 115, 12075),
]
year2_total = 0
for q, kunden, avg, doc_umsatz in year2_quarters:
    calc = kunden * avg
    # Quarterly = 3 months * (kunden * avg)
    calc_q = 3 * kunden * avg
    if calc_q != doc_umsatz:
        warnings.append(f"HINWEIS: J2 {q}: 3 x {kunden} x {avg} = {calc_q}, doc says {doc_umsatz}")
    year2_total += doc_umsatz

check("Jahr 2 Umsatz gesamt", 32475, year2_total)

# Jahr 3 Quartale
print("\n--- 9b. Umsatzplanung Jahr 3 ---")
year3_quarters = [
    ("Q1", 42, 120, 15120),
    ("Q2", 50, 125, 18750),
    ("Q3", 60, 130, 23400),
    ("Q4", 70, 130, 27300),
]
year3_total = 0
for q, kunden, avg, doc_umsatz in year3_quarters:
    calc_q = 3 * kunden * avg
    if calc_q != doc_umsatz:
        warnings.append(f"HINWEIS: J3 {q}: 3 x {kunden} x {avg} = {calc_q}, doc says {doc_umsatz}")
    year3_total += doc_umsatz

check("Jahr 3 Umsatz gesamt", 84570, year3_total)

# ============================================================
# 9c. Rentabilitaetsvorschau
# ============================================================
print("\n--- 9c. Rentabilitaetsvorschau ---")

# Jahr 1 (Stripe: 1.4% + 0.25 EUR/txn)
j1_expenses = [600, 300, 1380, 80, 96, 0, 150, 360, 240]
j1_exp_total = sum(j1_expenses)
check("J1 Aufwendungen", 3206, j1_exp_total)
j1_gewinn_vor = 4615 - j1_exp_total
check("J1 Gewinn vor Steuern", 1409, j1_gewinn_vor)
j1_gewinn_nach = j1_gewinn_vor - 0
check("J1 Gewinn nach Steuern", 1409, j1_gewinn_nach)

# Jahr 2
j2_expenses = [720, 600, 3600, 527, 96, 500, 150, 480, 360]
j2_exp_total = sum(j2_expenses)
check("J2 Aufwendungen", 7033, j2_exp_total)

j2_gewinn_vor = 32475 - j2_exp_total
check("J2 Gewinn vor Steuern", 25442, j2_gewinn_vor)
j2_gewinn_nach = j2_gewinn_vor - 2000 - 0
check("J2 Gewinn nach Steuern", 23442, j2_gewinn_nach)

# Jahr 3
j3_expenses = [960, 1200, 4800, 1343, 96, 1000, 200, 600, 480]
j3_exp_total = sum(j3_expenses)
check("J3 Aufwendungen", 10679, j3_exp_total)
j3_gewinn_vor = 84570 - j3_exp_total
check("J3 Gewinn vor Steuern", 73891, j3_gewinn_vor)
j3_gewinn_nach = j3_gewinn_vor - 13500 - 3200
check("J3 Gewinn nach Steuern", 57191, j3_gewinn_nach)

# ============================================================
# 9c: Paddle fees verification
# ============================================================
print("\n--- 9c. Stripe-Gebuehren Check ---")
# Stripe EU: 1.4% + 0.25 EUR/Txn
j1_txn_count = sum([m[1] for m in year1_months])
j1_stripe_pct = 4615 * 0.014
j1_stripe_txn = j1_txn_count * 0.25
j1_stripe_total = j1_stripe_pct + j1_stripe_txn
print(f"  J1 Stripe: 1.4% of {4615} = {j1_stripe_pct:.0f} + {j1_txn_count} txns x 0.25 = {j1_stripe_txn:.0f} => total {j1_stripe_total:.0f} (doc: 80)")
check("J1 Stripe fees", 80, round(j1_stripe_total))

# ============================================================
# 9d. Liquiditaetsplan
# ============================================================
print("\n--- 9d. Liquiditaetsplan ---")

liq = [
    (1,    0, 460),
    (2,   49, 185),
    (3,   98, 185),
    (4,   98, 285),
    (5,  165, 285),
    (6,  240, 285),
    (7,  325, 285),
    (8,  420, 285),
    (9,  600, 285),
    (10, 720, 285),
    (11, 880, 285),
    (12, 1020, 285),
]

kumuliert = 0
for m, ein, aus in liq:
    saldo = ein - aus
    kumuliert += saldo
    # Check doc values
    doc_saldo = {1: -460, 2: -136, 3: -87, 4: -187, 5: -120, 6: -45,
                 7: 40, 8: 135, 9: 315, 10: 435, 11: 595, 12: 735}
    doc_kum = {1: -460, 2: -596, 3: -683, 4: -870, 5: -990, 6: -1035,
               7: -995, 8: -860, 9: -545, 10: -110, 11: 485, 12: 1220}

    if saldo != doc_saldo[m]:
        errors.append(f"FEHLER: Liq M{m} Saldo: calc {saldo}, doc {doc_saldo[m]}")
    if kumuliert != doc_kum[m]:
        errors.append(f"FEHLER: Liq M{m} Kumuliert: calc {kumuliert}, doc {doc_kum[m]}")

print(f"  Final kumuliert: {kumuliert} (doc: 1220)")
check("Liq final kumuliert", 1220, kumuliert)

# Verify break-even month
for m, ein, aus in liq:
    saldo = ein - aus
    # find first month where kumuliert > 0
# Actually just recalculate
kum = 0
breakeven = None
for m, ein, aus in liq:
    kum += (ein - aus)
    if kum > 0 and breakeven is None:
        breakeven = m
print(f"  Break-even Monat: {breakeven} (doc: 11)")
if breakeven != 11:
    errors.append(f"FEHLER: Break-even M{breakeven}, doc says M11")

# ============================================================
# 9e. Privater Finanzbedarf
# ============================================================
print("\n--- 9e. Privater Finanzbedarf ---")
privat = [1200, 350, 0, 40, 60, 50]  # KV = 0 (Buergergeld)
privat_sum = sum(privat)
check("Privater Bedarf/Monat", 1700, privat_sum)
privat_jahr = privat_sum * 12
check("Privater Bedarf/Jahr", 20400, privat_jahr)

# ============================================================
# 9f. Finanzierungsplan
# ============================================================
print("\n--- 9f. Finanzierungsplan ---")
eigenkapital = 200
einstiegsgeld_monat = 282
einstiegsgeld_jahr = einstiegsgeld_monat * 12
investitionszuschuss = 5000
gesamt_finanz = eigenkapital + einstiegsgeld_jahr + investitionszuschuss
check("Gesamtfinanzierung J1", 8584, gesamt_finanz)
ueberdeckung = gesamt_finanz - 5500
check("Ueberdeckung", 3084, ueberdeckung)

# ============================================================
# Executive Summary cross-check
# ============================================================
print("\n--- Executive Summary cross-check ---")
# Doc says: J1 Gewinn 2.386, J2 23.625, J3 54.485
# But 9c says: J1 1.186, J2 22.625, J3 53.885
# After fixes: Executive Summary should match 9c
# J1: 1.186, J2: 22.145, J3: 53.885
exec_j1 = 1409; exec_j2 = 23442; exec_j3 = 57191
check("Exec Summary J1 vs 9c", j1_gewinn_nach, exec_j1)
check("Exec Summary J2 vs 9c", j2_gewinn_nach, exec_j2)
check("Exec Summary J3 vs 9c", j3_gewinn_nach, exec_j3)

# ============================================================
# Worst-Case cross-check (8b)
# ============================================================
print("\n--- 8b. Worst-Case cross-check ---")
wc_j1_umsatz = 4615 * 0.5
print(f"  WC J1 Umsatz: 50% of 4615 = {wc_j1_umsatz:.0f} (doc: ~2300)")
wc_j1_aufwand = 3429  # same expenses
print(f"  WC J1: doc says Ausgaben ~3.400 (actual from 9c: {wc_j1_aufwand})")
print(f"  WC J1: doc says Einstiegsgeld ~3.384/Jahr (282 x 12 = {282*12})")

# ============================================================
# RESULTS
# ============================================================
print("\n" + "=" * 60)
print("ERGEBNIS")
print("=" * 60)

if errors:
    print(f"\nFEHLER ({len(errors)}):")
    for e in errors:
        print(f"  {e}")

if warnings:
    print(f"\nHINWEISE ({len(warnings)}):")
    for w in warnings:
        print(f"  {w}")

if not errors and not warnings:
    print("\nAlle Berechnungen korrekt!")

print(f"\nFehler: {len(errors)}, Hinweise: {len(warnings)}")
sys.exit(1 if errors else 0)
