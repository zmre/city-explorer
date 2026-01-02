<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		city: City;
		initialZoom?: number;
	}

	let { city, initialZoom = 2 }: Props = $props();

	let container: HTMLDivElement;
	let width = $state(400);
	let height = $state(300);
	let zoomLevel = $state(initialZoom);

	// World map data state
	let worldData = $state<GeoJSON.FeatureCollection | null>(null);
	let citiesData = $state<Array<{ name: string; lat: number; lng: number; capital: boolean }>>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Major world cities for context (capitals and major cities)
	const majorCities = [
		// Europe
		{ name: 'Madrid', lat: 40.417, lng: -3.704, capital: true },
		{ name: 'Paris', lat: 48.857, lng: 2.352, capital: true },
		{ name: 'Berlin', lat: 52.52, lng: 13.405, capital: true },
		{ name: 'Rome', lat: 41.903, lng: 12.496, capital: true },
		{ name: 'London', lat: 51.507, lng: -0.128, capital: true },
		{ name: 'Lisbon', lat: 38.722, lng: -9.139, capital: true },
		{ name: 'Athens', lat: 37.984, lng: 23.728, capital: true },
		{ name: 'Vienna', lat: 48.208, lng: 16.374, capital: true },
		{ name: 'Amsterdam', lat: 52.37, lng: 4.895, capital: true },
		{ name: 'Copenhagen', lat: 55.676, lng: 12.568, capital: true },
		{ name: 'Brussels', lat: 50.85, lng: 4.352, capital: true },
		{ name: 'Zagreb', lat: 45.815, lng: 15.982, capital: true },
		{ name: 'Ljubljana', lat: 46.056, lng: 14.506, capital: true },
		{ name: 'Barcelona', lat: 41.389, lng: 2.159, capital: false },
		{ name: 'Milan', lat: 45.465, lng: 9.186, capital: false },
		{ name: 'Munich', lat: 48.135, lng: 11.582, capital: false },
		// North America
		{ name: 'Washington', lat: 38.907, lng: -77.037, capital: true },
		{ name: 'Ottawa', lat: 45.421, lng: -75.698, capital: true },
		{ name: 'Mexico City', lat: 19.433, lng: -99.133, capital: true },
		{ name: 'Los Angeles', lat: 34.052, lng: -118.244, capital: false },
		{ name: 'New York', lat: 40.713, lng: -74.006, capital: false },
		{ name: 'San Francisco', lat: 37.775, lng: -122.419, capital: false },
		{ name: 'Chicago', lat: 41.878, lng: -87.63, capital: false },
		{ name: 'Denver', lat: 39.739, lng: -104.99, capital: false },
		{ name: 'Vancouver', lat: 49.283, lng: -123.121, capital: false },
		{ name: 'Seattle', lat: 47.607, lng: -122.332, capital: false },
		{ name: 'Phoenix', lat: 33.449, lng: -112.074, capital: false },
		// South America
		{ name: 'Santiago', lat: -33.449, lng: -70.669, capital: true },
		{ name: 'Buenos Aires', lat: -34.604, lng: -58.382, capital: true },
		{ name: 'Lima', lat: -12.046, lng: -77.043, capital: true },
		{ name: 'Bogota', lat: 4.711, lng: -74.072, capital: true },
		{ name: 'Quito', lat: -0.18, lng: -78.468, capital: true },
		{ name: 'Sao Paulo', lat: -23.55, lng: -46.633, capital: false },
		// Oceania
		{ name: 'Canberra', lat: -35.281, lng: 149.129, capital: true },
		{ name: 'Wellington', lat: -41.287, lng: 174.776, capital: true },
		{ name: 'Sydney', lat: -33.869, lng: 151.209, capital: false },
		{ name: 'Melbourne', lat: -37.814, lng: 144.963, capital: false },
		{ name: 'Brisbane', lat: -27.47, lng: 153.021, capital: false },
		{ name: 'Auckland', lat: -36.849, lng: 174.764, capital: false },
		{ name: 'Perth', lat: -31.953, lng: 115.857, capital: false },
		// Central America
		{ name: 'San Jose', lat: 9.935, lng: -84.088, capital: true },
		{ name: 'Panama City', lat: 8.983, lng: -79.52, capital: true }
	];

	// Projection centered on the city with zoom
	let projection = $derived(
		d3
			.geoMercator()
			.center([city.coordinates.lng, city.coordinates.lat])
			.scale(width * zoomLevel * 15)
			.translate([width / 2, height / 2])
	);

	let pathGenerator = $derived(d3.geoPath().projection(projection));

	// Project city coordinates as derived value
	let cityPosition = $derived.by(() => {
		const projected = projection([city.coordinates.lng, city.coordinates.lat]);
		if (!projected) return null;
		return { x: projected[0], y: projected[1] };
	});

	// Project major cities that are visible in current view
	let visibleCities = $derived.by(() => {
		return majorCities
			.filter((c) => c.name !== city.name) // Don't show if it's the current city
			.map((c) => {
				const projected = projection([c.lng, c.lat]);
				if (!projected) return null;
				// Check if within visible bounds
				if (projected[0] < 0 || projected[0] > width || projected[1] < 0 || projected[1] > height) {
					return null;
				}
				return { ...c, x: projected[0], y: projected[1] };
			})
			.filter((c) => c !== null);
	});

	function zoomIn() {
		if (zoomLevel < 1) {
			zoomLevel = Math.min(zoomLevel * 2, 1);
		} else {
			zoomLevel = Math.min(zoomLevel + 1, 12);
		}
	}

	function zoomOut() {
		if (zoomLevel <= 1) {
			zoomLevel = Math.max(zoomLevel / 2, 0.1);
		} else {
			zoomLevel = Math.max(zoomLevel - 1, 1);
		}
	}

	// Load world map data
	onMount(async () => {
		try {
			const response = await fetch(
				'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
			);
			if (!response.ok) throw new Error('Failed to load map data');

			const topology = await response.json();
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
				height = Math.max(200, entry.contentRect.width * 0.75);
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="relative w-full" bind:this={container}>
	{#if loading}
		<div class="flex items-center justify-center h-48">
			<span class="loading loading-spinner loading-md"></span>
			<span class="ml-2 text-sm">Loading map...</span>
		</div>
	{:else if error}
		<div class="alert alert-warning text-sm">
			<span>Map unavailable</span>
		</div>
	{:else}
		<svg {width} {height} class="overflow-hidden bg-base-300/30 rounded-lg">
			<!-- Ocean background -->
			<rect {width} {height} fill="oklch(0.25 0.02 240)" rx="8" />

			<!-- Countries -->
			{#if worldData}
				<g class="countries">
					{#each worldData.features as feature}
						<path
							d={pathGenerator(feature) ?? ''}
							fill="oklch(0.35 0.02 220)"
							stroke="oklch(0.50 0.02 220)"
							stroke-width="0.5"
						/>
					{/each}
				</g>
			{/if}

			<!-- Other major cities (context) -->
			{#each visibleCities as otherCity}
				{#if otherCity}
					<!-- Capital star or city dot -->
					{#if otherCity.capital}
						<polygon
							points="{otherCity.x},{otherCity.y - 5} {otherCity.x + 1.5},{otherCity.y - 1.5} {otherCity.x + 5},{otherCity.y - 1} {otherCity.x + 2},{otherCity.y + 1.5} {otherCity.x + 3},{otherCity.y + 5} {otherCity.x},{otherCity.y + 3} {otherCity.x - 3},{otherCity.y + 5} {otherCity.x - 2},{otherCity.y + 1.5} {otherCity.x - 5},{otherCity.y - 1} {otherCity.x - 1.5},{otherCity.y - 1.5}"
							fill="oklch(0.7 0.1 50)"
							fill-opacity="0.8"
						/>
					{:else}
						<circle cx={otherCity.x} cy={otherCity.y} r="3" fill="oklch(0.6 0.05 220)" fill-opacity="0.7" />
					{/if}
					<!-- City label -->
					<text
						x={otherCity.x}
						y={otherCity.y - 8}
						text-anchor="middle"
						class="text-[9px] fill-base-content/50"
					>
						{otherCity.name}
					</text>
				{/if}
			{/each}

			<!-- City marker (main city - on top) -->
			{#if cityPosition}
				<!-- Outer glow -->
				<circle
					cx={cityPosition.x}
					cy={cityPosition.y}
					r="20"
					fill={getRegionColor(city.region)}
					fill-opacity="0.2"
				/>
				<!-- Pulse animation ring - uses stroke-opacity animation instead of transform -->
				<circle
					cx={cityPosition.x}
					cy={cityPosition.y}
					r="15"
					fill="none"
					stroke={getRegionColor(city.region)}
					stroke-width="2"
					class="city-pulse"
				/>
				<!-- Middle ring -->
				<circle
					cx={cityPosition.x}
					cy={cityPosition.y}
					r="12"
					fill="none"
					stroke={getRegionColor(city.region)}
					stroke-width="2"
					stroke-opacity="0.6"
				/>
				<!-- Center dot -->
				<circle
					cx={cityPosition.x}
					cy={cityPosition.y}
					r="6"
					fill={getRegionColor(city.region)}
					stroke="white"
					stroke-width="2"
				/>
				<!-- City label -->
				<text
					x={cityPosition.x}
					y={cityPosition.y - 28}
					text-anchor="middle"
					class="text-sm font-bold fill-current"
					style="text-shadow: 0 0 4px oklch(0.2 0 0), 0 0 8px oklch(0.2 0 0);"
				>
					{city.name}
				</text>
			{/if}
		</svg>

		<!-- Zoom controls -->
		<div class="absolute top-2 left-2 flex flex-col gap-1">
			<button
				class="btn btn-xs btn-square bg-base-200/90 hover:bg-base-300"
				onclick={zoomIn}
				disabled={zoomLevel >= 12}
				aria-label="Zoom in"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
				</svg>
			</button>
			<button
				class="btn btn-xs btn-square bg-base-200/90 hover:bg-base-300"
				onclick={zoomOut}
				disabled={zoomLevel <= 0.1}
				aria-label="Zoom out"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
				</svg>
			</button>
		</div>

		<!-- Zoom level indicator -->
		<div class="absolute top-2 right-2 bg-base-200/90 px-2 py-1 rounded text-xs">
			{zoomLevel >= 1 ? zoomLevel : zoomLevel.toFixed(1)}x
		</div>

		<!-- Country name -->
		<div class="absolute bottom-8 left-2 bg-base-200/90 px-2 py-1 rounded text-xs font-medium">
			{city.country}
		</div>

		<!-- Coordinates display -->
		<div class="absolute bottom-2 right-2 bg-base-200/90 px-2 py-1 rounded text-xs font-mono">
			{city.coordinates.lat.toFixed(2)}°{city.coordinates.lat >= 0 ? 'N' : 'S'},
			{Math.abs(city.coordinates.lng).toFixed(2)}°{city.coordinates.lng >= 0 ? 'E' : 'W'}
		</div>

		<!-- Legend -->
		<div class="absolute bottom-2 left-2 bg-base-200/90 px-2 py-1 rounded text-[10px] flex items-center gap-3">
			<span class="flex items-center gap-1">
				<svg class="w-3 h-3" viewBox="0 0 10 10">
					<polygon points="5,0 6.5,3.5 10,4 7.5,6 8,10 5,8 2,10 2.5,6 0,4 3.5,3.5" fill="oklch(0.7 0.1 50)" />
				</svg>
				Capital
			</span>
			<span class="flex items-center gap-1">
				<svg class="w-3 h-3" viewBox="0 0 10 10">
					<circle cx="5" cy="5" r="3" fill="oklch(0.6 0.05 220)" />
				</svg>
				City
			</span>
		</div>
	{/if}
</div>

<style>
	@keyframes city-pulse {
		0%, 100% {
			stroke-opacity: 0.6;
		}
		50% {
			stroke-opacity: 0.2;
		}
	}

	.city-pulse {
		animation: city-pulse 2s ease-in-out infinite;
	}
</style>
