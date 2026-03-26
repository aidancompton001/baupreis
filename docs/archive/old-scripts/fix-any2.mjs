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

  // Fix multiline if patterns that weren't caught:
  // Pattern: if (\n      error.message === "No organization found" ||\n      error.message === ...
  content = content.replace(
    /if\s*\(\s*\n\s*error\.message === "No organization found" \|\|\s*\n\s*error\.message === "Trial expired" \|\|\s*\n\s*error\.message === "Subscription cancelled"\s*\n\s*\)/g,
    'if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message))'
  );

  // Fix: chat/route.ts multiline with different spacing
  content = content.replace(
    /if\s*\(\s*error\.message === "No organization found" \|\|\s*error\.message === "Trial expired" \|\|\s*error\.message === "Subscription cancelled"\s*\)/g,
    'if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message))'
  );

  // Fix telegram webhook - error.message access
  content = content.replace(
    /logger\.error\("Telegram webhook error", \{ error: error\.message \}\)/g,
    'logger.error("Telegram webhook error", { error: error instanceof Error ? error.message : String(error) })'
  );

  // Fix: stripe webhook err.message on line 15
  content = content.replace(
    /logger\.error\("\[Stripe Webhook\] Signature verification failed", \{ error: err\.message \}\)/g,
    'logger.error("[Stripe Webhook] Signature verification failed", { error: err instanceof Error ? err.message : String(err) })'
  );

  if (content !== original) {
    writeFileSync(file, content);
    totalChanges++;
    console.log('Updated:', file);
  }
}

console.log('Total files changed:', totalChanges);
