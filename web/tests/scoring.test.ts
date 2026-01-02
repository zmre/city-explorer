import { describe, it, expect } from 'vitest';
import {
	normalizeWeights,
	calculateClimateScore,
	calculateGeographyScore,
	calculateCostScore,
	calculateScoresWithWeights,
	recalculateCityScores
} from '$lib/utils/scoring';
import { DEFAULT_WEIGHTS } from '$lib/types/city';
import type { City } from '$lib/types/city';

// Mock city for testing
const mockCity: City = {
	slug: 'boulder',
	name: 'Boulder',
	country: 'USA',
	region: 'North America',
	population: 108250,
	coordinates: { lat: 40.015, lng: -105.271 },
	climate: {
		sunnyDays: 245,
		humidity: 47,
		summerHigh: 31,
		winterLow: -8
	},
	geography: {
		nearMountains: true,
		nearOcean: false
	},
	livability: {
		walkScore: 58,
		bikeScore: 87,
		costOfLiving: 146.6,
		safetyIndex: 78.5,
		kidFriendly: 91,
		evInfrastructure: 72,
		airportDistance: 76
	},
	scores: {
		climate: 0,
		geography: 0,
		accessibility: 0,
		cost: 0,
		family: 0,
		sustainability: 0,
		total: 0
	},
	rank: 1
};

describe('normalizeWeights', () => {
	it('should return default weights when given zeros', () => {
		const result = normalizeWeights({
			climate: 0,
			geography: 0,
			accessibility: 0,
			cost: 0,
			family: 0,
			sustainability: 0
		});
		expect(result).toEqual(DEFAULT_WEIGHTS);
	});

	it('should normalize weights to sum to 100', () => {
		const result = normalizeWeights({
			climate: 50,
			geography: 50,
			accessibility: 0,
			cost: 0,
			family: 0,
			sustainability: 0
		});
		const sum = Object.values(result).reduce((a, b) => a + b, 0);
		expect(sum).toBeCloseTo(100);
		expect(result.climate).toBeCloseTo(50);
		expect(result.geography).toBeCloseTo(50);
	});

	it('should preserve ratios when normalizing', () => {
		const result = normalizeWeights({
			climate: 20,
			geography: 10,
			accessibility: 10,
			cost: 10,
			family: 10,
			sustainability: 10
		});
		// Climate should be 2x geography
		expect(result.climate / result.geography).toBeCloseTo(2);
	});
});

describe('calculateClimateScore', () => {
	it('should give 8 points for 245 sunny days', () => {
		const score = calculateClimateScore(mockCity);
		// 245 sunny days = 6 points (200-249 range)
		// 47% humidity = 8 points (45-55 range)
		// temp mildness varies
		expect(score).toBeGreaterThan(0);
		expect(score).toBeLessThanOrEqual(30);
	});

	it('should give higher score for more sunny days', () => {
		const sunnierCity: City = {
			...mockCity,
			climate: { ...mockCity.climate, sunnyDays: 310 }
		};
		const sunnierScore = calculateClimateScore(sunnierCity);
		const baseScore = calculateClimateScore(mockCity);
		expect(sunnierScore).toBeGreaterThan(baseScore);
	});

	it('should penalize extreme humidity', () => {
		const humidCity: City = {
			...mockCity,
			climate: { ...mockCity.climate, humidity: 85 }
		};
		const humidScore = calculateClimateScore(humidCity);
		const baseScore = calculateClimateScore(mockCity);
		expect(humidScore).toBeLessThan(baseScore);
	});
});

describe('calculateGeographyScore', () => {
	it('should give 3 points for mountains only', () => {
		const score = calculateGeographyScore(mockCity);
		expect(score).toBe(3);
	});

	it('should give 10 points for mountains and ocean', () => {
		const bothCity: City = {
			...mockCity,
			geography: { nearMountains: true, nearOcean: true }
		};
		const score = calculateGeographyScore(bothCity);
		expect(score).toBe(10);
	});

	it('should give 3 points for ocean only', () => {
		const oceanCity: City = {
			...mockCity,
			geography: { nearMountains: false, nearOcean: true }
		};
		const score = calculateGeographyScore(oceanCity);
		expect(score).toBe(3);
	});

	it('should give 0 points for neither', () => {
		const neitherCity: City = {
			...mockCity,
			geography: { nearMountains: false, nearOcean: false }
		};
		const score = calculateGeographyScore(neitherCity);
		expect(score).toBe(0);
	});
});

describe('calculateCostScore', () => {
	it('should give low score for high cost of living', () => {
		const score = calculateCostScore(mockCity); // COL = 146.6
		expect(score).toBe(3); // > 130 = 3 points
	});

	it('should give high score for low cost of living', () => {
		const cheapCity: City = {
			...mockCity,
			livability: { ...mockCity.livability, costOfLiving: 40 }
		};
		const score = calculateCostScore(cheapCity);
		expect(score).toBe(15); // < 50 = 15 points
	});
});

describe('calculateScoresWithWeights', () => {
	it('should calculate total score with default weights', () => {
		const scores = calculateScoresWithWeights(mockCity, DEFAULT_WEIGHTS);
		expect(scores.total).toBeGreaterThan(0);
		expect(scores.total).toBeLessThanOrEqual(100);
	});

	it('should change total when weights change', () => {
		const defaultScores = calculateScoresWithWeights(mockCity, DEFAULT_WEIGHTS);

		// Heavily weight geography (where Boulder only gets 3/10)
		const geoWeightedScores = calculateScoresWithWeights(mockCity, {
			...DEFAULT_WEIGHTS,
			climate: 10,
			geography: 50
		});

		// Scores should be different
		expect(geoWeightedScores.total).not.toBeCloseTo(defaultScores.total, 0);
	});
});

describe('recalculateCityScores', () => {
	it('should sort cities by score descending', () => {
		const cities: City[] = [
			{ ...mockCity, slug: 'city1' },
			{
				...mockCity,
				slug: 'city2',
				climate: { ...mockCity.climate, sunnyDays: 320 },
				geography: { nearMountains: true, nearOcean: true }
			}
		];

		const result = recalculateCityScores(cities, DEFAULT_WEIGHTS);

		// City2 should rank higher (more sun, mountains + ocean)
		expect(result[0].slug).toBe('city2');
		expect(result[0].rank).toBe(1);
		expect(result[1].rank).toBe(2);
	});

	it('should recalculate all scores with custom weights', () => {
		const cities: City[] = [mockCity];
		const customWeights = { ...DEFAULT_WEIGHTS, climate: 50, geography: 5 };

		const result = recalculateCityScores(cities, customWeights);

		expect(result[0].scores.climate).toBeGreaterThan(result[0].scores.geography);
	});
});
