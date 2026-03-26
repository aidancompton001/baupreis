# BauPreis AI SaaS --- Setup & Deploy Process

## Current Status

| Component | Status |
|-----------|--------|
| Code | Ready (37 pages, build OK) |
| Server | VPS running, baupreis.ais152.com with SSL |
| Docker | traefik + postgres + app containers |
| Database | PostgreSQL 16, schema initialized |
| Dashboard | Shows BauPreis Index, but NO material cards (analysis table empty) |
| Prognose | Empty (no forecast data) |

### Root Cause (why no data)
1. `collect-prices` returns 9 instead of 16 --- server has OLD code (Docker cache)
2. `analyze` returns 401 error --- server has OLD code without synthetic fallback
3. Code patches exist locally but were NEVER deployed due to Docker layer caching

---

## STEP 1: Get API Keys (all FREE)

### 1.1 Metals.dev (metal spot prices)
- **What:** Copper, Aluminum, Zinc, Nickel (LME prices in EUR)
- **Free tier:** 100 requests/month (enough for 1x/day = 30/month)
- **Register:** https://metals.dev --- sign up, get API key instantly
- **Key format:** alphanumeric string
- **ENV variable:** `METALS_DEV_API_KEY`

### 1.2 FRED (monthly metal averages, backup)
- **What:** Copper, Aluminum, Zinc, Nickel (IMF monthly averages, USD)
- **Free tier:** Unlimited (120 req/min)
- **Register:** https://fred.stlouisfed.org/docs/api/api_key.html
- **Key format:** 32-character hex string
- **ENV variable:** `FRED_API_KEY`

### 1.3 Destatis GENESIS (German construction indices)
- **What:** Cement, Concrete, Wood, Insulation, Steel --- monthly price indices
- **Free tier:** Unlimited, NO registration needed (guest access)
- **Guest credentials:** username=`GAST`, password=`GAST`
- **ENV variables:** `DESTATIS_USER=GAST`, `DESTATIS_PASSWORD=GAST`
- **Optional:** Register at https://www-genesis.destatis.de for a free account

### 1.4 Tankerkoenig (diesel prices, Germany)
- **What:** Real-time diesel prices from 14,000+ gas stations in Germany
- **Free tier:** Unlimited (1 req per 5 min recommended)
- **Register:** https://onboarding.tankerkoenig.de --- get UUID API key
- **Demo key (for testing):** `00000000-0000-0000-0000-000000000002`
- **ENV variable:** `TANKERKOENIG_API_KEY`

### 1.5 Energy-Charts / Fraunhofer ISE (electricity prices)
- **What:** Day-ahead electricity spot prices in Germany (EUR/MWh)
- **Free tier:** Unlimited, NO registration, NO API key
- **API:** `https://api.energy-charts.info/price?bzn=DE-LU`
- **ENV variable:** None needed

### 1.6 Anthropic (Claude AI for analysis)
- **What:** AI analysis, forecasts, chat
- **Register:** https://console.anthropic.com
- **Free credits:** $5 on signup (enough for ~3 months of our usage)
- **ENV variable:** `ANTHROPIC_API_KEY`

### 1.7 Resend (email alerts)
- **What:** Transactional email for alert notifications
- **Free tier:** 3,000 emails/month
- **Register:** https://resend.com --- need domain verification
- **ENV variable:** `RESEND_API_KEY`

### 1.8 Telegram Bot (optional, for alerts)
- **What:** Telegram notifications for price alerts
- **Create bot:** Talk to @BotFather on Telegram, `/newbot`
- **ENV variable:** `TELEGRAM_BOT_TOKEN`

### Summary: What to Register

