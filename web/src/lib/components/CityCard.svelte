<script lang="ts">
	import type { City } from '$lib/types/city';
	import {
		formatPopulation,
		formatRank,
		getGeographyLabel,
		getGeographyBadgeClass
	} from '$lib/utils/formatting';

	interface Props {
		city: City;
		selected?: boolean;
		onSelect?: (slug: string) => void;
		onNavigate?: (slug: string) => void;
	}

	let { city, selected = false, onSelect, onNavigate }: Props = $props();

	function handleClick() {
		if (onNavigate) {
			onNavigate(city.slug);
		}
	}

	function handleSelect(e: Event) {
		e.stopPropagation();
		if (onSelect) {
			onSelect(city.slug);
		}
	}
</script>

<div
	class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
	class:ring-2={selected}
	class:ring-primary={selected}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="card-body p-4">
		<!-- Header -->
		<div class="flex justify-between items-start">
			<div>
				<h3 class="card-title text-lg">{city.name}</h3>
				<p class="text-sm opacity-70">{city.country} · {city.region}</p>
			</div>
			<div class="flex items-center gap-2">
				{#if onSelect}
					<input
						type="checkbox"
						class="checkbox checkbox-primary checkbox-sm"
						checked={selected}
						onchange={handleSelect}
					/>
				{/if}
				<div class="badge badge-primary badge-lg font-bold">
					{formatRank(city.rank)}
				</div>
			</div>
		</div>

		<!-- Score -->
		<div class="mt-2">
			<div class="flex justify-between items-center mb-1">
				<span class="text-sm opacity-70">Overall Score</span>
				<span class="text-2xl font-bold text-primary">{city.scores.total.toFixed(1)}</span>
			</div>
			<progress
				class="progress progress-primary w-full"
				value={city.scores.total}
				max="100"
			></progress>
		</div>

		<!-- Quick Stats -->
		<div class="grid grid-cols-2 gap-2 mt-3 text-sm">
			<div class="stat-item">
				<span class="opacity-60">Sunny Days</span>
				<span class="font-semibold">{city.climate.sunnyDays}/year</span>
			</div>
			<div class="stat-item">
				<span class="opacity-60">Humidity</span>
				<span class="font-semibold">{city.climate.humidity}%</span>
			</div>
			<div class="stat-item">
				<span class="opacity-60">Walk Score</span>
				<span class="font-semibold">{city.livability.walkScore}</span>
			</div>
			<div class="stat-item">
				<span class="opacity-60">Cost Index</span>
				<span class="font-semibold">{city.livability.costOfLiving.toFixed(1)}</span>
			</div>
		</div>

		<!-- Geography Badge -->
		<div class="mt-3">
			<span class="badge {getGeographyBadgeClass(city)}">
				{getGeographyLabel(city)}
			</span>
			<span class="badge badge-ghost ml-1">
				Pop: {formatPopulation(city.population)}
			</span>
		</div>

		<!-- Category Scores Mini Bar -->
		<div class="mt-3 space-y-1">
			<div class="flex gap-1 h-2">
				<div
					class="bg-info rounded"
					style="width: {(city.scores.climate / 30) * 100}%"
					title="Climate: {city.scores.climate.toFixed(1)}"
				></div>
				<div
					class="bg-success rounded"
					style="width: {(city.scores.geography / 10) * 100}%"
					title="Geography: {city.scores.geography.toFixed(1)}"
				></div>
				<div
					class="bg-warning rounded"
					style="width: {(city.scores.accessibility / 15) * 100}%"
					title="Accessibility: {city.scores.accessibility.toFixed(1)}"
				></div>
				<div
					class="bg-error rounded"
					style="width: {(city.scores.cost / 15) * 100}%"
					title="Cost: {city.scores.cost.toFixed(1)}"
				></div>
				<div
					class="bg-secondary rounded"
					style="width: {(city.scores.family / 15) * 100}%"
					title="Family: {city.scores.family.toFixed(1)}"
				></div>
				<div
					class="bg-accent rounded"
					style="width: {(city.scores.sustainability / 15) * 100}%"
					title="Sustainability: {city.scores.sustainability.toFixed(1)}"
				></div>
			</div>
			<div class="flex text-xs opacity-50 gap-2">
				<span class="flex items-center gap-1">
					<span class="w-2 h-2 bg-info rounded"></span> Climate
				</span>
				<span class="flex items-center gap-1">
					<span class="w-2 h-2 bg-success rounded"></span> Geo
				</span>
				<span class="flex items-center gap-1">
					<span class="w-2 h-2 bg-warning rounded"></span> Access
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	.stat-item {
		display: flex;
		flex-direction: column;
	}
</style>
