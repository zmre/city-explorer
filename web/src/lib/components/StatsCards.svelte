<script lang="ts">
	import type { City } from '$lib/types/city';

	interface Props {
		cities: City[];
		totalCities: number;
	}

	let { cities, totalCities }: Props = $props();

	// Derived stats
	let topCity = $derived(cities[0]);
	let avgSunnyDays = $derived(
		cities.length > 0
			? Math.round(cities.reduce((sum, c) => sum + c.climate.sunnyDays, 0) / cities.length)
			: 0
	);
	let citiesWithBoth = $derived(
		cities.filter((c) => c.geography.nearMountains && c.geography.nearOcean).length
	);
	let avgScore = $derived(
		cities.length > 0
			? (cities.reduce((sum, c) => sum + c.scores.total, 0) / cities.length).toFixed(1)
			: '0'
	);

	// Regional leaders
	let regionLeaders = $derived(() => {
		const regions = [...new Set(cities.map((c) => c.region))];
		return regions.map((region) => {
			const regionCities = cities.filter((c) => c.region === region);
			return {
				region,
				leader: regionCities[0],
				count: regionCities.length
			};
		});
	});
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
	<!-- Showing X of Y cities -->
	<div class="stat bg-base-200 rounded-lg">
		<div class="stat-title">Showing</div>
		<div class="stat-value text-2xl">{cities.length}</div>
		<div class="stat-desc">of {totalCities} cities</div>
	</div>

	<!-- Top Ranked -->
	{#if topCity}
		<div class="stat bg-base-200 rounded-lg">
			<div class="stat-title">Top Ranked</div>
			<div class="stat-value text-xl text-primary">{topCity.name}</div>
			<div class="stat-desc">Score: {topCity.scores.total.toFixed(1)}</div>
		</div>
	{/if}

	<!-- Avg Sunny Days -->
	<div class="stat bg-base-200 rounded-lg">
		<div class="stat-title">Avg Sunny Days</div>
		<div class="stat-value text-2xl">{avgSunnyDays}</div>
		<div class="stat-desc">days per year</div>
	</div>

	<!-- Mountains + Ocean -->
	<div class="stat bg-base-200 rounded-lg">
		<div class="stat-title">Mountains + Ocean</div>
		<div class="stat-value text-2xl">{citiesWithBoth}</div>
		<div class="stat-desc">cities with both</div>
	</div>
</div>

<!-- Regional Leaders (collapsible) -->
{#if cities.length > 0}
	<details class="collapse collapse-arrow bg-base-200 rounded-lg mt-4">
		<summary class="collapse-title font-semibold">Regional Leaders</summary>
		<div class="collapse-content">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
				{#each regionLeaders() as { region, leader, count }}
					{#if leader}
						<div class="flex justify-between items-center p-2 bg-base-300 rounded">
							<div>
								<div class="font-semibold">{region}</div>
								<div class="text-sm opacity-70">{count} cities</div>
							</div>
							<div class="text-right">
								<div class="font-semibold text-primary">{leader.name}</div>
								<div class="text-sm opacity-70">{leader.scores.total.toFixed(1)} pts</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</details>
{/if}