| # | Service | URL | Time | Priority |
|---|---------|-----|------|----------|
| 1 | Metals.dev | metals.dev | 2 min | HIGH |
| 2 | Anthropic | console.anthropic.com | 5 min | HIGH |
| 3 | Tankerkoenig | onboarding.tankerkoenig.de | 2 min | MEDIUM |
| 4 | FRED | fred.stlouisfed.org | 3 min | MEDIUM |
| 5 | Resend | resend.com | 5 min | LOW (for alerts) |
| 6 | Telegram Bot | t.me/BotFather | 2 min | LOW (for alerts) |
| - | Destatis | NO registration needed | 0 min | FREE |
| - | Energy-Charts | NO registration needed | 0 min | FREE |

---

## STEP 2: Update .env on Server

After getting all API keys, SSH into server and edit `/opt/baupreis/.env`:

```bash
nano /opt/baupreis/.env
```

Replace placeholder values:

```env
# === Database (already configured) ===
DB_HOST=postgres
DB_PORT=5432
DB_NAME=baupreis
DB_USER=baupreis
DB_PASSWORD=BauPreis2026SecurePass

# === App ===
NEXT_PUBLIC_APP_URL=https://baupreis.ais152.com
NODE_ENV=production

# === Clerk (keep placeholder for now --- dev mode works without it) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_placeholder
CLERK_SECRET_KEY=sk_placeholder

# === Stripe (keep placeholder for now) ===
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder

# === DATA SOURCES (GET THESE KEYS) ===
METALS_DEV_API_KEY=<your_metals_dev_key>
DESTATIS_USER=GAST
DESTATIS_PASSWORD=GAST
FRED_API_KEY=<your_fred_key>
TANKERKOENIG_API_KEY=<your_tankerkoenig_key>

# === AI ===
ANTHROPIC_API_KEY=<your_anthropic_key>

# === Notifications ===
RESEND_API_KEY=<your_resend_key>
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>

# === Cron Auth ===
CRON_SECRET=<generate_with_openssl_rand_hex_32>

# === BauPreis Index ===
INDEX_CALCULATION_SECRET=<generate_with_openssl_rand_hex_32>

# === WhatsApp (skip for now) ===
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
```

Generate secrets:
```bash
# Generate CRON_SECRET
openssl rand -hex 32

# Generate INDEX_CALCULATION_SECRET
openssl rand -hex 32
```

---

## STEP 3: Patch Server Code & Rebuild

The code on the server is outdated (Docker cached old layers). Two files need patching:

### 3.1 Run the patch script on server

