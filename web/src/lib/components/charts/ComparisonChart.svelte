<script lang="ts">
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		showDifference?: boolean;
	}

	let { cities, showDifference = true }: Props = $props();

	// Metrics to compare
	const metrics = [
		{ key: 'sunnyDays', label: 'Sunny Days/Year', accessor: (c: City) => c.climate.sunnyDays, max: 350 },
		{ key: 'humidity', label: 'Humidity (%)', accessor: (c: City) => c.climate.humidity, max: 100, inverse: true },
		{ key: 'walkScore', label: 'Walk Score', accessor: (c: City) => c.livability.walkScore, max: 100 },
		{ key: 'costOfLiving', label: 'Cost of Living', accessor: (c: City) => c.livability.costOfLiving, max: 200, inverse: true },
		{ key: 'safetyIndex', label: 'Safety Index', accessor: (c: City) => c.livability.safetyIndex, max: 100 },
		{ key: 'kidFriendly', label: 'Kid Friendly', accessor: (c: City) => c.livability.kidFriendly, max: 100 },
		{ key: 'bikeScore', label: 'Bike Score', accessor: (c: City) => c.livability.bikeScore, max: 100 },
		{ key: 'evInfrastructure', label: 'EV Infrastructure', accessor: (c: City) => c.livability.evInfrastructure, max: 100 }
	];

	// Score categories
	const scoreCategories = [
		{ key: 'climate', label: 'Climate' },
		{ key: 'geography', label: 'Geography' },
		{ key: 'accessibility', label: 'Accessibility' },
		{ key: 'cost', label: 'Cost' },
		{ key: 'family', label: 'Family' },
		{ key: 'sustainability', label: 'Sustainability' },
		{ key: 'total', label: 'Total Score' }
	] as const;

	// Get bar width percentage
	function getBarWidth(value: number, max: number): number {
		return Math.min((value / max) * 100, 100);
	}

	// Get difference indicator
	function getDifference(cities: City[], accessor: (c: City) => number, index: number): { value: number; better: boolean } | null {
		if (cities.length < 2 || index === 0) return null;
		const current = accessor(cities[index]);
		const reference = accessor(cities[0]);
		return {
			value: current - reference,
			better: current > reference
		};
	}

	// Format difference
	function formatDiff(diff: number): string {
		if (diff === 0) return '=';
		return diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0);
	}
</script>

