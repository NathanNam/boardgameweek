import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * One file per issue in src/content/issues/<slug>.md.
 * The file name (without .md) is the permanent URL: /issues/<slug>/.
 * The Markdown body is the "Why this week" text; everything else is frontmatter.
 */

const color = z.enum(['mustard', 'mustardLt', 'forest', 'forestDk', 'rust', 'orange', 'cream', 'paper', 'sky', 'sage', 'peach']);

/** Light colours only: shelf boxes carry dark text. */
const shelfColor = z.enum(['mustard', 'mustardLt', 'orange', 'cream', 'paper', 'sky', 'sage', 'peach']);

const art = z.object({
  /** sunburst: rays + wavy stripes (family). rings: concentric rings (solo). */
  style: z.enum(['sunburst', 'rings']).default('sunburst'),
  /** Big word painted on the box front, e.g. "2045" or "7". Keep it short. */
  word: z.string().max(6),
  /** Small raised text after the word, e.g. "th". */
  sup: z.string().max(3).optional(),
  /** Small caps caption along the bottom (rings style). */
  caption: z.string().max(28).optional(),
  motif: z.enum(['diamond', 'dice', 'meeple', 'cards', 'pawn', 'ball', 'none']).default('meeple'),
  background: color.optional(),
});

const video = z.object({
  /** YouTube video id (the part after watch?v=). */
  id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string(),
  channel: z.string(),
  /** Length as shown on YouTube, e.g. "5:46". */
  length: z.string(),
  /** Short label for buttons, e.g. "6 min". */
  minutes: z.string(),
  /** The sentence shown under the video (family game). */
  note: z.string().optional(),
});

const link = z.object({ label: z.string(), url: z.url() });

const game = z.object({
  name: z.string(),
  designer: z.string().optional(),
  publisher: z.string(),
  players: z.string(),
  time: z.string(),
  ages: z.string(),
  /** Small print under the facts, e.g. edition differences. */
  note: z.string().optional(),
  /** Solo card pitch: about two sentences. */
  intro: z.string().optional(),
  /** BoardGameGeek page. Optional: falls back to publisherUrl. */
  bgg: z.url().optional(),
  publisherUrl: z.url().optional(),
  video,
  /** Solo card: primary way to get it, e.g. { label: "$5", url: <print-and-play page> }. */
  getIt: link.optional(),
  /** GameNerdz product page (kind: product) or search (kind: search). Never claim stock. */
  buyOnline: z.object({ url: z.url(), kind: z.enum(['product', 'search']), edition: z.string().optional() }).optional(),
  /** The round sticker on the box: three short lines. */
  seal: z.tuple([z.string(), z.string(), z.string()]).optional(),
  /** Box colour on the archive shelf. Optional: a colour is picked from the issue number. */
  color: shelfColor.optional(),
  art,
}).refine((g) => g.bgg || g.publisherUrl, { message: 'Each game needs a bgg or publisherUrl link' });

const issues = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/issues' }),
  schema: z.object({
    issue: z.number().int().positive(),
    /** First day the issue covers (normally the Friday it goes live). */
    date: z.coerce.date(),
    /** Free text shown after "Issue No. N · ", e.g. "For the weekend of Oct 30, 2026". */
    label: z.string(),
    theme: z.string(),
    headline: z.string(),
    dek: z.string(),
    draft: z.boolean().default(false),
    family: game,
    solo: game.optional(),
    sources: z.array(z.object({ title: z.string(), outlet: z.string(), url: z.url() })).min(1),
    talk: z.object({
      youngerAges: z.string().default('about 10–12'),
      younger: z.array(z.string()).min(1),
      teens: z.array(z.string()).min(1),
    }),
    tips: z.array(z.object({
      title: z.string(),
      text: z.string(),
      icon: z.enum(['announcer', 'pair', 'timer', 'eye', 'hand', 'star', 'rules']),
    })).min(1),
    /** Optional weekly line in the Dogpatch Games strip. Never claim the store stocks a game. */
    localNote: z.string().optional(),
  }),
});

export const collections = { issues };
