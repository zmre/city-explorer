<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		CityTable,
		CityCard,
		FilterPanel,
		ScoreSliders,
		StatsCards,
		ScatterPlot,
		RadarChart,
		WorldMap,
		BarChart
	} from '$lib';
	import { citiesStore } from '$lib/stores/cities.svelte';
	import { parseFiltersFromUrl, parseWeightsFromUrl, buildUrlParams } from '$lib/stores/urlState';
	import type { CityFilters, ScoringWeights } from '$lib/types/city';
	import { DEFAULT_FILTERS, DEFAULT_WEIGHTS } from '$lib/types/city';

	// View mode
	let viewMode = $state<'table' | 'cards' | 'map'>('table');

	// Active visualization
	let activeViz = $state<'scatter' | 'bar' | 'radar'>('scatter');

	// Selected cities for comparison
	let selectedSlugs = $state<string[]>([]);

	// Initialize from URL on mount
	onMount(() => {
		const urlFilters = parseFiltersFromUrl($page.url.searchParams);
		const urlWeights = parseWeightsFromUrl($page.url.searchParams);

		if (Object.keys(urlFilters).length > 0) {
			citiesStore.updateFilters(urlFilters);
		}
		if (Object.keys(urlWeights).length > 0) {
			citiesStore.updateWeights(urlWeights);
		}
	});

	// Update URL when filters/weights change
	function updateUrl() {
		const params = buildUrlParams(citiesStore.filters, citiesStore.weights);
		const url = params ? `?${params}` : '/';
		goto(url, { replaceState: true, noScroll: true });
	}

	function handleFilterChange(filters: Partial<CityFilters>) {
		citiesStore.updateFilters(filters);
		updateUrl();
	}

	function handleWeightChange(weights: Partial<ScoringWeights>) {
		citiesStore.updateWeights(weights);
		updateUrl();
	}

	function handleFilterReset() {
		citiesStore.resetFilters();
		updateUrl();
	}

	function handleWeightReset() {
		citiesStore.resetWeights();
		updateUrl();
	}

	function handleCityClick(slug: string) {
		goto(`/city/${slug}`);
	}

	function handleSelectionChange(slugs: string[]) {
		selectedSlugs = slugs;
	}

	function compareSelected() {
		if (selectedSlugs.length >= 2) {
			goto(`/compare?cities=${selectedSlugs.join(',')}`);
		}
	}

	// Get unique regions and countries for filters
	let allCities = $derived(citiesStore.allCities);
	let regions = $derived([...new Set(allCities.map((c) => c.region))].sort());
	let countries = $derived([...new Set(allCities.map((c) => c.country))].sort());

	// Get filtered/sorted cities
	let cities = $derived(citiesStore.cities);

	// Top cities for radar chart
	let topCities = $derived(cities.slice(0, 5));
</script>

<svelte:head>
	<title>Climate Explorer - City Livability Dashboard</title>
	<meta name="description" content="Explore and compare cities worldwide based on climate, geography, cost of living, and livability metrics." />
</svelte:head>

<div class="space-y-6">
	<!-- Header with stats -->
	<div>
		<h1 class="text-3xl font-bold mb-4">City Livability Explorer</h1>
		<StatsCards cities={cities} totalCities={allCities.length} />
	</div>

	<!-- Main content grid -->
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
		<!-- Sidebar: Filters and Weights -->
		<aside class="lg:col-span-1 space-y-4">
			<FilterPanel
				filters={citiesStore.filters}
				{regions}
				{countries}
				onFilterChange={handleFilterChange}
				onReset={handleFilterReset}
			/>
			<ScoreSliders
				weights={citiesStore.weights}
				onWeightChange={handleWeightChange}
				onReset={handleWeightReset}
			/>
		</aside>

		<!-- Main content area -->
		<div class="lg:col-span-3 space-y-6">
			<!-- View controls -->
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<span class="text-sm opacity-70">View:</span>
					<div class="btn-group">
						<button
							class="btn btn-sm"
							class:btn-active={viewMode === 'table'}
							onclick={() => (viewMode = 'table')}
						>
							Table
						</button>
						<button
							class="btn btn-sm"
							class:btn-active={viewMode === 'cards'}
							onclick={() => (viewMode = 'cards')}
						>
							Cards
						</button>
						<button
							class="btn btn-sm"
							class:btn-active={viewMode === 'map'}
							onclick={() => (viewMode = 'map')}
						>
							Map
						</button>
					</div>
				</div>

				{#if selectedSlugs.length >= 2}
					<button class="btn btn-primary btn-sm" onclick={compareSelected}>
						Compare {selectedSlugs.length} Cities
					</button>
				{/if}
			</div>

			<!-- City list/table/map -->
			{#if viewMode === 'table'}
				<CityTable
					{cities}
					sortField={citiesStore.sortField}
					sortDirection={citiesStore.sortDirection}
					onSort={(field) => citiesStore.setSort(field)}
					onCityClick={handleCityClick}
					selectable={true}
					selectedSlugs={selectedSlugs}
					onSelectionChange={handleSelectionChange}
				/>
			{:else if viewMode === 'cards'}
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{#each cities as city (city.slug)}
						<CityCard {city} onCityClick={handleCityClick} />
					{/each}
				</div>
			{:else if viewMode === 'map'}
				<WorldMap {cities} onCityClick={handleCityClick} />
			{/if}

			<!-- Visualizations section -->
			<div class="divider">Visualizations</div>

			<div class="space-y-4">
				<!-- Viz selector -->
				<div class="tabs tabs-boxed w-fit">
					<button
						class="tab"
						class:tab-active={activeViz === 'scatter'}
						onclick={() => (activeViz = 'scatter')}
					>
						Scatter Plot
					</button>
					<button
						class="tab"
						class:tab-active={activeViz === 'bar'}
						onclick={() => (activeViz = 'bar')}
					>
						Rankings
					</button>
					<button
						class="tab"
						class:tab-active={activeViz === 'radar'}
						onclick={() => (activeViz = 'radar')}
					>
						Top 5 Radar
					</button>
				</div>

				<!-- Visualization content -->
				<div class="bg-base-200 rounded-lg p-4">
					{#if activeViz === 'scatter'}
						<ScatterPlot {cities} onCityClick={handleCityClick} />
					{:else if activeViz === 'bar'}
						<BarChart {cities} onCityClick={handleCityClick} />
					{:else if activeViz === 'radar'}
						<RadarChart cities={topCities} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
