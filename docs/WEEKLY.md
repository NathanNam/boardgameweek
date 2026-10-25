# The weekly routine

A new issue goes live every **Friday morning**. Each issue is one file in
`src/content/issues/`: one family (multiplayer) game, plus an optional solo game.

## Thursday: propose

1. Pick **3 events** happening in the world this week (sport, science, a holiday,
   a launch, the weather…). Each needs a news source you can link to.
2. For each event, suggest **3 games** that fit it, and mark which ones can be
   played **solo**. For each game note: players, time, ages, and a one-line reason.
3. Send the 3 × 3 list to Nathan.

## Thursday: Nathan picks

Nathan chooses **one family game** and (optionally) **one solo game**.

## Thursday: write the issue

1. Create the file:

   ```sh
   npm run new-issue -- "Family Game Name"            # date = the coming Friday
   npm run new-issue -- "Family Game Name" --date 2026-11-06
   ```

   It creates `src/content/issues/<date>-<slug>.md` with the next issue number,
   a label like "For the weekend of Nov 6, 2026", and `draft: true`.
2. **Verify every fact** on BoardGameGeek and the publisher's page: designer,
   publisher, players, play time, ages, and edition differences (use `note`).
   Link the game's BGG page (`bgg`); if it has none, use `publisherUrl`.
3. **How-to video:** prefer **Watch It Played** — search the channel at
   <https://www.youtube.com/@WatchItPlayed/search>. If they haven't covered it,
   use a short how-to (for example Board Game Blitz) or the publisher's own.
   Record the exact title, channel and length as shown on YouTube.
4. **Where to buy:**
   - find each game on **GameNerdz** — the product page if listed, else a search
     link (`https://www.gamenerdz.com/search.php?search_query=...`). **Never state
     stock** ("Buy online" / "Search", not "In stock");
   - for print-and-play or publisher-direct games, put that in the solo game's `getIt`;
   - never claim that Dogpatch Games stocks a game. Use `localNote` only for
     something true and checkable (e.g. a Learn + Play night listed on their site).
5. **Why this week:** two short paragraphs in the Markdown body, plus at least one
   linked news story in `sources`.
6. **Talk about it:** three questions for younger players (about 10–12) and three
   for teens. **Make it work for everyone:** three practical tips.
7. **Don't have it?** a simpler or cheaper alternative.
8. Box art: pick a short `word`, a `motif` and a shelf `color`. Drawings are
   generated; never use publisher artwork.
9. Set `draft: false`.

## Thursday: check and open a PR

```sh
npm i --no-save puppeteer-core@23.11.1   # once per checkout
npm run brand -- --issues                # share card: public/og/issues/<slug>.png
npm run check && npm run build
npm run dev                              # read the whole issue on a phone-width window
```

Click every link (news sources, BGG, video, GameNerdz, print-and-play). Then
commit on a branch and open a pull request.

## Friday morning: Nathan merges

Vercel deploys `main` automatically. The new issue becomes the home page; the
previous one stays at its `/issues/<slug>/` link and on the shelf at `/archive/`.
