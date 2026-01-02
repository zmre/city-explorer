<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { City } from '$lib/types/city';
	import { getRegionColor } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		xField?: 'sunnyDays' | 'humidity' | 'walkScore' | 'costOfLiving';
		yField?: 'sunnyDays' | 'humidity' | 'walkScore' | 'costOfLiving' | 'total';
		onCityClick?: (slug: string) => void;
	}

	let { cities, xField = 'sunnyDays', yField = 'costOfLiving', onCityClick }: Props = $props();

	let container: HTMLDivElement;
	let width = $state(600);
	let height = $state(400);

	const margin = { top: 20, right: 30, bottom: 50, left: 60 };

	// Field accessors and labels
	const fieldConfig = {
		sunnyDays: { accessor: (c: City) => c.climate.sunnyDays, label: 'Sunny Days/Year' },
		humidity: { accessor: (c: City) => c.climate.humidity, label: 'Humidity (%)' },
		walkScore: { accessor: (c: City) => c.livability.walkScore, label: 'Walk Score' },
		costOfLiving: { accessor: (c: City) => c.livability.costOfLiving, label: 'Cost of Living Index' },
		total: { accessor: (c: City) => c.scores.total, label: 'Total Score' }
	};

	function getValue(city: City, field: keyof typeof fieldConfig): number {
		return fieldConfig[field].accessor(city);
	}

	function getLabel(field: keyof typeof fieldConfig): string {
		return fieldConfig[field].label;
	}

	// Scales
	let xScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(cities, (c) => getValue(c, xField)) ?? 100])
			.nice()
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(cities, (c) => getValue(c, yField)) ?? 100])
			.nice()
			.range([height - margin.bottom, margin.top])
	);

	let radiusScale = $derived(
		d3
			.scaleSqrt()
			.domain([0, d3.max(cities, (c) => c.population) ?? 1000000])
			.range([4, 20])
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
				height = Math.max(300, entry.contentRect.width * 0.6);
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="relative w-full" bind:this={container}>
	<svg {width} {height} class="overflow-visible">
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
			<text
				x={(width - margin.left - margin.right) / 2 + margin.left}
				y="40"
				text-anchor="middle"
				class="text-sm fill-current"
			>
				{getLabel(xField)}
			</text>
		</g>

		<!-- Y Axis -->
		<g transform="translate({margin.left}, 0)">
			{#each yScale.ticks(6) as tick}
				<g transform="translate(0, {yScale(tick)})">
					<line x2="-6" stroke="currentColor" opacity="0.3" />
					<text x="-10" text-anchor="end" dominant-baseline="middle" class="text-xs fill-current opacity-60">
						{tick}
					</text>
				</g>
			{/each}
			<text
				transform="rotate(-90)"
				x={-(height - margin.top - margin.bottom) / 2 - margin.top}
				y="-45"
				text-anchor="middle"
				class="text-sm fill-current"
			>
				{getLabel(yField)}
			</text>
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
			{#each yScale.ticks(6) as tick}
				<line
					x1={margin.left}
					x2={width - margin.right}
					y1={yScale(tick)}
					y2={yScale(tick)}
					stroke="currentColor"
				/>
			{/each}
		</g>

		<!-- Data points -->
		{#each cities as city (city.slug)}
			<circle
				cx={xScale(getValue(city, xField))}
				cy={yScale(getValue(city, yField))}
				r={radiusScale(city.population)}
				fill={getRegionColor(city.region)}
				fill-opacity="0.7"
				stroke={getRegionColor(city.region)}
				stroke-width="2"
				class="cursor-pointer transition-all hover:fill-opacity-100"
				onmouseenter={(e) => handleMouseEnter(e, city)}
				onmouseleave={handleMouseLeave}
				onclick={() => handleClick(city)}
				role="button"
				tabindex="0"
				aria-label="{city.name}: {getValue(city, xField)} {getLabel(xField)}, {getValue(city, yField)} {getLabel(yField)}"
			/>
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
				<div>{getLabel(xField)}: {getValue(tooltip.city, xField)}</div>
				<div>{getLabel(yField)}: {getValue(tooltip.city, yField)}</div>
				<div>Population: {tooltip.city.population.toLocaleString()}</div>
			</div>
		</div>
	{/if}

	<!-- Legend -->
	<div class="absolute top-2 right-2 bg-base-200/90 p-2 rounded text-xs">
		<div class="font-semibold mb-1">Regions</div>
		{#each [...new Set(cities.map((c) => c.region))] as region}
			<div class="flex items-center gap-1">
				<span
					class="w-3 h-3 rounded-full"
					style="background-color: {getRegionColor(region)}"
				></span>
				<span>{region}</span>
			</div>
		{/each}
		<div class="mt-2 opacity-60">Bubble size = Population</div>
	</div>
</div>
