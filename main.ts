// main.ts — entrypoint for post-x-promote-make-your-own-bounty-01.
//
// What it does, and nothing more:
//   1. Reads POST.json from the repository root and validates its `url`
//      is an X post address. The starter placeholder
//      (https://x.com/<handle>/status/<id>) is accepted with a warning and
//      copied as-is, exit 0, so the entry can be built before the post is
//      published; any other malformed URL is a hard error, exit 1.
//   2. Reads POST-DRAFT.txt and validates it carries everything the post
//      needs: the required make.fun line, this account's play code, and the
//      link to make.fun's make-your-own-bounty post that the post quotes.
//      Anything missing is named and the run exits 1. It also checks the
//      post text itself (the part before the posting-note separator) fits
//      X's 280-character limit.
//   3. Copies POST.json to <output>/POST.json and writes the validated
//      draft to <output>/post-draft.txt.
//
// Node 22, standard library only, no network. The output directory is
// $MAKEFUN_OUTPUT_DIR when set, otherwise /output. Input files are read
// from $MAKEFUN_BOT_DIR when set, otherwise the current directory.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? ".";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The post this entry promotes: make.fun's make-your-own-bounty post.
const QUOTED_POST_URL = "https://x.com/makefunai/status/2124915864336236646";
// The line that carries both make.fun and the @makefunai tag.
const REQUIRED_LINE =
  "Make your own bounty on @makefunai: https://make.fun/sponsor/new";
// This account's play code for this bounty.
const PLAY_CODE = "makefun-lavender-pinecone-walkway";

// An X post address: https://x.com/<handle>/status/<id> (or twitter.com,
// with an optional www./mobile. prefix, or /i/web/status/<id>), id digits
// only, an optional query or fragment read past.
const POST_URL_RE =
  /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:[A-Za-z0-9_]{1,15}\/status|i\/web\/status)\/(\d+)(?:[?#].*)?$/;
const PLACEHOLDER_URL = "https://x.com/<handle>/status/<id>";

function fail(message: string): never {
  console.error(`main.ts: error: ${message}`);
  process.exit(1);
}

const postJsonPath = join(BOT_DIR, "POST.json");
const draftPath = join(BOT_DIR, "POST-DRAFT.txt");

// --- 1. POST.json: parse and validate the URL shape. ---
let postJsonText: string;
try {
  postJsonText = readFileSync(postJsonPath, "utf8");
} catch {
  fail(`cannot read ${postJsonPath}`);
}

let post: unknown;
try {
  post = JSON.parse(postJsonText);
} catch {
  fail("POST.json is not valid JSON");
}
if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must be a JSON object");
}
const url = (post as { url?: unknown }).url;
if (typeof url !== "string") {
  fail('POST.json must have a string "url" field');
}

if (url === PLACEHOLDER_URL) {
  console.warn(
    "main.ts: warning: POST.json still holds the placeholder URL " +
      "(https://x.com/<handle>/status/<id>); replace it with the real " +
      "post address after publishing the post on X.",
  );
} else if (!POST_URL_RE.test(url)) {
  fail(
    `POST.json url is not an X post address: ${JSON.stringify(url)} ` +
      "(expected https://x.com/<handle>/status/<id>)",
  );
}

// --- 2. POST-DRAFT.txt: validate it carries everything the post needs. ---
let draft: string;
try {
  draft = readFileSync(draftPath, "utf8");
} catch {
  fail(`cannot read ${draftPath}`);
}

const missing: string[] = [];
if (!draft.includes(REQUIRED_LINE)) {
  missing.push(`required line ${JSON.stringify(REQUIRED_LINE)}`);
}
if (!draft.includes(PLAY_CODE)) {
  missing.push(`play code ${JSON.stringify(PLAY_CODE)}`);
}
if (!draft.includes(QUOTED_POST_URL)) {
  missing.push(`quoted post link ${JSON.stringify(QUOTED_POST_URL)}`);
}
if (missing.length > 0) {
  fail(`POST-DRAFT.txt is missing: ${missing.join("; ")}`);
}

// The post text is the part before the posting-note separator ("---");
// the note is instructions, not post text. X allows 280 characters a
// post, so the text itself must fit. (Plain character count is stricter
// than X's weighted count, where a link counts 23, so this is a safe
// upper bound.)
const postText = draft.split("\n---\n")[0].trimEnd();
if (postText.length === 0) {
  fail("POST-DRAFT.txt has no post text before the posting-note separator");
}
if (postText.length > 280) {
  fail(
    `post text is ${postText.length} characters, over X's 280-character limit`,
  );
}

// --- 3. Write the outputs. ---
mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(postJsonPath, join(OUTPUT_DIR, "POST.json"));
writeFileSync(join(OUTPUT_DIR, "post-draft.txt"), draft, "utf8");

console.log(`main.ts: wrote ${join(OUTPUT_DIR, "POST.json")}`);
console.log(`main.ts: wrote ${join(OUTPUT_DIR, "post-draft.txt")}`);
console.log("main.ts: post draft validated (required line, play code, quote link present)");
