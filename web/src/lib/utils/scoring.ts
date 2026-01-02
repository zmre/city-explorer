import type { City, ScoringWeights, CategoryScores } from '$lib/types/city';
import { DEFAULT_WEIGHTS } from '$lib/types/city';

/**
 * Normalize weights to sum to 100
 */
export function normalizeWeights(weights: ScoringWeights): ScoringWeights {
	const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
	if (total === 0) return DEFAULT_WEIGHTS;

	const factor = 100 / total;
	return {
		climate: weights.climate * factor,
		geography: weights.geography * factor,
		accessibility: weights.accessibility * factor,
		cost: weights.cost * factor,
		family: weights.family * factor,
		sustainability: weights.sustainability * factor
	};
}

/**
 * Calculate climate score (0-30 base, scaled by weight)
 */
export function calculateClimateScore(city: City): number {
	let score = 0;

	// Sunny days (0-10)
	const sunnyDays = city.climate.sunnyDays;
	if (sunnyDays >= 300) score += 10;
	else if (sunnyDays >= 250) score += 8;
	else if (sunnyDays >= 200) score += 6;
	else if (sunnyDays >= 150) score += 4;
	else score += 2;

	// Humidity comfort (0-10)
	const humidity = city.climate.humidity;
	if (humidity < 45) score += 10;
	else if (humidity < 55) score += 8;
	else if (humidity < 65) score += 6;
	else if (humidity < 75) score += 4;
	else score += 2;

	// Temperature mildness (0-10)
	let tempScore = 10;
	if (city.climate.summerHigh > 35) tempScore -= 3;
	else if (city.climate.summerHigh > 32) tempScore -= 1;
	if (city.climate.winterLow < -5) tempScore -= 3;
	else if (city.climate.winterLow < 0) tempScore -= 1;
	score += Math.max(0, tempScore);

	return score;
}

/**
 * Calculate geography score (0-10 base)
 */
export function calculateGeographyScore(city: City): number {
	const { nearMountains, nearOcean } = city.geography;
	if (nearMountains && nearOcean) return 10;
	if (nearMountains || nearOcean) return 3;
	return 0;
}

/**
 * Calculate accessibility score (0-15 base)
 */
export function calculateAccessibilityScore(city: City): number {
	let score = 0;
	score += (city.livability.walkScore / 100) * 10;

	const airportDist = city.livability.airportDistance;
	if (airportDist < 20) score += 5;
	else if (airportDist < 50) score += 3;
	else if (airportDist < 100) score += 1;

	return score;
}

/**
 * Calculate cost score (0-15 base) - lower cost = higher score
 */
export function calculateCostScore(city: City): number {
	const costOfLiving = city.livability.costOfLiving;
	if (costOfLiving < 50) return 15;
	if (costOfLiving < 70) return 12;
	if (costOfLiving < 100) return 9;
	if (costOfLiving < 130) return 6;
	return 3;
}

/**
 * Calculate family score (0-15 base)
 */
export function calculateFamilyScore(city: City): number {
	const safetyScore = (city.livability.safetyIndex / 100) * 7.5;
	const kidScore = (city.livability.kidFriendly / 100) * 7.5;
	return safetyScore + kidScore;
}

/**
 * Calculate sustainability score (0-15 base)
 */
export function calculateSustainabilityScore(city: City): number {
	const bikeScore = (city.livability.bikeScore / 100) * 7.5;
	const evScore = (city.livability.evInfrastructure / 100) * 7.5;
	return bikeScore + evScore;
}

/**
 * Calculate all category scores with custom weights
 */
export function calculateScoresWithWeights(
	city: City,
	weights: ScoringWeights = DEFAULT_WEIGHTS
): CategoryScores {
	const normalized = normalizeWeights(weights);

	// Calculate raw scores (normalized to 0-1 range)
	const rawClimate = calculateClimateScore(city) / 30;
	const rawGeography = calculateGeographyScore(city) / 10;
	const rawAccessibility = calculateAccessibilityScore(city) / 15;
	const rawCost = calculateCostScore(city) / 15;
	const rawFamily = calculateFamilyScore(city) / 15;
	const rawSustainability = calculateSustainabilityScore(city) / 15;

	// Apply weights
	const climate = rawClimate * normalized.climate;
	const geography = rawGeography * normalized.geography;
	const accessibility = rawAccessibility * normalized.accessibility;
	const cost = rawCost * normalized.cost;
	const family = rawFamily * normalized.family;
	const sustainability = rawSustainability * normalized.sustainability;

	const total = climate + geography + accessibility + cost + family + sustainability;

	return {
		climate: Math.round(climate * 10) / 10,
		geography: Math.round(geography * 10) / 10,
		accessibility: Math.round(accessibility * 10) / 10,
		cost: Math.round(cost * 10) / 10,
		family: Math.round(family * 10) / 10,
		sustainability: Math.round(sustainability * 10) / 10,
		total: Math.round(total * 10) / 10
	};
}

/**
 * Recalculate scores and ranks for all cities with custom weights
 */
export function recalculateCityScores(
	cities: City[],
	weights: ScoringWeights = DEFAULT_WEIGHTS
): City[] {
	// Calculate new scores
	const updatedCities = cities.map((city) => ({
		...city,
		scores: calculateScoresWithWeights(city, weights)
	}));

	// Sort by total score descending
	updatedCities.sort((a, b) => b.scores.total - a.scores.total);

	// Assign new ranks
	return updatedCities.map((city, index) => ({
		...city,
		rank: index + 1
	}));
}

/**
 * Get score color class based on value (0-100 scale)
 */
export function getScoreColorClass(score: number, max: number = 100): string {
	const percentage = (score / max) * 100;
	if (percentage >= 80) return 'text-success';
	if (percentage >= 60) return 'text-info';
	if (percentage >= 40) return 'text-warning';
	return 'text-error';
}

/**
 * Format score for display
 */
export function formatScore(score: number, decimals: number = 1): string {
	return score.toFixed(decimals);
}
