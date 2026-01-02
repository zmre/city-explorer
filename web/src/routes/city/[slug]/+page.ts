import citiesData from '$lib/data/cities.json';
import type { City } from '$lib/types/city';

interface CitiesJson {
	generated: string;
	count: number;
	cities: City[];
}

const data = citiesData as CitiesJson;

// Generate all city pages at build time
export function entries() {
	return data.cities.map((city) => ({
		slug: city.slug
	}));
}

export const prerender = true;
