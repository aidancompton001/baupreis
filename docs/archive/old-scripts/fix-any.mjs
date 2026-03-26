import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findTsFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...findTsFiles(full));
    } else if (entry.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const files = findTsFiles('app/src/app/api');
let totalChanges = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // P1: error.message triple-OR auth check
  content = content.replace(
    /if \(error\.message === "No organization found" \|\| error\.message === "Trial expired" \|\| error\.message === "Subscription cancelled"\)/g,
    'if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message))'
  );

  // P2: .includes(error.message) single-line form
  content = content.replace(
    /if \(\["No organization found", "Trial expired", "Subscription cancelled"\]\.includes\(error\.message\)\)/g,
    'if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message))'
  );

  // P2b: multiline includes with formatting
  content = content.replace(
    /if\s*\(\s*\[\s*"No organization found",\s*"Trial expired",\s*"Subscription cancelled",?\s*\]\.includes\(error\.message\)\s*\)/gs,
    'if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message))'
  );

  // P3: Insufficient permissions
  content = content.replace(
    /if \(error\.message === "Insufficient permissions"\)/g,
    'if (error instanceof Error && error.message === "Insufficient permissions")'
  );

  // P4: Invalid API key
  content = content.replace(
    /if \(error\.message === "Invalid API key"\)/g,
    'if (error instanceof Error && error.message === "Invalid API key")'
  );

  // P5: API access not included
  content = content.replace(
    /if \(error\.message === "API access not included in plan"\)/g,
    'if (error instanceof Error && error.message === "API access not included in plan")'
  );

  // P7: error.message || "fallback" patterns
  const fallbacks = [
    "Analysis failed", "Calculation failed", "Collection failed",
    "Downgrade failed", "Alert processing failed", "Report generation failed"
  ];
  for (const fb of fallbacks) {
    content = content.replace(
      new RegExp(`error\\.message \\|\\| "${fb}"`, 'g'),
      `error instanceof Error ? error.message : "${fb}"`
    );
  }

  // P8: Standalone { error: error.message } in account/profile, account/delete, account/export catch blocks
  // These need careful handling - only in simple catch blocks that return error.message directly
  // Pattern: `return NextResponse.json({ error: error.message }, { status: 403 });` in a catch block
  // Replace only when NOT preceded by an if-instanceof check on same error variable
  // We do this conservatively: replace `{ error: error.message }` with ternary
  content = content.replace(
    /return NextResponse\.json\(\{ error: error\.message \}, \{ status: 403 \}\);/g,
    'return NextResponse.json({ error: error instanceof Error ? error.message : "Interner Serverfehler" }, { status: 403 });'
  );

  // P9: err.message patterns in cron routes
  content = content.replace(
    /`Synthetic insert \$\{code\}: \$\{err\.message\}`/g,
    '`Synthetic insert ${code}: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Insert analysis \$\{a\.code\}: \$\{err\.message\}`/g,
    '`Insert analysis ${a.code}: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Insert \$\{code\}: \$\{err\.message\}`/g,
    '`Insert ${code}: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Org \$\{orgId\}: \$\{err\.message\}`/g,
    '`Org ${orgId}: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Report \$\{rt\.type\} for org \$\{org\.id\}: \$\{err\.message\}`/g,
    '`Report ${rt.type} for org ${org.id}: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`DB: \$\{err\.message\}`/g,
    '`DB: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Freshness check: \$\{err\.message\}`/g,
    '`Freshness check: ${err instanceof Error ? err.message : String(err)}`'
  );
  content = content.replace(
    /`Batch \$\{b \+ 1\}: \$\{batchErr\.message\?\.substring\(0, 150\)\}`/g,
    '`Batch ${b + 1}: ${batchErr instanceof Error ? batchErr.message.substring(0, 150) : String(batchErr)}`'
  );
  content = content.replace(
    /`\$\{ch\} for rule \$\{rule\.rule_id\}: \$\{err\.message\}`/g,
    '`${ch} for rule ${rule.rule_id}: ${err instanceof Error ? err.message : String(err)}`'
  );

  // P10: params: any[] -> (string | number)[]
  content = content.replace(/const params: any\[\]/g, 'const params: (string | number)[]');

  // P11: (row: any) in .map callbacks
  content = content.replace(/\.map\(\(row: any\)/g, '.map((row: Record<string, string>)');

  // P12: let body: any
  content = content.replace(/let body: any;/g, 'let body: Record<string, unknown>;');

  // P13: sessionParams: any in checkout
  content = content.replace(
    /const sessionParams: any = \{/g,
    'const sessionParams: Record<string, unknown> = {'
  );

  // P14: clerk webhook evt: any / as any
  content = content.replace(/let evt: any;/g, 'let evt: { type: string; data: Record<string, unknown> };');
  content = content.replace(
    /\) as any;/g,
    ') as { type: string; data: Record<string, unknown> };'
  );

  // P15: stripe webhook as any
  content = content.replace(
    /const session = event\.data\.object as any;/g,
    'const session = event.data.object as { metadata?: Record<string, string>; subscription: string; customer: string };'
  );
  // Handle two subscription = event.data.object as any; occurrences
  content = content.replace(
    /const subscription = event\.data\.object as any;/g,
    'const subscription = event.data.object as { id: string; status: string; items?: { data?: Array<{ price?: { id: string } }> } };'
  );
  content = content.replace(
    /const invoice = event\.data\.object as any;/g,
    'const invoice = event.data.object as { subscription: string | null };'
  );

  // P16: Map<string, any>
  content = content.replace(/new Map<string, any>\(\)/g, 'new Map<string, Record<string, unknown>>()');

  // P17: Stripe webhook err handling
  content = content.replace(
    /\{ error: err\.message \}/g,
    '{ error: err instanceof Error ? err.message : "Invalid signature" }'
  );
  // But only in stripe webhook, fix the logger line too
  content = content.replace(
    /logger\.error\("\[Stripe Webhook\] Signature verification failed", \{ error: err instanceof Error \? err\.message : "Invalid signature" \}\)/g,
    'logger.error("[Stripe Webhook] Signature verification failed", { error: err instanceof Error ? err.message : "Invalid signature" })'
  );

  // P18: telegram webhook error.message
  content = content.replace(
    /logger\.error\("Telegram webhook error", \{ error: error\.message \}\)/g,
    'logger.error("Telegram webhook error", { error: error instanceof Error ? error.message : String(error) })'
  );

  // P19: billing portal console.error
  content = content.replace(
    /console\.error\("\[Billing Portal\] Error:", error\.message\)/g,
    'console.error("[Billing Portal] Error:", error instanceof Error ? error.message : String(error))'
  );

  // P20: checkout console.error
  content = content.replace(
    /console\.error\("\[Checkout\] Error:", error\.message\)/g,
    'console.error("[Checkout] Error:", error instanceof Error ? error.message : String(error))'
  );

  // P21: register route err.code
  content = content.replace(
    /if \(err\.code === "23505"\)/g,
    'if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505")'
  );

  // P22: Registration error console.error
  content = content.replace(
    /console\.error\("Registration error:", err\)/g,
    'console.error("Registration error:", err instanceof Error ? err.message : String(err))'
  );

  // P23: logger.error with error.message
  content = content.replace(
    /logger\.error\("\[Stripe Webhook\] Signature verification failed", \{ error: err\.message \}\)/g,
    'logger.error("[Stripe Webhook] Signature verification failed", { error: err instanceof Error ? err.message : "Invalid signature" })'
  );

  // P24: WhatsApp console.error
  content = content.replace(
    /console\.error\("WhatsApp send failed:", result\.error\)/g,
    'console.error("WhatsApp send failed:", result.error)'
  );

  if (content !== original) {
    writeFileSync(file, content);
    totalChanges++;
    console.log('Updated:', file);
  }
}

console.log('Total files changed:', totalChanges);
