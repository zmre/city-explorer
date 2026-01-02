<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		colorBy?: 'region' | 'score';
		onCityClick?: (slug: string) => void;
	}

	let { cities, colorBy = 'region', onCityClick }: Props = $props();

	let container: HTMLDivElement;
	let width = $state(800);
	let height = $state(450);

	// World map data state
	let worldData = $state<GeoJSON.FeatureCollection | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Projection and path generator
	let projection = $derived(
		d3
			.geoNaturalEarth1()
			.scale(width / 5.5)
			.translate([width / 2, height / 2])
	);

	let pathGenerator = $derived(d3.geoPath().projection(projection));

	// Color scale for scores
	let scoreColorScale = $derived(
		d3
			.scaleSequential(d3.interpolateViridis)
			.domain([d3.min(cities, (c) => c.scores.total) ?? 0, d3.max(cities, (c) => c.scores.total) ?? 100])
	);

	// Get city color based on mode
	function getCityColor(city: City): string {
		if (colorBy === 'score') {
			return scoreColorScale(city.scores.total);
		}
		return getRegionColor(city.region);
	}

	// Radius scale based on population
	let radiusScale = $derived(
		d3
			.scaleSqrt()
			.domain([0, d3.max(cities, (c) => c.population) ?? 1000000])
			.range([4, 15])
	);

	// Tooltip state
	let tooltip = $state<{ city: City; x: number; y: number } | null>(null);

	function handleMouseEnter(event: MouseEvent, city: City) {
		const rect = container.getBoundingClientRect();
		tooltip = {
			city,
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	function handleMouseLeave() {
		tooltip = null;
	}

	function handleClick(city: City) {
		if (onCityClick) {
			onCityClick(city.slug);
		}
	}

	// Project city coordinates
	function projectCity(city: City): { x: number; y: number } | null {
		const projected = projection([city.coordinates.lng, city.coordinates.lat]);
		if (!projected) return null;
		return { x: projected[0], y: projected[1] };
	}

	// Load world map data
	onMount(async () => {
		try {
			// Use a lightweight world topology
			const response = await fetch(
				'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
			);
			if (!response.ok) throw new Error('Failed to load map data');

			const topology = await response.json();

			// Convert TopoJSON to GeoJSON
			const { feature } = await import('topojson-client');
			worldData = feature(topology, topology.objects.countries) as GeoJSON.FeatureCollection;
			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load map';
			loading = false;
		}
	});

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = Math.max(300, entry.contentRect.width * 0.55);
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="relative w-full" bind:this={container}>
	{#if loading}
		<div class="flex items-center justify-center h-64">
			<span class="loading loading-spinner loading-lg"></span>
			<span class="ml-2">Loading map...</span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{:else}
		<svg {width} {height} class="overflow-visible bg-base-300/30 rounded-lg">
			<!-- Ocean background -->
			<rect {width} {height} fill="oklch(0.25 0.02 240)" rx="8" />

			<!-- Countries -->
			{#if worldData}
				<g class="countries">
					{#each worldData.features as feature}
						<path
							d={pathGenerator(feature) ?? ''}
							fill="oklch(0.35 0.02 220)"
							stroke="oklch(0.45 0.02 220)"
							stroke-width="0.5"
						/>
					{/each}
				</g>
			{/if}

			<!-- City markers -->
			<g class="cities">
				{#each cities as city (city.slug)}
					{@const pos = projectCity(city)}
					{#if pos}
						<circle
							cx={pos.x}
							cy={pos.y}
							r={radiusScale(city.population)}
							fill={getCityColor(city)}
							fill-opacity="0.8"
							stroke="white"
							stroke-width="1"
							class="cursor-pointer transition-all hover:fill-opacity-100 hover:stroke-2"
							onmouseenter={(e) => handleMouseEnter(e, city)}
							onmouseleave={handleMouseLeave}
							onclick={() => handleClick(city)}
							role="button"
							tabindex="0"
							aria-label="{city.name}: Score {city.scores.total.toFixed(1)}"
						/>
					{/if}
				{/each}
			</g>

			<!-- City labels for top cities -->
			<g class="labels">
				{#each cities.slice(0, 10) as city (city.slug)}
					{@const pos = projectCity(city)}
					{#if pos}
						<text
							x={pos.x}
							y={pos.y - radiusScale(city.population) - 4}
							text-anchor="middle"
							class="text-xs fill-current opacity-70 pointer-events-none"
							style="text-shadow: 0 0 3px oklch(0.2 0 0), 0 0 5px oklch(0.2 0 0);"
						>
							{city.name}
						</text>
					{/if}
				{/each}
			</g>
		</svg>

		<!-- Tooltip -->
		{#if tooltip}
			<div
				class="chart-tooltip"
				style="left: {tooltip.x + 10}px; top: {tooltip.y - 10}px;"
			>
				<div class="font-bold">{tooltip.city.name}</div>
				<div class="text-xs opacity-70">{tooltip.city.country} · {tooltip.city.region}</div>
				<div class="mt-1 text-sm">
					<div>Score: <span class="font-semibold">{tooltip.city.scores.total.toFixed(1)}</span></div>
					<div>Population: {tooltip.city.population.toLocaleString()}</div>
					<div>Sunny Days: {tooltip.city.climate.sunnyDays}/year</div>
				</div>
			</div>
		{/if}

		<!-- Legend -->
		<div class="absolute bottom-2 left-2 bg-base-200/90 p-2 rounded text-xs">
			<div class="font-semibold mb-1">
				{colorBy === 'score' ? 'Score' : 'Region'}
			</div>
			{#if colorBy === 'score'}
				<div class="flex items-center gap-1">
					<div
						class="w-20 h-3 rounded"
						style="background: linear-gradient(to right, {scoreColorScale.range().join(', ')})"
					></div>
				</div>
				<div class="flex justify-between mt-0.5">
					<span>{(d3.min(cities, (c) => c.scores.total) ?? 0).toFixed(0)}</span>
					<span>{(d3.max(cities, (c) => c.scores.total) ?? 100).toFixed(0)}</span>
				</div>
			{:else}
				{#each [...new Set(cities.map((c) => c.region))] as region}
					<div class="flex items-center gap-1">
						<span
							class="w-3 h-3 rounded-full"
							style="background-color: {getRegionColor(region)}"
						></span>
						<span>{region}</span>
					</div>
				{/each}
			{/if}
			<div class="mt-2 opacity-60">Bubble size = Population</div>
		</div>
	{/if}
</div>
