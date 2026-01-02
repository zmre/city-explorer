<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { RadarChart, ComparisonChart } from '$lib/components/charts';
	import { citiesStore } from '$lib/stores/cities.svelte';
	import { getRegionColor } from '$lib/utils/formatting';
	import type { City } from '$lib/types/city';

	// Get cities from URL params
	let citySlugs = $derived(
		$page.url.searchParams.get('cities')?.split(',').filter(Boolean) ?? []
	);

	// Resolve cities from slugs
	let selectedCities = $derived(
		citySlugs
			.map((slug) => citiesStore.allCities.find((c) => c.slug === slug))
			.filter((c): c is City => c !== undefined)
	);

	// Available cities for selection (excluding already selected)
	let availableCities = $derived(
		citiesStore.allCities.filter((c) => !citySlugs.includes(c.slug))
	);

	// Add a city to comparison
	function addCity(slug: string) {
		if (selectedCities.length < 4) {
			const newSlugs = [...citySlugs, slug];
			goto(`/compare?cities=${newSlugs.join(',')}`, { replaceState: true });
		}
	}

	// Remove a city from comparison
	function removeCity(slug: string) {
		const newSlugs = citySlugs.filter((s) => s !== slug);
		if (newSlugs.length > 0) {
			goto(`/compare?cities=${newSlugs.join(',')}`, { replaceState: true });
		} else {
			goto('/compare', { replaceState: true });
		}
	}

	// Clear all cities
	function clearAll() {
		goto('/compare', { replaceState: true });
	}

	// Search filter for city selector
	let searchQuery = $state('');
	let filteredCities = $derived(
		searchQuery
			? availableCities.filter(
					(c) =>
						c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						c.country.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: availableCities.slice(0, 20)
	);
</script>

<svelte:head>
	<title>Compare Cities - Climate Explorer</title>
	<meta name="description" content="Compare cities side-by-side on climate, livability, cost of living, and more." />
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold">Compare Cities</h1>
			<p class="opacity-70">Select up to 4 cities to compare side-by-side</p>
		</div>
		{#if selectedCities.length > 0}
			<button class="btn btn-ghost btn-sm" onclick={clearAll}>Clear All</button>
		{/if}
	</div>

	<!-- City selector -->
	<div class="bg-base-200 rounded-lg p-4">
		<div class="flex flex-wrap gap-2 items-center">
			<!-- Selected cities -->
			{#each selectedCities as city (city.slug)}
				<div
					class="badge badge-lg gap-2 py-3"
					style="background-color: {getRegionColor(city.region)}; color: white;"
				>
					{city.name}
					<button
						class="btn btn-ghost btn-xs"
						onclick={() => removeCity(city.slug)}
						aria-label="Remove {city.name}"
					>
						x
					</button>
				</div>
			{/each}

			<!-- Add city dropdown -->
			{#if selectedCities.length < 4}
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-sm btn-outline">
						+ Add City
					</div>
					<div
						tabindex="0"
						class="dropdown-content z-[1] bg-base-300 rounded-lg shadow-xl w-72 max-h-96 overflow-auto p-2"
					>
						<input
							type="text"
							placeholder="Search cities..."
							class="input input-sm input-bordered w-full mb-2"
							bind:value={searchQuery}
						/>
						<div class="space-y-1">
							{#each filteredCities as city (city.slug)}
								<button
									class="w-full flex items-center justify-between p-2 rounded hover:bg-base-200 transition-colors text-left"
									onclick={() => { addCity(city.slug); searchQuery = ''; }}
								>
									<div>
										<div class="font-semibold">{city.name}</div>
										<div class="text-xs opacity-70">{city.country} · {city.region}</div>
									</div>
									<div class="text-sm font-mono opacity-60">{city.scores.total.toFixed(1)}</div>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if selectedCities.length === 0}
		<!-- Empty state -->
		<div class="hero min-h-64 bg-base-200 rounded-lg">
			<div class="hero-content text-center">
				<div>
					<h2 class="text-2xl font-bold">No Cities Selected</h2>
					<p class="py-4 opacity-70">
						Click "Add City" above to select cities for comparison.
					</p>
					<div class="flex flex-wrap justify-center gap-2 mt-4">
						<span class="text-sm opacity-50">Quick picks:</span>
						<button class="btn btn-sm btn-primary" onclick={() => addCity('boulder-co')}>
							Boulder, CO
						</button>
						<button class="btn btn-sm btn-secondary" onclick={() => addCity('lisbon')}>
							Lisbon
						</button>
						<button class="btn btn-sm btn-accent" onclick={() => addCity('barcelona')}>
							Barcelona
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else if selectedCities.length === 1}
		<!-- Single city - show details -->
		<div class="alert alert-info">
			<span>Add at least one more city to compare. Currently showing {selectedCities[0].name}.</span>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<RadarChart cities={selectedCities} />
			<div class="bg-base-200 rounded-lg p-4">
				<h2 class="text-xl font-bold mb-4">{selectedCities[0].name}</h2>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span>Total Score:</span>
						<span class="font-bold">{selectedCities[0].scores.total.toFixed(1)}</span>
					</div>
					<div class="flex justify-between">
						<span>Rank:</span>
						<span>#{selectedCities[0].rank}</span>
					</div>
					<div class="flex justify-between">
						<span>Region:</span>
						<span>{selectedCities[0].region}</span>
					</div>
					<div class="flex justify-between">
						<span>Country:</span>
						<span>{selectedCities[0].country}</span>
					</div>
				</div>
				<a href="/city/{selectedCities[0].slug}" class="btn btn-primary btn-sm mt-4">
					View Full Details
				</a>
			</div>
		</div>
	{:else}
		<!-- Multiple cities - show comparison -->
		<div class="space-y-6">
			<!-- Radar chart comparison -->
			<div class="bg-base-200 rounded-lg p-4">
				<h2 class="text-xl font-bold mb-4">Score Profiles</h2>
				<RadarChart cities={selectedCities} maxCities={4} />
			</div>

			<!-- Detailed comparison -->
			<ComparisonChart cities={selectedCities} showDifference={true} />

			<!-- Quick links -->
			<div class="flex flex-wrap gap-2">
				{#each selectedCities as city (city.slug)}
					<a href="/city/{city.slug}" class="btn btn-sm btn-outline">
						{city.name} Details
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
