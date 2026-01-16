/**
 * Wikipedia URL mappings for cities with ambiguous names
 * Cities not in this map use the standard pattern: https://en.wikipedia.org/wiki/{City_Name}
 */
const WIKIPEDIA_OVERRIDES: Record<string, string> = {
	// Cities that need disambiguation or specific articles
	valencia: 'https://en.wikipedia.org/wiki/Valencia',
	alicante: 'https://en.wikipedia.org/wiki/Alicante',
	malaga: 'https://en.wikipedia.org/wiki/M%C3%A1laga',
	montpellier: 'https://en.wikipedia.org/wiki/Montpellier',
	faro: 'https://en.wikipedia.org/wiki/Faro,_Portugal',
	heraklion: 'https://en.wikipedia.org/wiki/Heraklion',
	nice: 'https://en.wikipedia.org/wiki/Nice',
	thessaloniki: 'https://en.wikipedia.org/wiki/Thessaloniki',
	hobart: 'https://en.wikipedia.org/wiki/Hobart',
	split: 'https://en.wikipedia.org/wiki/Split,_Croatia',
	porto: 'https://en.wikipedia.org/wiki/Porto',
	'la-serena': 'https://en.wikipedia.org/wiki/La_Serena,_Chile',
	cagliari: 'https://en.wikipedia.org/wiki/Cagliari',
	graz: 'https://en.wikipedia.org/wiki/Graz',
	wellington: 'https://en.wikipedia.org/wiki/Wellington',
	christchurch: 'https://en.wikipedia.org/wiki/Christchurch',
	mendoza: 'https://en.wikipedia.org/wiki/Mendoza,_Argentina',
	freiburg: 'https://en.wikipedia.org/wiki/Freiburg_im_Breisgau',
	trieste: 'https://en.wikipedia.org/wiki/Trieste',
	salzburg: 'https://en.wikipedia.org/wiki/Salzburg',
	arequipa: 'https://en.wikipedia.org/wiki/Arequipa',
	townsville: 'https://en.wikipedia.org/wiki/Townsville',
	victoria: 'https://en.wikipedia.org/wiki/Victoria,_British_Columbia',
	dunedin: 'https://en.wikipedia.org/wiki/Dunedin',
	wollongong: 'https://en.wikipedia.org/wiki/Wollongong',
	'santa-barbara': 'https://en.wikipedia.org/wiki/Santa_Barbara,_California',
	'vina-del-mar': 'https://en.wikipedia.org/wiki/Vi%C3%B1a_del_Mar',
	nelson: 'https://en.wikipedia.org/wiki/Nelson,_New_Zealand',
	granada: 'https://en.wikipedia.org/wiki/Granada',
	valparaiso: 'https://en.wikipedia.org/wiki/Valpara%C3%ADso',
	ventura: 'https://en.wikipedia.org/wiki/Ventura,_California',
	regensburg: 'https://en.wikipedia.org/wiki/Regensburg',
	groningen: 'https://en.wikipedia.org/wiki/Groningen',
	newcastle: 'https://en.wikipedia.org/wiki/Newcastle,_New_South_Wales',
	'napier-hastings': 'https://en.wikipedia.org/wiki/Napier,_New_Zealand',
	utrecht: 'https://en.wikipedia.org/wiki/Utrecht',
	'san-luis-obispo': 'https://en.wikipedia.org/wiki/San_Luis_Obispo,_California',
	albuquerque: 'https://en.wikipedia.org/wiki/Albuquerque,_New_Mexico',
	'gold-coast': 'https://en.wikipedia.org/wiki/Gold_Coast,_Queensland',
	aarhus: 'https://en.wikipedia.org/wiki/Aarhus',
	medellin: 'https://en.wikipedia.org/wiki/Medell%C3%ADn',
	burlington: 'https://en.wikipedia.org/wiki/Burlington,_Vermont',
	ljubljana: 'https://en.wikipedia.org/wiki/Ljubljana',
	cuenca: 'https://en.wikipedia.org/wiki/Cuenca,_Ecuador',
	tauranga: 'https://en.wikipedia.org/wiki/Tauranga',
	'sunshine-coast': 'https://en.wikipedia.org/wiki/Sunshine_Coast,_Queensland',
	alajuela: 'https://en.wikipedia.org/wiki/Alajuela',
	'santa-fe': 'https://en.wikipedia.org/wiki/Santa_Fe,_New_Mexico',
	ghent: 'https://en.wikipedia.org/wiki/Ghent',
	boulder: 'https://en.wikipedia.org/wiki/Boulder,_Colorado',
	kelowna: 'https://en.wikipedia.org/wiki/Kelowna'
};

/**
 * Get the Wikipedia URL for a city
 */
export function getWikipediaUrl(slug: string): string {
	return WIKIPEDIA_OVERRIDES[slug] ?? `https://en.wikipedia.org/wiki/${slug}`;
}
