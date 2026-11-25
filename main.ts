// Entry program for "The Funniest Office Joke, Judged Head to Head"
// (make.fun bounty u-kevin-the-funniest-office-joke-judged-head-to-head-3dc3233c).
//
// What it does: emit one single-line office joke, both to stdout and to
// the file the sealed scorer reads, $MAKEFUN_OUTPUT_DIR/entry.txt
// (falling back to /output when that variable is unset). The file gets
// the joke exactly as-is, with no trailing newline; stdout gets the joke
// followed by a newline, which is fine there.
//
// Runtime notes: Node 22, standard library only. Nothing here touches
// the network, reads the clock, or consults any randomness, so every run
// produces the identical bytes.

import * as fs from "node:fs";
import * as path from "node:path";

// Gate limits for this bounty: the joke has to be a single line of
// between 1 and 200 characters. Anything outside that is rejected by
// the scorer, so we check before writing anything.
const GATE = {
  minChars: 1,
  maxChars: 200,
  outputFile: "entry.txt",
  defaultDir: "/output",
} as const;

// The joke itself. Setup first, punchline last: a reply-all plea that
// backfires into a 400-person reply-all pile-on.
const ENTRY =
  "I hit reply-all asking everyone to stop replying-all, and now 400 strangers are replying-all to agree.";

// Runs every gate rule and returns the list of problems found, so the
// caller gets one complete report instead of tripping on the first
// failure. An empty list means the entry is good to write.
function findProblems(text: string): string[] {
  const problems: string[] = [];
  const charCount = [...text].length;

  if (text.trim().length === 0) {
    problems.push("entry is blank or only whitespace");
  }
  if (charCount < GATE.minChars || charCount > GATE.maxChars) {
    problems.push(
      `entry is ${charCount} characters, outside the ${GATE.minChars}-${GATE.maxChars} range`,
    );
  }
  if (text.split("\n").length !== 1) {
    problems.push("entry must be exactly one line");
  }
  if (text.includes("\r")) {
    problems.push("entry contains a carriage return");
  }
  return problems;
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : GATE.defaultDir;
}

function main(): void {
  const problems = findProblems(ENTRY);
  if (problems.length > 0) {
    throw new Error(`invalid entry: ${problems.join("; ")}`);
  }

  const outDir = resolveOutputDir();
  const outPath = path.join(outDir, GATE.outputFile);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, ENTRY, "utf8");

  // Read the file back and compare byte for byte: the scorer reads
  // this file, so a silent write glitch must fail loudly here rather
  // than ship a wrong entry.
  const written = fs.readFileSync(outPath, "utf8");
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }

  process.stdout.write(`${ENTRY}\n`);
}

main();
