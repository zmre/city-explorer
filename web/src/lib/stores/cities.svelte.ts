import type { City, CityFilters, SortConfig, ScoringWeights } from '$lib/types/city';
import { DEFAULT_FILTERS, DEFAULT_WEIGHTS } from '$lib/types/city';
import { recalculateCityScores } from '$lib/utils/scoring';
import citiesData from '$lib/data/cities.json';

/**
 * Global cities store using Svelte 5 runes
 */
class CitiesStore {
	// Raw city data
	private _allCities = $state<City[]>([]);

	// Filter state
	private _filters = $state<CityFilters>({ ...DEFAULT_FILTERS });

	// Sort state
	private _sort = $state<SortConfig>({ field: 'rank', direction: 'asc' });

	// Weight state
	private _weights = $state<ScoringWeights>({ ...DEFAULT_WEIGHTS });

	// Selected cities for comparison
	private _selectedCities = $state<string[]>([]);

	// Loading state
	private _loading = $state(true);

	constructor() {
		this.loadCities();
	}

	private loadCities() {
		try {
			const data = citiesData as { cities: City[] };
			this._allCities = data.cities;
			this._loading = false;
		} catch (e) {
			console.error('Failed to load cities data:', e);
			this._loading = false;
		}
	}

	// Getters
	get allCities(): City[] {
		return this._allCities;
	}

	get filters(): CityFilters {
		return this._filters;
	}

	get sort(): SortConfig {
		return this._sort;
	}

	get sortField(): SortConfig['field'] {
		return this._sort.field;
	}

	get sortDirection(): SortConfig['direction'] {
		return this._sort.direction;
	}

	get weights(): ScoringWeights {
		return this._weights;
	}

	get selectedCities(): string[] {
		return this._selectedCities;
	}

	get loading(): boolean {
		return this._loading;
	}

	// Derived: filtered and sorted cities with custom weights
	get cities(): City[] {
		// Recalculate scores with current weights
		let result = recalculateCityScores(this._allCities, this._weights);

		// Apply filters
		result = result.filter((city) => {
			const f = this._filters;

			// Region filter
			if (f.regions.length > 0 && !f.regions.includes(city.region)) return false;

			// Country filter
			if (f.countries.length > 0 && !f.countries.includes(city.country)) return false;

			// Population filter
			if (city.population < f.minPopulation || city.population > f.maxPopulation) return false;

			// Climate filters
			if (city.climate.sunnyDays < f.minSunnyDays) return false;
			if (city.climate.humidity > f.maxHumidity) return false;

			// Geography filters
			if (f.requireBoth && !(city.geography.nearMountains && city.geography.nearOcean))
				return false;
			if (f.requireMountains && !city.geography.nearMountains) return false;
			if (f.requireOcean && !city.geography.nearOcean) return false;

			// Livability filters
			if (city.livability.walkScore < f.minWalkScore) return false;
			if (city.livability.costOfLiving > f.maxCostOfLiving) return false;

			return true;
		});

		// Apply sorting
		const { field, direction } = this._sort;
		const multiplier = direction === 'asc' ? 1 : -1;

		result.sort((a, b) => {
			let aVal: number | string;
			let bVal: number | string;

			switch (field) {
				case 'rank':
					aVal = a.rank;
					bVal = b.rank;
					break;
				case 'name':
					aVal = a.name;
					bVal = b.name;
					break;
				case 'country':
					aVal = a.country;
					bVal = b.country;
					break;
				case 'population':
					aVal = a.population;
					bVal = b.population;
					break;
				case 'sunnyDays':
					aVal = a.climate.sunnyDays;
					bVal = b.climate.sunnyDays;
					break;
				case 'humidity':
					aVal = a.climate.humidity;
					bVal = b.climate.humidity;
					break;
				case 'walkScore':
					aVal = a.livability.walkScore;
					bVal = b.livability.walkScore;
					break;
				case 'bikeScore':
					aVal = a.livability.bikeScore;
					bVal = b.livability.bikeScore;
					break;
				case 'costOfLiving':
					aVal = a.livability.costOfLiving;
					bVal = b.livability.costOfLiving;
					break;
				case 'safetyIndex':
					aVal = a.livability.safetyIndex;
					bVal = b.livability.safetyIndex;
					break;
				case 'total':
					aVal = a.scores.total;
					bVal = b.scores.total;
					break;
				default:
					return 0;
			}

			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal) * multiplier;
			}
			return ((aVal as number) - (bVal as number)) * multiplier;
		});

		return result;
	}

	// Derived: unique regions
	get regions(): string[] {
		return [...new Set(this._allCities.map((c) => c.region))].sort();
	}

	// Derived: unique countries
	get countries(): string[] {
		return [...new Set(this._allCities.map((c) => c.country))].sort();
	}

	// Derived: selected city objects
	get comparisonCities(): City[] {
		return this.cities.filter((c) => this._selectedCities.includes(c.slug));
	}

	// Actions
	setFilters(filters: Partial<CityFilters>) {
		this._filters = { ...this._filters, ...filters };
	}

	updateFilters(filters: Partial<CityFilters>) {
		this._filters = { ...this._filters, ...filters };
	}

	resetFilters() {
		this._filters = { ...DEFAULT_FILTERS };
	}

	setSort(fieldOrConfig: SortConfig['field'] | SortConfig) {
		if (typeof fieldOrConfig === 'string') {
			// Toggle sort when clicking same field
			if (this._sort.field === fieldOrConfig) {
				this._sort = {
					field: fieldOrConfig,
					direction: this._sort.direction === 'asc' ? 'desc' : 'asc'
				};
			} else {
				this._sort = { field: fieldOrConfig, direction: 'asc' };
			}
		} else {
			this._sort = fieldOrConfig;
		}
	}

	toggleSort(field: SortConfig['field']) {
		if (this._sort.field === field) {
			this._sort = {
				field,
				direction: this._sort.direction === 'asc' ? 'desc' : 'asc'
			};
		} else {
			this._sort = { field, direction: 'asc' };
		}
	}

	setWeights(weights: Partial<ScoringWeights>) {
		this._weights = { ...this._weights, ...weights };
	}

	updateWeights(weights: Partial<ScoringWeights>) {
		this._weights = { ...this._weights, ...weights };
	}

	resetWeights() {
		this._weights = { ...DEFAULT_WEIGHTS };
	}

	toggleCitySelection(slug: string) {
		if (this._selectedCities.includes(slug)) {
			this._selectedCities = this._selectedCities.filter((s) => s !== slug);
		} else if (this._selectedCities.length < 4) {
			this._selectedCities = [...this._selectedCities, slug];
		}
	}

	clearSelection() {
		this._selectedCities = [];
	}

	getCityBySlug(slug: string): City | undefined {
		return this._allCities.find((c) => c.slug === slug);
	}
}

// Singleton instance
export const citiesStore = new CitiesStore();
