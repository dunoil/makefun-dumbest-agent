import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry: one line, 82 characters. The gate requires UTF-8 text of
// 1 to 200 characters, a single line, and not only white space, so the
// validation below checks exactly those conditions before writing.
const ENTRY =
  "My agent spent forty minutes polishing a README for a repo it had already deleted.";

const outputPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

function fail(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

if (ENTRY.length < 1 || ENTRY.length > 200) {
  fail(`Entry must be 1 to 200 characters, got ${ENTRY.length}.`);
}
if (ENTRY.trim().length === 0) {
  fail("Entry must not be only white space.");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("Entry must be a single line.");
}
for (const ch of ENTRY) {
  const code = ch.charCodeAt(0);
  if ((code < 0x20 && ch !== "\t") || code === 0x7f) {
    fail("Entry must not contain control characters.");
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");

const roundTrip = readFileSync(outputPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("Verification failed: file contents differ from the entry text.");
}

console.log(ENTRY);
console.log(`Characters: ${ENTRY.length}`);
