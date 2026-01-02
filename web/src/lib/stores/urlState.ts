import type { ScoringWeights, CityFilters, SortConfig } from '$lib/types/city';
import { DEFAULT_WEIGHTS, DEFAULT_FILTERS } from '$lib/types/city';
import { browser } from '$app/environment';

/**
 * URL parameter keys
 */
const PARAM_KEYS = {
	// Weights
	wClimate: 'wc',
	wGeography: 'wg',
	wAccessibility: 'wa',
	wCost: 'wo',
	wFamily: 'wf',
	wSustainability: 'ws',
	// Filters
	regions: 'r',
	countries: 'co',
	minPop: 'pn',
	maxPop: 'px',
	minSun: 'sn',
	maxHum: 'hx',
	mountains: 'm',
	ocean: 'o',
	both: 'b',
	minWalk: 'wn',
	maxCost: 'cx',
	// Sort
	sortField: 'sf',
	sortDir: 'sd',
	// Comparison
	compare: 'cmp'
} as const;

/**
 * Parse weights from URL params
 */
export function parseWeightsFromUrl(params: URLSearchParams): ScoringWeights {
	return {
		climate: parseFloat(params.get(PARAM_KEYS.wClimate) ?? '') || DEFAULT_WEIGHTS.climate,
		geography: parseFloat(params.get(PARAM_KEYS.wGeography) ?? '') || DEFAULT_WEIGHTS.geography,
		accessibility:
			parseFloat(params.get(PARAM_KEYS.wAccessibility) ?? '') || DEFAULT_WEIGHTS.accessibility,
		cost: parseFloat(params.get(PARAM_KEYS.wCost) ?? '') || DEFAULT_WEIGHTS.cost,
		family: parseFloat(params.get(PARAM_KEYS.wFamily) ?? '') || DEFAULT_WEIGHTS.family,
		sustainability:
			parseFloat(params.get(PARAM_KEYS.wSustainability) ?? '') || DEFAULT_WEIGHTS.sustainability
	};
}

/**
 * Parse filters from URL params
 */
export function parseFiltersFromUrl(params: URLSearchParams): CityFilters {
	return {
		regions: params.get(PARAM_KEYS.regions)?.split(',').filter(Boolean) ?? [],
		countries: params.get(PARAM_KEYS.countries)?.split(',').filter(Boolean) ?? [],
		minPopulation: parseInt(params.get(PARAM_KEYS.minPop) ?? '') || DEFAULT_FILTERS.minPopulation,
		maxPopulation: parseInt(params.get(PARAM_KEYS.maxPop) ?? '') || DEFAULT_FILTERS.maxPopulation,
		minSunnyDays: parseInt(params.get(PARAM_KEYS.minSun) ?? '') || DEFAULT_FILTERS.minSunnyDays,
		maxHumidity: parseInt(params.get(PARAM_KEYS.maxHum) ?? '') || DEFAULT_FILTERS.maxHumidity,
		requireMountains: params.get(PARAM_KEYS.mountains) === '1',
		requireOcean: params.get(PARAM_KEYS.ocean) === '1',
		requireBoth: params.get(PARAM_KEYS.both) === '1',
		minWalkScore: parseInt(params.get(PARAM_KEYS.minWalk) ?? '') || DEFAULT_FILTERS.minWalkScore,
		maxCostOfLiving:
			parseInt(params.get(PARAM_KEYS.maxCost) ?? '') || DEFAULT_FILTERS.maxCostOfLiving
	};
}

/**
 * Parse sort config from URL params
 */
export function parseSortFromUrl(params: URLSearchParams): SortConfig {
	const field = params.get(PARAM_KEYS.sortField);
	const dir = params.get(PARAM_KEYS.sortDir);

	return {
		field: (field as SortConfig['field']) || 'rank',
		direction: (dir as SortConfig['direction']) || 'asc'
	};
}

/**
 * Parse comparison cities from URL params
 */
export function parseComparisonFromUrl(params: URLSearchParams): string[] {
	return params.get(PARAM_KEYS.compare)?.split(',').filter(Boolean) ?? [];
}

