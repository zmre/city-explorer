/**
 * Geographic coordinates for a city
 */
export interface Coordinates {
	lat: number;
	lng: number;
}

/**
 * Climate-related metrics for a city
 */
export interface ClimateData {
	sunnyDays: number;
	humidity: number;
	summerHigh: number;
	winterLow: number;
}

/**
 * Geographic features near a city
 */
export interface GeographyData {
	nearMountains: boolean;
	nearOcean: boolean;
}

/**
 * Livability metrics for a city
 */
export interface LivabilityData {
	walkScore: number;
	bikeScore: number;
	costOfLiving: number;
	safetyIndex: number;
	kidFriendly: number;
	evInfrastructure: number;
	airportDistance: number;
}

/**
 * Category scores for a city (calculated based on weights)
 */
export interface CategoryScores {
	climate: number;
	geography: number;
	accessibility: number;
	cost: number;
	family: number;
	sustainability: number;
	total: number;
}

/**
 * Complete city data structure
 */
export interface City {
	slug: string;
	name: string;
	country: string;
	region: string;
	population: number;
	coordinates: Coordinates;
	climate: ClimateData;
	geography: GeographyData;
	livability: LivabilityData;
	scores: CategoryScores;
	rank: number;
	sources?: string[];
}

/**
 * Weight configuration for custom scoring
 */
export interface ScoringWeights {
	climate: number;
	geography: number;
	accessibility: number;
	cost: number;
	family: number;
	sustainability: number;
}

/**
 * Default scoring weights (total = 100)
 */
export const DEFAULT_WEIGHTS: ScoringWeights = {
	climate: 30,
	geography: 10,
	accessibility: 15,
	cost: 15,
	family: 15,
	sustainability: 15
};

/**
 * Filter options for city list
 */
export interface CityFilters {
	regions: string[];
	countries: string[];
	minPopulation: number;
	maxPopulation: number;
	minSunnyDays: number;
	maxHumidity: number;
	requireMountains: boolean;
	requireOcean: boolean;
	requireBoth: boolean;
	minWalkScore: number;
	maxCostOfLiving: number;
}

/**
 * Default filter values (show all)
 */
export const DEFAULT_FILTERS: CityFilters = {
	regions: [],
	countries: [],
	minPopulation: 0,
	maxPopulation: 1000000,
	minSunnyDays: 0,
	maxHumidity: 100,
	requireMountains: false,
	requireOcean: false,
	requireBoth: false,
	minWalkScore: 0,
	maxCostOfLiving: 200
};

/**
 * Sort options for city list
 */
export type SortField =
	| 'rank'
	| 'name'
	| 'country'
	| 'population'
	| 'sunnyDays'
	| 'humidity'
	| 'walkScore'
	| 'bikeScore'
	| 'costOfLiving'
	| 'safetyIndex'
	| 'total';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
	field: SortField;
	direction: SortDirection;
}

/**
 * Regions for grouping cities
 */
export type Region = 'North America' | 'Europe' | 'Oceania' | 'South America' | 'Central America';

/**
 * Data source reference
 */
export interface DataSource {
	id: string;
	name: string;
	url: string;
	description: string;
	metrics: string[];
}
