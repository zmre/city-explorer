<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		field?: 'total' | 'climate' | 'geography' | 'accessibility' | 'cost' | 'family' | 'sustainability';
		maxCities?: number;
		onCityClick?: (slug: string) => void;
	}

	let { cities, field = 'total', maxCities = 15, onCityClick }: Props = $props();

	let container: HTMLDivElement;
	let width = $state(600);
	let height = $state(400);

	const margin = { top: 20, right: 60, bottom: 40, left: 120 };

	// Field labels
	const fieldLabels: Record<string, string> = {
		total: 'Total Score',
		climate: 'Climate Score',
		geography: 'Geography Score',
		accessibility: 'Accessibility Score',
		cost: 'Cost Score',
		family: 'Family Score',
		sustainability: 'Sustainability Score'
	};

	// Get displayed cities (sorted by field)
	let displayedCities = $derived(
		[...cities]
			.sort((a, b) => b.scores[field] - a.scores[field])
			.slice(0, maxCities)
	);

	// Calculate bar height
	let barHeight = $derived(
		Math.min(30, (height - margin.top - margin.bottom) / displayedCities.length - 4)
	);

	// Scales
	let xScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(displayedCities, (c) => c.scores[field]) ?? 100])
			.nice()
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		d3
			.scaleBand<string>()
			.domain(displayedCities.map((c) => c.slug))
			.range([margin.top, height - margin.bottom])
			.padding(0.15)
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

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = Math.max(300, displayedCities.length * 35 + margin.top + margin.bottom);
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="relative w-full" bind:this={container}>
	<svg {width} {height} class="overflow-visible">
		<!-- Title -->
		<text
			x={width / 2}
			y={margin.top / 2}
			text-anchor="middle"
			class="text-sm fill-current font-semibold"
		>
			{fieldLabels[field]}
		</text>

		<!-- X Axis -->
		<g transform="translate(0, {height - margin.bottom})">
			{#each xScale.ticks(6) as tick}
				<g transform="translate({xScale(tick)}, 0)">
					<line y2="6" stroke="currentColor" opacity="0.3" />
					<text y="20" text-anchor="middle" class="text-xs fill-current opacity-60">
						{tick}
					</text>
				</g>
			{/each}
		</g>

		<!-- Grid lines -->
		<g opacity="0.1">
			{#each xScale.ticks(6) as tick}
				<line
					x1={xScale(tick)}
					x2={xScale(tick)}
					y1={margin.top}
					y2={height - margin.bottom}
					stroke="currentColor"
				/>
			{/each}
		</g>

		<!-- Bars -->
		{#each displayedCities as city, index (city.slug)}
			{@const y = yScale(city.slug) ?? 0}
			{@const barWidth = xScale(city.scores[field]) - margin.left}
			<g class="bar-group">
				<!-- Background bar -->
				<rect
					x={margin.left}
					y={y}
					width={width - margin.left - margin.right}
					height={yScale.bandwidth()}
					fill="currentColor"
					opacity="0.05"
					rx="4"
				/>

				<!-- Value bar -->
				<rect
					x={margin.left}
					y={y}
					width={barWidth}
					height={yScale.bandwidth()}
					fill={getRegionColor(city.region)}
					rx="4"
					class="cursor-pointer transition-all hover:opacity-80"
					onmouseenter={(e) => handleMouseEnter(e, city)}
					onmouseleave={handleMouseLeave}
					onclick={() => handleClick(city)}
					role="button"
					tabindex="0"
					aria-label="{city.name}: {city.scores[field].toFixed(1)}"
				/>

				<!-- City name label -->
				<text
					x={margin.left - 8}
					y={y + yScale.bandwidth() / 2}
					text-anchor="end"
					dominant-baseline="middle"
					class="text-xs fill-current"
				>
					{city.name}
				</text>

				<!-- Rank number -->
				<text
					x={margin.left - 105}
					y={y + yScale.bandwidth() / 2}
					text-anchor="end"
					dominant-baseline="middle"
					class="text-xs fill-current opacity-40 font-mono"
				>
					#{index + 1}
				</text>

				<!-- Value label -->
				<text
					x={xScale(city.scores[field]) + 5}
					y={y + yScale.bandwidth() / 2}
					dominant-baseline="middle"
					class="text-xs fill-current font-semibold"
				>
					{city.scores[field].toFixed(1)}
				</text>
			</g>
		{/each}
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
				<div>{fieldLabels[field]}: <span class="font-semibold">{tooltip.city.scores[field].toFixed(1)}</span></div>
				{#if field !== 'total'}
					<div>Total Score: {tooltip.city.scores.total.toFixed(1)}</div>
				{/if}
				<div class="mt-1 text-xs opacity-70">
					Rank #{displayedCities.findIndex((c) => c.slug === tooltip?.city.slug) + 1} of {cities.length}
				</div>
			</div>
		</div>
	{/if}
</div>