/**
 * Build URL params from state
 */
export function buildUrlParams(
	weights: ScoringWeights,
	filters: CityFilters,
	sort: SortConfig,
	comparison: string[] = []
): URLSearchParams {
	const params = new URLSearchParams();

	// Only add non-default weights
	if (weights.climate !== DEFAULT_WEIGHTS.climate)
		params.set(PARAM_KEYS.wClimate, weights.climate.toString());
	if (weights.geography !== DEFAULT_WEIGHTS.geography)
		params.set(PARAM_KEYS.wGeography, weights.geography.toString());
	if (weights.accessibility !== DEFAULT_WEIGHTS.accessibility)
		params.set(PARAM_KEYS.wAccessibility, weights.accessibility.toString());
	if (weights.cost !== DEFAULT_WEIGHTS.cost) params.set(PARAM_KEYS.wCost, weights.cost.toString());
	if (weights.family !== DEFAULT_WEIGHTS.family)
		params.set(PARAM_KEYS.wFamily, weights.family.toString());
	if (weights.sustainability !== DEFAULT_WEIGHTS.sustainability)
		params.set(PARAM_KEYS.wSustainability, weights.sustainability.toString());

	// Only add non-default filters
	if (filters.regions.length > 0) params.set(PARAM_KEYS.regions, filters.regions.join(','));
	if (filters.countries.length > 0) params.set(PARAM_KEYS.countries, filters.countries.join(','));
	if (filters.minPopulation !== DEFAULT_FILTERS.minPopulation)
		params.set(PARAM_KEYS.minPop, filters.minPopulation.toString());
	if (filters.maxPopulation !== DEFAULT_FILTERS.maxPopulation)
		params.set(PARAM_KEYS.maxPop, filters.maxPopulation.toString());
	if (filters.minSunnyDays !== DEFAULT_FILTERS.minSunnyDays)
		params.set(PARAM_KEYS.minSun, filters.minSunnyDays.toString());
	if (filters.maxHumidity !== DEFAULT_FILTERS.maxHumidity)
		params.set(PARAM_KEYS.maxHum, filters.maxHumidity.toString());
	if (filters.requireMountains) params.set(PARAM_KEYS.mountains, '1');
	if (filters.requireOcean) params.set(PARAM_KEYS.ocean, '1');
	if (filters.requireBoth) params.set(PARAM_KEYS.both, '1');
	if (filters.minWalkScore !== DEFAULT_FILTERS.minWalkScore)
		params.set(PARAM_KEYS.minWalk, filters.minWalkScore.toString());
	if (filters.maxCostOfLiving !== DEFAULT_FILTERS.maxCostOfLiving)
		params.set(PARAM_KEYS.maxCost, filters.maxCostOfLiving.toString());

	// Sort (only if not default)
	if (sort.field !== 'rank') params.set(PARAM_KEYS.sortField, sort.field);
	if (sort.direction !== 'asc') params.set(PARAM_KEYS.sortDir, sort.direction);

	// Comparison
	if (comparison.length > 0) params.set(PARAM_KEYS.compare, comparison.join(','));

	return params;
}

/**
 * Get shareable URL with current state
 */
export function getShareableUrl(
	weights: ScoringWeights,
	filters: CityFilters,
	sort: SortConfig,
	comparison: string[] = []
): string {
	if (!browser) return '';

	const params = buildUrlParams(weights, filters, sort, comparison);
	const base = window.location.origin + window.location.pathname;

	if (params.toString()) {
		return `${base}?${params.toString()}`;
	}
	return base;
}

/**
 * Update browser URL without navigation
 */
export function updateBrowserUrl(
	weights: ScoringWeights,
	filters: CityFilters,
	sort: SortConfig,
	comparison: string[] = []
): void {
	if (!browser) return;

	const params = buildUrlParams(weights, filters, sort, comparison);
	const url = params.toString()
		? `${window.location.pathname}?${params.toString()}`
		: window.location.pathname;

	window.history.replaceState({}, '', url);
}
