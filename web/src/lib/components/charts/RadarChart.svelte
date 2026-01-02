<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		maxCities?: number;
	}

	let { cities, maxCities = 5 }: Props = $props();

	let container: HTMLDivElement;
	let width = $state(400);
	let height = $state(400);

	const margin = 60;

	// Categories for the radar
	const categories = [
		{ key: 'climate' as const, label: 'Climate' },
		{ key: 'geography' as const, label: 'Geography' },
		{ key: 'accessibility' as const, label: 'Accessibility' },
		{ key: 'cost' as const, label: 'Cost' },
		{ key: 'family' as const, label: 'Family' },
		{ key: 'sustainability' as const, label: 'Sustainability' }
	];

	let radius = $derived(Math.min(width, height) / 2 - margin);
	let centerX = $derived(width / 2);
	let centerY = $derived(height / 2);

	// Angle for each category
	let angleSlice = $derived((Math.PI * 2) / categories.length);

	// Scale for the radius (scores are 0-100 normalized)
	let rScale = $derived(d3.scaleLinear().domain([0, 100]).range([0, radius]));

	// Get the displayed cities (limited)
	let displayedCities = $derived(cities.slice(0, maxCities));

	// Generate path data for a city
	function getPathData(city: City): string {
		const points = categories.map((cat, i) => {
			const score = city.scores[cat.key];
			const angle = angleSlice * i - Math.PI / 2;
			const x = centerX + rScale(score) * Math.cos(angle);
			const y = centerY + rScale(score) * Math.sin(angle);
			return `${x},${y}`;
		});
		return `M${points.join('L')}Z`;
	}

	// Generate axis endpoint
	function getAxisEnd(index: number): { x: number; y: number } {
		const angle = angleSlice * index - Math.PI / 2;
		return {
			x: centerX + radius * Math.cos(angle),
			y: centerY + radius * Math.sin(angle)
		};
	}

	// Generate label position (slightly beyond axis)
	function getLabelPosition(index: number): { x: number; y: number; anchor: string } {
		const angle = angleSlice * index - Math.PI / 2;
		const labelRadius = radius + 25;
		const x = centerX + labelRadius * Math.cos(angle);
		const y = centerY + labelRadius * Math.sin(angle);

		// Determine text anchor based on position
		let anchor = 'middle';
		if (Math.cos(angle) > 0.1) anchor = 'start';
		else if (Math.cos(angle) < -0.1) anchor = 'end';

		return { x, y, anchor };
	}

	// Grid levels
	const gridLevels = [20, 40, 60, 80, 100];

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

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const size = Math.min(entry.contentRect.width, 500);
				width = size;
				height = size;
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="relative w-full max-w-lg mx-auto" bind:this={container}>
	<svg {width} {height} class="overflow-visible">
		<!-- Grid circles -->
		{#each gridLevels as level}
			<circle
				cx={centerX}
				cy={centerY}
				r={rScale(level)}
				fill="none"
				stroke="currentColor"
				opacity="0.1"
			/>
		{/each}

		<!-- Grid level labels -->
		{#each gridLevels as level}
			<text
				x={centerX + 5}
				y={centerY - rScale(level)}
				class="text-xs fill-current opacity-40"
				dominant-baseline="middle"
			>
				{level}
			</text>
		{/each}

		<!-- Axis lines -->
		{#each categories as _, i}
			{@const end = getAxisEnd(i)}
			<line
				x1={centerX}
				y1={centerY}
				x2={end.x}
				y2={end.y}
				stroke="currentColor"
				opacity="0.2"
			/>
		{/each}

		<!-- Category labels -->
		{#each categories as cat, i}
			{@const pos = getLabelPosition(i)}
			<text
				x={pos.x}
				y={pos.y}
				text-anchor={pos.anchor}
				dominant-baseline="middle"
				class="text-sm fill-current font-medium"
			>
				{cat.label}
			</text>
		{/each}

		<!-- City polygons -->
		{#each displayedCities as city, index (city.slug)}
			<path
				d={getPathData(city)}
				fill={getRegionColor(city.region)}
				fill-opacity="0.15"
				stroke={getRegionColor(city.region)}
				stroke-width="2"
				class="transition-all cursor-pointer hover:fill-opacity-30"
				onmouseenter={(e) => handleMouseEnter(e, city)}
				onmouseleave={handleMouseLeave}
				role="img"
				aria-label="{city.name} radar profile"
			/>
		{/each}

		<!-- City dots at vertices for better visibility -->
		{#each displayedCities as city (city.slug)}
			{#each categories as cat, i}
				{@const score = city.scores[cat.key]}
				{@const angle = angleSlice * i - Math.PI / 2}
				{@const x = centerX + rScale(score) * Math.cos(angle)}
				{@const y = centerY + rScale(score) * Math.sin(angle)}
				<circle
					cx={x}
					cy={y}
					r="4"
					fill={getRegionColor(city.region)}
					class="pointer-events-none"
				/>
			{/each}
		{/each}
	</svg>

	<!-- Tooltip -->
	{#if tooltip}
		<div
			class="chart-tooltip"
			style="left: {tooltip.x + 10}px; top: {tooltip.y - 10}px;"
		>
			<div class="font-bold">{tooltip.city.name}</div>
			<div class="text-xs opacity-70">{tooltip.city.country}</div>
			<div class="mt-1 text-sm space-y-0.5">
				{#each categories as cat}
					<div class="flex justify-between gap-4">
						<span>{cat.label}:</span>
						<span class="font-mono">{tooltip.city.scores[cat.key].toFixed(0)}</span>
					</div>
				{/each}
				<div class="border-t border-current/20 pt-1 mt-1 font-semibold flex justify-between">
					<span>Total:</span>
					<span>{tooltip.city.scores.total.toFixed(1)}</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Legend -->
	{#if displayedCities.length > 0}
		<div class="flex flex-wrap justify-center gap-3 mt-4">
			{#each displayedCities as city (city.slug)}
				<div class="flex items-center gap-1.5 text-sm">
					<span
						class="w-3 h-3 rounded-full"
						style="background-color: {getRegionColor(city.region)}"
					></span>
					<span>{city.name}</span>
					<span class="opacity-60">({city.scores.total.toFixed(0)})</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
