<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { RadarChart, CityLocationMap } from '$lib/components/charts';
	import ClickableMetric from '$lib/components/ClickableMetric.svelte';
	import { citiesStore } from '$lib/stores/cities.svelte';
	import { getRegionColor } from '$lib/utils/formatting';
	import type { City } from '$lib/types/city';

	// Get city from slug
	let slug = $derived($page.params.slug);
	let city = $derived(citiesStore.allCities.find((c) => c.slug === slug));

	// Get similar cities (same region, sorted by score)
	let similarCities = $derived(
		city
			? citiesStore.allCities
					.filter((c) => c.region === city.region && c.slug !== city.slug)
					.sort((a, b) => b.scores.total - a.scores.total)
					.slice(0, 5)
			: []
	);

	// Boulder baseline for comparison
	let boulder = $derived(citiesStore.allCities.find((c) => c.slug === 'boulder-co'));

	function goToCity(citySlug: string) {
		goto(`/city/${citySlug}`);
	}

	function compareWithBoulder() {
		if (city && boulder && city.slug !== boulder.slug) {
			goto(`/compare?cities=${boulder.slug},${city.slug}`);
		}
	}
</script>

<svelte:head>
	{#if city}
		<title>{city.name}, {city.country} - Climate Explorer</title>
		<meta name="description" content="Detailed climate and livability data for {city.name}, {city.country}. Score: {city.scores.total.toFixed(1)}/100" />
	{:else}
		<title>City Not Found - Climate Explorer</title>
	{/if}
</svelte:head>

{#if city}
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<div>
				<div class="flex items-center gap-3">
					<a href="/" class="btn btn-ghost btn-sm">Back</a>
					<h1 class="text-3xl font-bold">{city.name}</h1>
				</div>
				<div class="flex items-center gap-2 mt-2">
					<span class="badge" style="background-color: {getRegionColor(city.region)}; color: white;">
						{city.region}
					</span>
					<span class="text-lg opacity-70">{city.country}</span>
					<span class="text-sm opacity-50">Pop: {city.population.toLocaleString()}</span>
				</div>
			</div>
			<div class="text-right">
				<div class="text-4xl font-bold text-primary">{city.scores.total.toFixed(1)}</div>
				<div class="text-sm opacity-70">Overall Score</div>
				<div class="text-sm opacity-50">Rank #{city.rank} of {citiesStore.allCities.length}</div>
			</div>
		</div>

		<!-- Score breakdown -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Climate</div>
				<div class="stat-value text-xl">{city.scores.climate.toFixed(0)}</div>
			</div>
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Geography</div>
				<div class="stat-value text-xl">{city.scores.geography.toFixed(0)}</div>
			</div>
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Accessibility</div>
				<div class="stat-value text-xl">{city.scores.accessibility.toFixed(0)}</div>
			</div>
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Cost</div>
				<div class="stat-value text-xl">{city.scores.cost.toFixed(0)}</div>
			</div>
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Family</div>
				<div class="stat-value text-xl">{city.scores.family.toFixed(0)}</div>
			</div>
			<div class="stat bg-base-200 rounded-lg">
				<div class="stat-title">Sustainability</div>
				<div class="stat-value text-xl">{city.scores.sustainability.toFixed(0)}</div>
			</div>
		</div>

		<!-- Main content grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Left column: Details -->
			<div class="space-y-6">
				<!-- Climate Details -->
				<div class="bg-base-200 rounded-lg p-4">
					<h2 class="text-xl font-bold mb-4">Climate</h2>
					<div class="grid grid-cols-2 gap-4">
						<ClickableMetric metric="sunnyDays" cityName={city.name} country={city.country}>
							<div>
								<div class="text-sm opacity-70">Sunny Days</div>
								<div class="text-2xl font-bold">{city.climate.sunnyDays}</div>
								<div class="text-xs opacity-50">days per year</div>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="humidity" cityName={city.name} country={city.country}>
							<div>
								<div class="text-sm opacity-70">Humidity</div>
								<div class="text-2xl font-bold">{city.climate.humidity}%</div>
								<div class="text-xs opacity-50">average</div>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="temperature" cityName={city.name} country={city.country}>
							<div>
								<div class="text-sm opacity-70">Summer High</div>
								<div class="text-2xl font-bold">{Math.round(city.climate.summerHigh * 9/5 + 32)}°F</div>
								<div class="text-xs opacity-50">{city.climate.summerHigh}°C</div>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="temperature" cityName={city.name} country={city.country}>
							<div>
								<div class="text-sm opacity-70">Winter Low</div>
								<div class="text-2xl font-bold">{Math.round(city.climate.winterLow * 9/5 + 32)}°F</div>
								<div class="text-xs opacity-50">{city.climate.winterLow}°C</div>
							</div>
						</ClickableMetric>
					</div>
				</div>

				<!-- Geography -->
				<div class="bg-base-200 rounded-lg p-4">
					<h2 class="text-xl font-bold mb-4">Location</h2>
					<CityLocationMap {city} initialZoom={1} />
					<div class="flex gap-4 mt-4">
						<div class="flex items-center gap-2">
							{#if city.geography.nearMountains}
								<span class="badge badge-success">Mountains Nearby</span>
							{:else}
								<span class="badge badge-ghost">No Mountains</span>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							{#if city.geography.nearOcean}
								<span class="badge badge-success">Ocean Access</span>
							{:else}
								<span class="badge badge-ghost">No Ocean</span>
							{/if}
						</div>
					</div>
				</div>

				<!-- Livability -->
				<div class="bg-base-200 rounded-lg p-4">
					<h2 class="text-xl font-bold mb-4">Livability</h2>
					<div class="space-y-3">
						<ClickableMetric metric="walkScore" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>Walk Score</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-primary w-24" value={city.livability.walkScore} max="100"></progress>
								<span class="font-mono w-8">{city.livability.walkScore}</span>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="bikeScore" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>Bike Score</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-primary w-24" value={city.livability.bikeScore} max="100"></progress>
								<span class="font-mono w-8">{city.livability.bikeScore}</span>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="safetyIndex" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>Safety Index</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-primary w-24" value={city.livability.safetyIndex} max="100"></progress>
								<span class="font-mono w-8">{city.livability.safetyIndex}</span>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="kidFriendly" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>Kid Friendly</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-primary w-24" value={city.livability.kidFriendly} max="100"></progress>
								<span class="font-mono w-8">{city.livability.kidFriendly}</span>
							</div>
						</ClickableMetric>
						<ClickableMetric metric="evInfrastructure" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>EV Infrastructure</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-primary w-24" value={city.livability.evInfrastructure} max="100"></progress>
								<span class="font-mono w-8">{city.livability.evInfrastructure}</span>
							</div>
						</ClickableMetric>
						<div class="divider my-2"></div>
						<ClickableMetric metric="costOfLiving" cityName={city.name} country={city.country} class="flex justify-between items-center w-full">
							<span>Cost of Living Index</span>
							<span class="font-mono font-bold">{city.livability.costOfLiving}</span>
						</ClickableMetric>
						<div class="flex justify-between items-center">
							<span>Airport Distance</span>
							<span class="font-mono">{city.livability.airportDistance} mi</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Right column: Radar chart and similar cities -->
			<div class="space-y-6">
				<!-- Radar Chart -->
				<div class="bg-base-200 rounded-lg p-4">
					<h2 class="text-xl font-bold mb-4">Score Profile</h2>
					<RadarChart cities={[city]} maxCities={1} />
				</div>

				<!-- Compare with Boulder -->
				{#if boulder && city.slug !== boulder.slug}
					<div class="bg-base-200 rounded-lg p-4">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-xl font-bold">vs Boulder Baseline</h2>
							<button class="btn btn-sm btn-primary" onclick={compareWithBoulder}>
								Full Comparison
							</button>
						</div>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span>Boulder Score:</span>
								<span class="font-mono">{boulder.scores.total.toFixed(1)}</span>
							</div>
							<div class="flex justify-between">
								<span>{city.name} Score:</span>
								<span class="font-mono">{city.scores.total.toFixed(1)}</span>
							</div>
							<div class="flex justify-between font-bold">
								<span>Difference:</span>
								<span class="font-mono" class:text-success={city.scores.total > boulder.scores.total} class:text-error={city.scores.total < boulder.scores.total}>
									{city.scores.total > boulder.scores.total ? '+' : ''}{(city.scores.total - boulder.scores.total).toFixed(1)}
								</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- Similar cities -->
				{#if similarCities.length > 0}
					<div class="bg-base-200 rounded-lg p-4">
						<h2 class="text-xl font-bold mb-4">Similar Cities in {city.region}</h2>
						<div class="space-y-2">
							{#each similarCities as similar (similar.slug)}
								<button
									class="w-full flex items-center justify-between p-2 rounded hover:bg-base-300 transition-colors"
									onclick={() => goToCity(similar.slug)}
								>
									<div>
										<div class="font-semibold">{similar.name}</div>
										<div class="text-sm opacity-70">{similar.country}</div>
									</div>
									<div class="text-right">
										<div class="font-mono">{similar.scores.total.toFixed(1)}</div>
										<div class="text-xs opacity-50">Rank #{similar.rank}</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="hero min-h-96">
		<div class="hero-content text-center">
			<div>
				<h1 class="text-4xl font-bold">City Not Found</h1>
				<p class="py-6 opacity-70">The city "{slug}" was not found in our database.</p>
				<a href="/" class="btn btn-primary">Back to Dashboard</a>
			</div>
		</div>
	</div>
{/if}
