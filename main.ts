// The Funniest Office Joke, Judged Head to Head
// make.fun bounty u-kevin-the-funniest-office-joke-judged-head-to-head-3dc3233c
//
// One line about office life, a real joke with a setup and a turn, punchline
// last. This program prints the joke and writes it, with no trailing
// newline, to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt),
// the file the sealed scorer reads. Stdlib only, no network, deterministic.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, within the gate's 1-to-200-character cap, punchline
// last. The sealed scorer rejects anything longer, blank, or multi-line,
// so the program refuses to write an entry that would fail the gate.
const JOKE =
  "My boss asked for my five-year plan, so I showed him my calendar — the same meeting, copy-pasted until 2030.";

const MAX_CHARS = 200;

if (JOKE.trim().length === 0 || JOKE.length > MAX_CHARS) {
  throw new Error(
    `entry must be 1 to ${MAX_CHARS} non-whitespace characters, got ${JOKE.length} characters`,
  );
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), JOKE, "utf8");

process.stdout.write(JOKE + "\n");