```bash
cd /opt/baupreis

cat > /tmp/patch.py << 'PYEOF'
import re

# Patch data-sources.ts: add 7 missing materials to getSyntheticPrices()
path1 = '/opt/baupreis/app/src/lib/data-sources.ts'
with open(path1) as f:
    src = f.read()
if 'copper_lme: 8200' not in src:
    src = src.replace(
        '    steel_beam: 1100,\n    wood_kvh:',
        '    steel_beam: 1100,\n    copper_lme: 8200,\n    aluminum_lme: 2150,\n    zinc_lme: 2400,\n    nickel_lme: 16500,\n    concrete_c25: 95,\n    cement_cem2: 105,\n    wood_kvh:'
    )
    if 'insulation_eps' not in src:
        src = src.replace('    insulation_xps: 55,', '    insulation_eps: 48,\n    insulation_xps: 55,')
    with open(path1, 'w') as f:
        f.write(src)
    print('OK data-sources.ts: 16 materials')
else:
    print('SKIP data-sources.ts: already patched')

# Patch analyze/route.ts: add synthetic fallback when no ANTHROPIC_API_KEY
path2 = '/opt/baupreis/app/src/app/api/cron/analyze/route.ts'
with open(path2) as f:
    src = f.read()
if 'hasValidApiKey' not in src:
    block = """
    // 2. Check if Claude API key is available --- synthetic fallback if not
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const hasValidApiKey =
      anthropicKey &&
      anthropicKey !== "placeholder" &&
      anthropicKey.length > 10;

    if (!hasValidApiKey) {
      const now = new Date().toISOString();
      for (const [code, data] of Array.from(materialPrices)) {
        const prices = data.prices;
        const latestPrice = prices[0]?.price_eur || 0;
        const oldPrice =
          prices.length > 1
            ? prices[Math.min(prices.length - 1, 6)]?.price_eur
            : latestPrice;
        const change7d =
          oldPrice > 0
            ? ((latestPrice - oldPrice) / oldPrice) * 100
            : 0;
        const change30d = change7d * 1.8;
        const trend =
          change7d > 0.5 ? "rising" : change7d < -0.5 ? "falling" : "stable";
        const recommendation =
          trend === "rising"
            ? "buy_now"
            : trend === "falling"
              ? "wait"
              : "watch";
        const forecast7d =
          Math.round(latestPrice * (1 + (change7d / 100) * 0.5) * 100) / 100;
        const forecast30d =
          Math.round(latestPrice * (1 + (change30d / 100) * 0.3) * 100) / 100;
        const forecast90d =
          Math.round(latestPrice * (1 + (change30d / 100) * 0.5) * 100) / 100;
        const explanations: Record<string, string> = {
          rising: `${data.name_de}: Preise steigen leicht. Kaufempfehlung vor weiteren Erh\u00f6hungen.`,
          falling: `${data.name_de}: Preisr\u00fcckgang zu beobachten. Abwarten k\u00f6nnte sich lohnen.`,
          stable: `${data.name_de}: Preise bleiben stabil. Kein dringender Handlungsbedarf.`,
        };
        try {
          await pool.query(
            `INSERT INTO analysis
              (material_id, timestamp, trend, change_pct_7d, change_pct_30d,
               forecast_json, explanation_de, recommendation, confidence,
               model_version, prompt_tokens, completion_tokens)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              data.material_id,
              now,
              trend,
              Math.round(change7d * 100) / 100,
              Math.round(change30d * 100) / 100,
              JSON.stringify({
                "7d": forecast7d,
                "30d": forecast30d,
                "90d": forecast90d,
              }),
              explanations[trend],
              recommendation,
              35,
              "synthetic",
              0,
              0,
            ]
          );
          analyzed++;
        } catch (err: any) {
          errors.push(`Synthetic insert ${code}: ${err.message}`);
        }
      }
      return NextResponse.json({
        ok: true,
        analyzed,
        total_materials: materialPrices.size,
        mode: "synthetic",
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // 3. Build batch prompt with all materials (Claude API path)
"""
    p = re.compile(r'\\n    //\\s*\\d*\\.?\\s*Build batch prompt[^\\n]*\\n    let priceTable')
    if p.search(src):
        src = p.sub('\\n' + block + '    let priceTable', src, count=1)
    elif '    let priceTable' in src:
        src = src.replace('    let priceTable', block + '    let priceTable', 1)
    else:
        print('ERROR: cannot find insertion point')
        exit(1)
    with open(path2, 'w') as f:
        f.write(src)
    print('OK analyze/route.ts: synthetic fallback added')
else:
    print('SKIP analyze/route.ts: already patched')
PYEOF
python3 /tmp/patch.py
```

### 3.2 Verify patches applied

```bash
grep "copper_lme: 8200" /opt/baupreis/app/src/lib/data-sources.ts
grep "hasValidApiKey" /opt/baupreis/app/src/app/api/cron/analyze/route.ts
```

Both must return results.

### 3.3 Rebuild Docker WITHOUT cache

```bash
cd /opt/baupreis
docker compose build --no-cache
docker compose up -d
```

Wait 30 seconds for app to start:
```bash
sleep 30
docker logs baupreis-app --tail 20
```

---

## STEP 4: Run Cron Jobs

After rebuild, run all cron jobs in order.
Replace `placeholder` with your actual CRON_SECRET.

```bash
SECRET="your_cron_secret_here"

# 1. Collect prices (expect: collected: 16)
curl -s -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/cron/collect-prices | python3 -m json.tool

# 2. Analyze (expect: mode: "synthetic" if no ANTHROPIC_API_KEY, or analyzed: 16 with real key)
curl -s -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/cron/analyze | python3 -m json.tool

# 3. Calculate index
curl -s -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/index/calculate | python3 -m json.tool

# 4. Generate reports
curl -s -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/cron/generate-reports | python3 -m json.tool
```

### Expected results after cron jobs:

| Endpoint | Expected |
|----------|----------|
| collect-prices | `{"ok": true, "collected": 16, ...}` |
| analyze | `{"ok": true, "analyzed": 16, "mode": "synthetic" or missing, ...}` |
| index/calculate | `{"ok": true, ...}` |
| generate-reports | `{"ok": true, ...}` |

### After this, the dashboard should show:
- 16 material cards with prices and trends
- BauPreis Index with updated value
- Prognose page with forecast cards

---

## STEP 5: Set Up System Crontab

Add recurring jobs so data stays fresh:

```bash
crontab -e
```

Add these lines (replace SECRET and APP_URL):

```cron
SECRET=your_cron_secret_here
APP=http://localhost:3000

# Health check every 5 minutes
*/5 * * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/cron/health >/dev/null 2>&1

# Send alerts every hour
0 * * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/cron/send-alerts >> /var/log/baupreis-alerts.log 2>&1

# Collect prices every 6 hours
0 */6 * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/cron/collect-prices >> /var/log/baupreis-prices.log 2>&1

# AI analysis every 12 hours
0 */12 * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/cron/analyze >> /var/log/baupreis-analyze.log 2>&1

# Generate reports at 6:00 AM
0 6 * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/cron/generate-reports >> /var/log/baupreis-reports.log 2>&1

# Calculate BauPreis Index at 7:00 AM
0 7 * * * curl -sf -X POST -H "Authorization: Bearer $SECRET" $APP/api/index/calculate >> /var/log/baupreis-index.log 2>&1
```

---

## STEP 6: (Future) Connect Real Data Sources

Once Metals.dev and other API keys are configured:
1. `collect-prices` will fetch REAL metal prices from metals.dev
2. `collect-prices` will fetch REAL indices from Destatis GENESIS
3. `analyze` will use Claude AI (real ANTHROPIC_API_KEY) instead of synthetic
4. **TODO:** Integrate Tankerkoenig (diesel), Energy-Charts (electricity), FRED (backup)

### Data source integration priority:

| Priority | Source | Materials | Status |
|----------|--------|-----------|--------|
| P1 | Metals.dev | Cu, Al, Zn, Ni | Code exists, needs API key |
| P1 | Destatis GENESIS | Concrete, Cement, Insulation | Code exists, free guest access |
| P1 | Anthropic Claude | AI analysis & forecasts | Code exists, needs API key |
| P2 | Tankerkoenig | Diesel | Need new integration |
| P2 | Energy-Charts | Electricity | Need new integration |
| P3 | FRED | Metal monthly averages (backup) | Need new integration |

---

## Quick Reference: Troubleshooting

### Dashboard shows no material cards
1. Check `analysis` table: `docker exec baupreis-postgres psql -U baupreis -c "SELECT COUNT(*) FROM analysis;"`
2. If 0 rows: run `analyze` cron job
3. If cron returns error: check `ANTHROPIC_API_KEY` or synthetic fallback

### collect-prices returns less than 16
1. Check if code patch applied: `grep "copper_lme: 8200" /opt/baupreis/app/src/lib/data-sources.ts`
2. If not found: run patch script (Step 3.1)
3. Rebuild: `docker compose build --no-cache && docker compose up -d`

### Docker uses cached layers
Always rebuild with: `docker compose build --no-cache`

### Check what's in the database
```bash
docker exec baupreis-postgres psql -U baupreis -c "SELECT COUNT(*) FROM prices;"
docker exec baupreis-postgres psql -U baupreis -c "SELECT COUNT(*) FROM analysis;"
docker exec baupreis-postgres psql -U baupreis -c "SELECT COUNT(*) FROM materials WHERE is_active = true;"
docker exec baupreis-postgres psql -U baupreis -c "SELECT DISTINCT source FROM prices;"
```
