/**
 * Data source URLs for various city metrics
 * These are the authoritative sources for climate and livability data
 */

export interface DataSourceConfig {
	name: string;
	baseUrl: string;
	description: string;
}

// Source configurations for different metrics
export const DATA_SOURCES = {
	// Climate data sources
	climate: {
		name: 'Weather Atlas',
		baseUrl: 'https://www.weather-atlas.com',
		description: 'Comprehensive climate data including temperatures, sunshine, and humidity'
	},
	weatherSpark: {
		name: 'Weather Spark',
		baseUrl: 'https://weatherspark.com',
		description: 'Year-round weather averages and analysis'
	},
	climatesToTravel: {
		name: 'Climates to Travel',
		baseUrl: 'https://www.climatestotravel.com',
		description: 'Climate guides for travelers'
	},

	// Livability data sources
	walkScore: {
		name: 'Walk Score',
		baseUrl: 'https://www.walkscore.com',
		description: 'Walk Score, Bike Score, and Transit Score ratings'
	},
	numbeo: {
		name: 'Numbeo',
		baseUrl: 'https://www.numbeo.com',
		description: 'Cost of living index and quality of life metrics'
	},
	safetyCrime: {
		name: 'Numbeo Safety',
		baseUrl: 'https://www.numbeo.com/crime',
		description: 'Crime and safety indices for cities worldwide'
	}
} as const;

// Country code mapping for URL generation
const countrySlugMap: Record<string, string> = {
	Spain: 'spain',
	France: 'france',
	Portugal: 'portugal',
	Italy: 'italy',
	Greece: 'greece',
	Germany: 'germany',
	Austria: 'austria',
	Netherlands: 'netherlands',
	Croatia: 'croatia',
	Slovenia: 'slovenia',
	Belgium: 'belgium',
	Denmark: 'denmark',
	USA: 'united-states',
	Canada: 'canada',
	Australia: 'australia',
	'New Zealand': 'new-zealand',
	Chile: 'chile',
	Argentina: 'argentina',
	Peru: 'peru',
	Colombia: 'colombia',
	Ecuador: 'ecuador',
	'Costa Rica': 'costa-rica'
};

/**
 * Generate source URL for climate data
 */
export function getClimateSourceUrl(cityName: string, country: string): string {
	const countrySlug = countrySlugMap[country] || country.toLowerCase().replace(/\s+/g, '-');
	const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
	return `${DATA_SOURCES.climate.baseUrl}/en/${countrySlug}/${citySlug}-climate`;
}

/**
 * Generate source URL for Walk Score
 * Format: https://www.walkscore.com/score/CityName-Country/lat=XX/lng=YY/
 */
export function getWalkScoreUrl(
	cityName: string,
	country: string,
	coordinates?: { lat: number; lng: number }
): string {
	const citySlug = cityName.replace(/\s+/g, '-');
	const countrySlug = country.replace(/\s+/g, '-');

	// Build the location part of the URL
	let locationPart = `${citySlug}-${countrySlug}`;

	// Add coordinates for precise location matching
	if (coordinates) {
		return `${DATA_SOURCES.walkScore.baseUrl}/score/${locationPart}/lat=${coordinates.lat}/lng=${coordinates.lng}/`;
	}

	return `${DATA_SOURCES.walkScore.baseUrl}/score/${locationPart}/`;
}

/**
 * Generate source URL for cost of living data
 * Format: https://www.numbeo.com/cost-of-living/in/City-Country
 */
export function getCostOfLivingUrl(cityName: string, country: string): string {
	const citySlug = cityName.replace(/\s+/g, '-');
	const countrySlug = country.replace(/\s+/g, '-');
	return `${DATA_SOURCES.numbeo.baseUrl}/cost-of-living/in/${citySlug}-${countrySlug}`;
}

/**
 * Generate source URL for safety/crime data
 * Format: https://www.numbeo.com/crime/in/City-Country
 */
export function getSafetyUrl(cityName: string, country: string): string {
	const citySlug = cityName.replace(/\s+/g, '-');
	const countrySlug = country.replace(/\s+/g, '-');
	return `${DATA_SOURCES.safetyCrime.baseUrl}/in/${citySlug}-${countrySlug}`;
}

/**
 * Get source info for a specific metric
 */
export function getMetricSource(
	metric: 'sunnyDays' | 'humidity' | 'temperature' | 'walkScore' | 'bikeScore' | 'costOfLiving' | 'safetyIndex' | 'kidFriendly' | 'evInfrastructure',
	cityName: string,
	country: string,
	coordinates?: { lat: number; lng: number }
): { name: string; url: string; description: string } {
	switch (metric) {
		case 'sunnyDays':
		case 'humidity':
		case 'temperature':
			return {
				name: DATA_SOURCES.climate.name,
				url: getClimateSourceUrl(cityName, country),
				description: DATA_SOURCES.climate.description
			};
		case 'walkScore':
		case 'bikeScore':
			return {
				name: DATA_SOURCES.walkScore.name,
				url: getWalkScoreUrl(cityName, country, coordinates),
				description: DATA_SOURCES.walkScore.description
			};
		case 'costOfLiving':
			return {
				name: DATA_SOURCES.numbeo.name,
				url: getCostOfLivingUrl(cityName, country),
				description: DATA_SOURCES.numbeo.description
			};
		case 'safetyIndex':
			return {
				name: DATA_SOURCES.safetyCrime.name,
				url: getSafetyUrl(cityName, country),
				description: DATA_SOURCES.safetyCrime.description
			};
		case 'kidFriendly':
		case 'evInfrastructure':
			return {
				name: DATA_SOURCES.numbeo.name,
				url: getCostOfLivingUrl(cityName, country),
				description: 'Quality of life and infrastructure metrics'
			};
		default:
			return {
				name: 'Multiple Sources',
				url: '#',
				description: 'Aggregated from multiple data providers'
			};
	}
}
