/**
 * Converts city_data.csv to cities.json for the web app
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CsvRow {
	city_name: string;
	country: string;
	region: string;
	population: string;
	latitude: string;
	longitude: string;
	sunny_days_year: string;
	avg_humidity_percent: string;
	avg_temp_summer_high_c: string;
	avg_temp_winter_low_c: string;
	near_mountains: string;
	near_ocean: string;
	walk_score: string;
	bike_score: string;
	cost_of_living_index: string;
	safety_index: string;
	kid_friendly_score: string;
	ev_infrastructure_score: string;
	airport_distance_km: string;
	total_score: string;
	rank: string;
}

interface City {
	slug: string;
	name: string;
	country: string;
	region: string;
	population: number;
	coordinates: { lat: number; lng: number };
	climate: {
		sunnyDays: number;
		humidity: number;
		summerHigh: number;
		winterLow: number;
	};
	geography: {
		nearMountains: boolean;
		nearOcean: boolean;
	};
	livability: {
		walkScore: number;
		bikeScore: number;
		costOfLiving: number;
		safetyIndex: number;
		kidFriendly: number;
		evInfrastructure: number;
		airportDistance: number;
	};
	scores: {
		climate: number;
		geography: number;
		accessibility: number;
		cost: number;
		family: number;
		sustainability: number;
		total: number;
	};
	rank: number;
}

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function parseBoolean(value: string): boolean {
	return value.toUpperCase() === 'TRUE';
}

function parseNumber(value: string): number {
	const num = parseFloat(value);
	return isNaN(num) ? 0 : num;
}

function calculateCategoryScores(row: CsvRow): City['scores'] {
	// Climate score (0-30 points based on methodology)
	let climateScore = 0;

	// Sunny days (0-10)
	const sunnyDays = parseNumber(row.sunny_days_year);
	if (sunnyDays >= 300) climateScore += 10;
	else if (sunnyDays >= 250) climateScore += 8;
	else if (sunnyDays >= 200) climateScore += 6;
	else if (sunnyDays >= 150) climateScore += 4;
	else climateScore += 2;

	// Humidity comfort (0-10)
	const humidity = parseNumber(row.avg_humidity_percent);
	if (humidity < 45) climateScore += 10;
	else if (humidity < 55) climateScore += 8;
	else if (humidity < 65) climateScore += 6;
	else if (humidity < 75) climateScore += 4;
	else climateScore += 2;

	// Temperature mildness (0-10) - based on summer high and winter low
	const summerHigh = parseNumber(row.avg_temp_summer_high_c);
	const winterLow = parseNumber(row.avg_temp_winter_low_c);
	let tempScore = 10;
	if (summerHigh > 35) tempScore -= 3;
	else if (summerHigh > 32) tempScore -= 1;
	if (winterLow < -5) tempScore -= 3;
	else if (winterLow < 0) tempScore -= 1;
	climateScore += Math.max(0, tempScore);

	// Geography score (0-10)
	const nearMountains = parseBoolean(row.near_mountains);
	const nearOcean = parseBoolean(row.near_ocean);
	let geographyScore = 0;
	if (nearMountains && nearOcean) geographyScore = 10;
	else if (nearMountains) geographyScore = 3;
	else if (nearOcean) geographyScore = 3;

	// Accessibility score (0-15)
	const walkScore = parseNumber(row.walk_score);
	const airportDist = parseNumber(row.airport_distance_km);
	let accessibilityScore = 0;
	accessibilityScore += (walkScore / 100) * 10;
	if (airportDist < 20) accessibilityScore += 5;
	else if (airportDist < 50) accessibilityScore += 3;
	else if (airportDist < 100) accessibilityScore += 1;

	// Cost score (0-15) - lower cost = higher score
	const costOfLiving = parseNumber(row.cost_of_living_index);
	let costScore = 0;
	if (costOfLiving < 50) costScore = 15;
	else if (costOfLiving < 70) costScore = 12;
	else if (costOfLiving < 100) costScore = 9;
	else if (costOfLiving < 130) costScore = 6;
	else costScore = 3;

	// Family score (0-15)
	const safetyIndex = parseNumber(row.safety_index);
	const kidFriendly = parseNumber(row.kid_friendly_score);
	const familyScore = ((safetyIndex / 100) * 7.5 + (kidFriendly / 100) * 7.5);

	// Sustainability score (0-15)
	const bikeScore = parseNumber(row.bike_score);
	const evInfra = parseNumber(row.ev_infrastructure_score);
	const sustainabilityScore = ((bikeScore / 100) * 7.5 + (evInfra / 100) * 7.5);

	const total = climateScore + geographyScore + accessibilityScore + costScore + familyScore + sustainabilityScore;

	return {
		climate: Math.round(climateScore * 10) / 10,
		geography: Math.round(geographyScore * 10) / 10,
		accessibility: Math.round(accessibilityScore * 10) / 10,
		cost: Math.round(costScore * 10) / 10,
		family: Math.round(familyScore * 10) / 10,
		sustainability: Math.round(sustainabilityScore * 10) / 10,
		total: Math.round(total * 10) / 10
	};
}

function parseCsv(content: string): CsvRow[] {
	const lines = content.trim().split('\n');
	const headers = lines[0].split(',');

	return lines.slice(1).filter(line => line.trim()).map(line => {
		const values = line.split(',');
		const row: Record<string, string> = {};
		headers.forEach((header, i) => {
			row[header.trim()] = values[i]?.trim() ?? '';
		});
		return row as unknown as CsvRow;
	});
}

function convertRowToCity(row: CsvRow): City {
	const scores = calculateCategoryScores(row);

	return {
		slug: slugify(row.city_name),
		name: row.city_name,
		country: row.country,
		region: determineRegion(row.country),
		population: parseNumber(row.population),
		coordinates: {
			lat: parseNumber(row.latitude),
			lng: parseNumber(row.longitude)
		},
		climate: {
			sunnyDays: parseNumber(row.sunny_days_year),
			humidity: parseNumber(row.avg_humidity_percent),
			summerHigh: parseNumber(row.avg_temp_summer_high_c),
			winterLow: parseNumber(row.avg_temp_winter_low_c)
		},
		geography: {
			nearMountains: parseBoolean(row.near_mountains),
			nearOcean: parseBoolean(row.near_ocean)
		},
		livability: {
			walkScore: parseNumber(row.walk_score),
			bikeScore: parseNumber(row.bike_score),
			costOfLiving: parseNumber(row.cost_of_living_index),
			safetyIndex: parseNumber(row.safety_index),
			kidFriendly: parseNumber(row.kid_friendly_score),
			evInfrastructure: parseNumber(row.ev_infrastructure_score),
			airportDistance: parseNumber(row.airport_distance_km)
		},
		scores,
		rank: parseNumber(row.rank)
	};
}

function determineRegion(country: string): string {
	const regionMap: Record<string, string> = {
		'USA': 'North America',
		'Canada': 'North America',
		'Spain': 'Europe',
		'France': 'Europe',
		'Germany': 'Europe',
		'Austria': 'Europe',
		'Netherlands': 'Europe',
		'Belgium': 'Europe',
		'Denmark': 'Europe',
		'Italy': 'Europe',
		'Portugal': 'Europe',
		'Greece': 'Europe',
		'Croatia': 'Europe',
		'Slovenia': 'Europe',
		'Australia': 'Oceania',
		'New Zealand': 'Oceania',
		'Chile': 'South America',
		'Argentina': 'South America',
		'Colombia': 'South America',
		'Ecuador': 'South America',
		'Peru': 'South America',
		'Costa Rica': 'Central America'
	};
	return regionMap[country] ?? 'Other';
}

function main() {
	const csvPath = join(__dirname, '../../city_data.csv');
	const outputPath = join(__dirname, '../static/data/cities.json');
	const libOutputPath = join(__dirname, '../src/lib/data/cities.json');

	console.log('Reading CSV from:', csvPath);
	const csvContent = readFileSync(csvPath, 'utf-8');

	console.log('Parsing CSV...');
	const rows = parseCsv(csvContent);
	console.log(`Found ${rows.length} cities`);

	console.log('Converting to City objects...');
	const cities = rows.map(convertRowToCity);

	// Sort by total score descending and assign ranks
	cities.sort((a, b) => b.scores.total - a.scores.total);
	cities.forEach((city, index) => {
		city.rank = index + 1;
	});

	const output = {
		generated: new Date().toISOString(),
		count: cities.length,
		cities
	};

	console.log('Writing JSON to:', outputPath);
	writeFileSync(outputPath, JSON.stringify(output, null, 2));

	console.log('Writing JSON to:', libOutputPath);
	writeFileSync(libOutputPath, JSON.stringify(output, null, 2));

	console.log('Done! Converted', cities.length, 'cities');
}

main();
