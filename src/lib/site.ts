export const SITE = {
  name: 'Board Game of the Week',
  url: 'https://boardgameweek.vercel.app',
  tagline: 'One family game, one solo game',
  description:
    'Every week: one family board game and one solo game, picked for what is happening in the world, with a how-to video, questions to talk about and tips so everyone can play.',
  author: 'Nathan Nam',
};

/** Our neighborhood game store. We have no ties to it; facts from dogpatch.games. */
export const STORE = {
  name: 'Dogpatch Games',
  site: 'https://www.dogpatch.games/',
  address: '1095 Tennessee St.',
  city: 'San Francisco, CA 94107',
  hours: [
    { days: 'Mon–Fri', time: '2–10 pm' },
    { days: 'Sat–Sun', time: '12–10 pm' },
  ],
  directions: 'https://www.google.com/maps/search/?api=1&query=Dogpatch+Games+1095+Tennessee+St+San+Francisco',
  library: 'https://www.dogpatch.games/games',
  learnPlay: 'https://www.dogpatch.games/lapevents',
  kidsClub: 'https://www.dogpatch.games/kids-club',
  memberships: 'https://www.dogpatch.games/memberships',
  tableRates: 'https://www.dogpatch.games/tablerates',
  calendar: 'https://www.dogpatch.games/calendar',
};

export const ONLINE = { name: 'GameNerdz', url: 'https://www.gamenerdz.com/' };

type Buy = { store: 'gamenerdz' | 'publisher' | 'geekmarket'; kind: 'product' | 'search' };

/** Link text for a game's buyOnline: `long` for text links, `short` for buttons. */
export function buyLabel(buy: Buy, publisher: string) {
  if (buy.store === 'publisher') return { long: `Buy from ${publisher}`, short: publisher };
  if (buy.store === 'geekmarket') return { long: 'Find a copy on GeekMarket', short: 'GeekMarket' };
  return buy.kind === 'product'
    ? { long: 'Buy online at GameNerdz', short: 'GameNerdz' }
    : { long: 'Search GameNerdz', short: 'Search GameNerdz' };
}

export const NOT_SPONSORED = 'Not sponsored — these are simply the stores we use.';