<div class="space-y-6">
	<!-- City headers -->
	{#if cities.length > 0}
		<div class="grid gap-4" style="grid-template-columns: 150px repeat({cities.length}, 1fr)">
			<div></div>
			{#each cities as city (city.slug)}
				<div class="text-center">
					<div class="font-bold text-lg">{city.name}</div>
					<div class="text-sm opacity-70">{city.country}</div>
					<div class="badge badge-lg mt-1" style="background-color: {getRegionColor(city.region)}; color: white;">
						Score: {city.scores.total.toFixed(1)}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Score Categories Comparison -->
	<div class="bg-base-200 rounded-lg p-4">
		<h3 class="font-bold mb-4">Category Scores</h3>
		<div class="space-y-3">
			{#each scoreCategories as cat}
				<div class="grid gap-4 items-center" style="grid-template-columns: 150px repeat({cities.length}, 1fr)">
					<div class="text-sm font-medium">{cat.label}</div>
					{#each cities as city, index (city.slug)}
						{@const score = city.scores[cat.key]}
						{@const diff = showDifference && index > 0 ? getDifference(cities, (c) => c.scores[cat.key], index) : null}
						<div class="flex items-center gap-2">
							<div class="flex-1 bg-base-300 rounded-full h-4 overflow-hidden">
								<div
									class="h-full rounded-full transition-all"
									style="width: {getBarWidth(score, 100)}%; background-color: {getRegionColor(city.region)}"
								></div>
							</div>
							<span class="font-mono text-sm w-10">{score.toFixed(0)}</span>
							{#if diff}
								<span
									class="text-xs font-mono w-10"
									class:text-success={diff.better}
									class:text-error={!diff.better && diff.value !== 0}
									class:opacity-50={diff.value === 0}
								>
									{formatDiff(diff.value)}
								</span>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Raw Metrics Comparison -->
	<div class="bg-base-200 rounded-lg p-4">
		<h3 class="font-bold mb-4">Detailed Metrics</h3>
		<div class="space-y-3">
			{#each metrics as metric}
				<div class="grid gap-4 items-center" style="grid-template-columns: 150px repeat({cities.length}, 1fr)">
					<div class="text-sm font-medium">
						{metric.label}
						{#if metric.inverse}
							<span class="text-xs opacity-50">(lower=better)</span>
						{/if}
					</div>
					{#each cities as city, index (city.slug)}
						{@const value = metric.accessor(city)}
						{@const diff = showDifference && index > 0 ? getDifference(cities, metric.accessor, index) : null}
						{@const adjustedDiff = diff && metric.inverse ? { ...diff, better: !diff.better } : diff}
						<div class="flex items-center gap-2">
							<div class="flex-1 bg-base-300 rounded-full h-3 overflow-hidden">
								<div
									class="h-full rounded-full transition-all"
									style="width: {getBarWidth(value, metric.max)}%; background-color: {getRegionColor(city.region)}"
								></div>
							</div>
							<span class="font-mono text-sm w-12">{value.toFixed(0)}</span>
							{#if adjustedDiff}
								<span
									class="text-xs font-mono w-10"
									class:text-success={adjustedDiff.better}
									class:text-error={!adjustedDiff.better && adjustedDiff.value !== 0}
									class:opacity-50={adjustedDiff.value === 0}
								>
									{formatDiff(diff?.value ?? 0)}
								</span>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Geography Features -->
	<div class="bg-base-200 rounded-lg p-4">
		<h3 class="font-bold mb-4">Geography Features</h3>
		<div class="grid gap-4" style="grid-template-columns: 150px repeat({cities.length}, 1fr)">
			<div class="text-sm font-medium">Near Mountains</div>
			{#each cities as city (city.slug)}
				<div class="flex items-center gap-2">
					{#if city.geography.nearMountains}
						<span class="badge badge-success">Yes</span>
					{:else}
						<span class="badge badge-ghost">No</span>
					{/if}
				</div>
			{/each}

			<div class="text-sm font-medium">Near Ocean</div>
			{#each cities as city (city.slug)}
				<div class="flex items-center gap-2">
					{#if city.geography.nearOcean}
						<span class="badge badge-success">Yes</span>
					{:else}
						<span class="badge badge-ghost">No</span>
					{/if}
				</div>
			{/each}

			<div class="text-sm font-medium">Population</div>
			{#each cities as city (city.slug)}
				<div class="font-mono text-sm">
					{city.population.toLocaleString()}
				</div>
			{/each}
		</div>
	</div>

	<!-- Climate Details -->
	<div class="bg-base-200 rounded-lg p-4">
		<h3 class="font-bold mb-4">Climate Details</h3>
		<div class="grid gap-4" style="grid-template-columns: 150px repeat({cities.length}, 1fr)">
			<div class="text-sm font-medium">Summer High</div>
			{#each cities as city (city.slug)}
				<div class="font-mono text-sm">
					{city.climate.summerHigh}°F / {Math.round((city.climate.summerHigh - 32) * 5/9)}°C
				</div>
			{/each}

			<div class="text-sm font-medium">Winter Low</div>
			{#each cities as city (city.slug)}
				<div class="font-mono text-sm">
					{city.climate.winterLow}°F / {Math.round((city.climate.winterLow - 32) * 5/9)}°C
				</div>
			{/each}

			<div class="text-sm font-medium">Airport Distance</div>
			{#each cities as city (city.slug)}
				<div class="font-mono text-sm">
					{city.livability.airportDistance} mi
				</div>
			{/each}
		</div>
	</div>
</div>
