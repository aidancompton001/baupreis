#!/usr/bin/env python3
"""
ЖЕЛЕЗНОЕ ПРАВИЛО: Пересчёт комиссий Paddle -> Stripe EU
Stripe EU: 1.4% + 0.25 EUR per transaction
Old Paddle: 5% + 0.50 USD (~0.46 EUR)
"""

# Year 1 monthly data: (month, customers, avg_revenue, monthly_revenue)
y1 = [
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

y1_revenue = sum(r[3] for r in y1)
y1_txn_count = sum(r[1] for r in y1)  # total transactions across all months
y2_revenue = 32475
y3_revenue = 84570

# Estimate Y2/Y3 transactions
# Y2: avg ~25 customers * 12 months (rough: Q1=16, Q2=22, Q3=28, Q4=35)
y2_txn_count = (16+22+28+35) * 3  # quarterly customers * 3 months each = rough
# Actually: sum of monthly customers. Approximate: linear from 13->35 over 12 months
y2_txn_count = sum(range(13, 36, 2))  # ~13,15,17,19,21,23,25,27,29,31,33,35
# Better: (13+35)/2 * 12 = 24*12 = 288
y2_txn_count = int((13 + 35) / 2 * 12)
y3_txn_count = int((36 + 70) / 2 * 12)

print("=" * 60)
print("STRIPE EU vs PADDLE Fee Comparison")
print("Stripe EU: 1.4% + 0.25 EUR/txn")
print("Paddle:    5.0% + 0.46 EUR/txn (0.50 USD)")
print("=" * 60)

for label, rev, txns in [
    ("Jahr 1", y1_revenue, y1_txn_count),
    ("Jahr 2", y2_revenue, y2_txn_count),
    ("Jahr 3", y3_revenue, y3_txn_count),
]:
    stripe_pct = rev * 0.014
    stripe_txn = txns * 0.25
    stripe_total = stripe_pct + stripe_txn

    paddle_pct = rev * 0.05
    paddle_txn = txns * 0.46
    paddle_total = paddle_pct + paddle_txn

    saving = paddle_total - stripe_total

    print(f"\n--- {label} ---")
    print(f"  Revenue: {rev} EUR, Transactions: {txns}")
    print(f"  Stripe: {stripe_pct:.0f} + {stripe_txn:.0f} = {stripe_total:.0f} EUR")
    print(f"  Paddle: {paddle_pct:.0f} + {paddle_txn:.0f} = {paddle_total:.0f} EUR")
    print(f"  Saving: {saving:.0f} EUR")
    print(f"  >>> Stripe-Gebuehren {label}: {round(stripe_total)} EUR")

# Now recalculate Rentabilitaetsvorschau with Stripe
print("\n" + "=" * 60)
print("UPDATED Rentabilitaetsvorschau (with Stripe)")
print("=" * 60)

stripe_j1 = round(y1_revenue * 0.014 + y1_txn_count * 0.25)
stripe_j2 = round(y2_revenue * 0.014 + y2_txn_count * 0.25)
stripe_j3 = round(y3_revenue * 0.014 + y3_txn_count * 0.25)

print(f"\nStripe fees: J1={stripe_j1}, J2={stripe_j2}, J3={stripe_j3}")

# Recalc expenses
j1_exp = [600, 300, 1380, stripe_j1, 96, 0, 150, 360, 240]
j2_exp = [720, 600, 3600, stripe_j2, 96, 500, 150, 480, 360]
j3_exp = [960, 1200, 4800, stripe_j3, 96, 1000, 200, 600, 480]

j1_total = sum(j1_exp)
j2_total = sum(j2_exp)
j3_total = sum(j3_exp)

print(f"\nJ1 Aufwendungen: {j1_exp} = {j1_total}")
print(f"J2 Aufwendungen: {j2_exp} = {j2_total}")
print(f"J3 Aufwendungen: {j3_exp} = {j3_total}")

j1_gewinn_vor = y1_revenue - j1_total
j2_gewinn_vor = y2_revenue - j2_total
j3_gewinn_vor = y3_revenue - j3_total

print(f"\nJ1 Gewinn vor Steuern: {y1_revenue} - {j1_total} = {j1_gewinn_vor}")
print(f"J2 Gewinn vor Steuern: {y2_revenue} - {j2_total} = {j2_gewinn_vor}")
print(f"J3 Gewinn vor Steuern: {y3_revenue} - {j3_total} = {j3_gewinn_vor}")

# Taxes
j1_est = 0
j2_est = 2000  # estimated income tax
j3_est = 13500
j3_gew = 3200  # Gewerbesteuer (Freibetrag 24500)

j1_nach = j1_gewinn_vor - j1_est
j2_nach = j2_gewinn_vor - j2_est
j3_nach = j3_gewinn_vor - j3_est - j3_gew

print(f"\nJ1 Gewinn nach Steuern: {j1_nach}")
print(f"J2 Gewinn nach Steuern: {j2_nach}")
print(f"J3 Gewinn nach Steuern: {j3_nach}")

print("\n" + "=" * 60)
print("VALUES TO USE IN BUSINESSPLAN.md:")
print("=" * 60)
print(f"Stripe-Gebuehren J1: {stripe_j1} EUR")
print(f"Stripe-Gebuehren J2: {stripe_j2} EUR")
print(f"Stripe-Gebuehren J3: {stripe_j3} EUR")
print(f"Aufwendungen J1: {j1_total} EUR")
print(f"Aufwendungen J2: {j2_total} EUR")
print(f"Aufwendungen J3: {j3_total} EUR")
print(f"Gewinn vor Steuern J1: {j1_gewinn_vor} EUR")
print(f"Gewinn vor Steuern J2: {j2_gewinn_vor} EUR")
print(f"Gewinn vor Steuern J3: {j3_gewinn_vor} EUR")
print(f"Gewinn nach Steuern J1: {j1_nach} EUR")
print(f"Gewinn nach Steuern J2: {j2_nach} EUR")
print(f"Gewinn nach Steuern J3: {j3_nach} EUR")
