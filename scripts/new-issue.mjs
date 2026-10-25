#!/usr/bin/env node
// Creates the next issue file in src/content/issues/ from a template.
//
//   npm run new-issue -- "Wingspan"                 # slug from the family game's name
//   npm run new-issue -- "Wingspan" --date 2026-11-06
//
// The date defaults to the coming Friday (today, if today is Friday).
// The new file starts as `draft: true`: it shows in `npm run dev` but not in the
// built site. Fill in every TODO, then set `draft: false`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/content/issues');
const args = process.argv.slice(2);
const dateArg = args.includes('--date') ? args[args.indexOf('--date') + 1] : undefined;
const name = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--date') ?? 'new-issue';

function nextFriday(from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7));
  return d;
}
const pad = (n) => String(n).padStart(2, '0');
const date = dateArg ? new Date(`${dateArg}T12:00:00`) : nextFriday();
if (Number.isNaN(date.getTime())) throw new Error(`Bad --date: ${dateArg}`);
const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const pretty = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const label = date.getDay() === 5 ? `For the weekend of ${pretty}` : `For the week of ${pretty}`;

const numbers = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  .map((f) => Number(fs.readFileSync(path.join(dir, f), 'utf8').match(/^issue:\s*(\d+)/m)?.[1] ?? 0));
const issue = Math.max(0, ...numbers) + 1;

const slug = `${iso}-${name.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-')}`;
const file = path.join(dir, `${slug}.md`);
if (fs.existsSync(file)) throw new Error(`${path.relative(root, file)} already exists`);

const template = `---
issue: ${issue}
date: ${iso}
label: "${label}"
theme: "TODO: the event, e.g. The World Series"
headline: "TODO: one-line headline"
dek: "TODO: one or two sentences under the headline."
draft: true

family:
  name: "${name === 'new-issue' ? 'TODO: family game' : name}"
  designer: "TODO"
  publisher: "TODO"
  players: "2–4"
  time: "~45 min"
  ages: "10+"
  # note: "Edition differences, if any."
  bgg: https://boardgamegeek.com/ # TODO: the game's BGG page (or remove and set publisherUrl)
  # publisherUrl: https://example.com/
  video:
    id: XXXXXXXXXXX # TODO: YouTube id; prefer Watch It Played
    title: "TODO: video title as on YouTube"
    channel: "TODO: channel"
    length: "0:00"
    minutes: "0 min"
    note: "TODO: A N-minute video covers the rules: <title> (<channel>). Watch it together before the first game."
  # buyOnline:              # GameNerdz product page if listed, else a search link. Never claim stock.
  #   url: https://www.gamenerdz.com/search.php?search_query=TODO
  #   kind: search          # or: product
  #   edition: "TODO"
  seal: ["Issue", "${issue}", "Family"]
  # color: peach            # shelf colour: mustard, mustardLt, orange, cream, paper, sky, sage, peach
  art:
    style: sunburst
    word: "TODO"             # up to 6 characters, painted on the box
    motif: meeple            # diamond, dice, meeple, cards, pawn, ball, none

# Optional. Delete the whole block for a week without a solo game.
solo:
  name: "TODO: solo game"
  publisher: "TODO"
  players: "1"
  time: "~30 min"
  ages: "12+"
  intro: "TODO: two sentences of pitch."
  bgg: https://boardgamegeek.com/ # TODO
  getIt:
    label: "TODO: e.g. $5"
    url: https://example.com/ # TODO: where to get it
  video:
    id: XXXXXXXXXXX
    title: "TODO"
    channel: "TODO"
    length: "0:00"
    minutes: "0 min"
  # color: mustardLt
  art:
    style: rings
    word: "TODO"
    caption: "TODO · Solo"
    motif: dice

sources:
  - title: "TODO: headline of the news story"
    outlet: "TODO: outlet"
    url: https://example.com/ # TODO

talk:
  youngerAges: "about 10–12"
  younger:
    - "TODO"
    - "TODO"
    - "TODO"
  teens:
    - "TODO"
    - "TODO"
    - "TODO"

tips:
  - title: "TODO"
    icon: announcer # announcer, pair, timer, eye, hand, star, rules
    text: "TODO"
  - title: "TODO"
    icon: pair
    text: "TODO"
  - title: "TODO"
    icon: timer
    text: "TODO"

dontHaveIt:
  name: "TODO: a simpler or cheaper alternative"
  maker: "TODO"
  text: "TODO: one sentence."
  # url: https://example.com/

# localNote: "Optional line in the Dogpatch Games strip. Never claim the store stocks a game."
---

TODO: "Why this week", two short paragraphs. Link the news in \`sources\` above.
`;

fs.writeFileSync(file, template);
console.log(`Created ${path.relative(root, file)} (Issue No. ${issue}, ${label}).`);
console.log('Fill in the TODOs, set draft: false, then: npm run brand -- --issues && npm run build');
