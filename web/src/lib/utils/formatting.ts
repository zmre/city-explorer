import type { City } from '$lib/types/city';

/**
 * Format population with commas
 */
export function formatPopulation(population: number): string {
	return population.toLocaleString();
}

/**
 * Format temperature with unit
 */
export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
	if (unit === 'F') {
		const fahrenheit = (celsius * 9) / 5 + 32;
		return `${Math.round(fahrenheit)}°F`;
	}
	return `${celsius}°C`;
}

/**
 * Format humidity percentage
 */
export function formatHumidity(humidity: number): string {
	return `${Math.round(humidity)}%`;
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
	return `${Math.round(km)} km`;
}

/**
 * Format cost of living index
 */
export function formatCostOfLiving(index: number): string {
	return index.toFixed(1);
}

/**
 * Format sunny days
 */
export function formatSunnyDays(days: number): string {
	return `${days} days`;
}

/**
 * Get geography label
 */
export function getGeographyLabel(city: City): string {
	const { nearMountains, nearOcean } = city.geography;
	if (nearMountains && nearOcean) return 'Mountains & Ocean';
	if (nearMountains) return 'Mountains';
	if (nearOcean) return 'Ocean';
	return 'Neither';
}

/**
 * Get geography badge class
 */
export function getGeographyBadgeClass(city: City): string {
	const { nearMountains, nearOcean } = city.geography;
	if (nearMountains && nearOcean) return 'badge-primary';
	if (nearMountains) return 'badge-success';
	if (nearOcean) return 'badge-info';
	return 'badge-ghost';
}

/**
 * Get region color for charts
 */
export function getRegionColor(region: string): string {
	const colors: Record<string, string> = {
		'North America': 'oklch(0.7 0.15 220)',
		Europe: 'oklch(0.7 0.15 150)',
		Oceania: 'oklch(0.7 0.15 50)',
		'South America': 'oklch(0.7 0.15 100)',
		'Central America': 'oklch(0.7 0.15 25)'
	};
	return colors[region] ?? 'oklch(0.7 0.1 0)';
}

/**
 * Get score badge class based on value
 */
export function getScoreBadgeClass(score: number, max: number = 100): string {
	const percentage = (score / max) * 100;
	if (percentage >= 80) return 'badge-success';
	if (percentage >= 60) return 'badge-info';
	if (percentage >= 40) return 'badge-warning';
	return 'badge-error';
}

/**
 * Format rank with ordinal suffix
 */
export function formatRank(rank: number): string {
	const suffix = ['th', 'st', 'nd', 'rd'];
	const v = rank % 100;
	return `#${rank}${suffix[(v - 20) % 10] || suffix[v] || suffix[0]}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get comparison arrow based on difference
 */
export function getComparisonArrow(diff: number): string {
	if (diff > 0) return '↑';
	if (diff < 0) return '↓';
	return '–';
}

/**
 * Format difference with sign
 */
export function formatDifference(diff: number, decimals: number = 1): string {
	const sign = diff > 0 ? '+' : '';
	return `${sign}${diff.toFixed(decimals)}`;
}
