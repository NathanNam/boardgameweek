import { getCollection, type CollectionEntry } from 'astro:content';

export type Issue = CollectionEntry<'issues'>;

/** Published issues, newest first. Drafts show up only in `astro dev`. */
export async function getIssues(): Promise<Issue[]> {
  const all = await getCollection('issues', (e) => import.meta.env.DEV || !e.data.draft);
  return all.sort((a, b) => b.data.issue - a.data.issue || b.data.date.getTime() - a.data.date.getTime());
}

export const issuePath = (i: Issue) => `/issues/${i.id}/`;
export const ogPath = (i: Issue) => `/og/issues/${i.id}.png`;
export const issueLine = (i: Issue) => `Issue No. ${i.data.issue} · ${i.data.label}`;
