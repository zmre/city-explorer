<script lang="ts">
	import type { CityFilters } from '$lib/types/city';

	interface Props {
		filters: CityFilters;
		regions: string[];
		countries: string[];
		onFilterChange: (filters: Partial<CityFilters>) => void;
		onReset: () => void;
	}

	let { filters, regions, countries, onFilterChange, onReset }: Props = $props();

	// Local state for range inputs
	let minSunnyDays = $state(filters.minSunnyDays);
	let maxHumidity = $state(filters.maxHumidity);
	let minWalkScore = $state(filters.minWalkScore);
	let maxCostOfLiving = $state(filters.maxCostOfLiving);

	// Sync local state with props
	$effect(() => {
		minSunnyDays = filters.minSunnyDays;
		maxHumidity = filters.maxHumidity;
		minWalkScore = filters.minWalkScore;
		maxCostOfLiving = filters.maxCostOfLiving;
	});

	function handleRegionChange(region: string, checked: boolean) {
		const newRegions = checked
			? [...filters.regions, region]
			: filters.regions.filter((r) => r !== region);
		onFilterChange({ regions: newRegions });
	}

	function handleCountryChange(country: string, checked: boolean) {
		const newCountries = checked
			? [...filters.countries, country]
			: filters.countries.filter((c) => c !== country);
		onFilterChange({ countries: newCountries });
	}

	function applyRangeFilters() {
		onFilterChange({
			minSunnyDays,
			maxHumidity,
			minWalkScore,
			maxCostOfLiving
		});
	}
</script>

<div class="bg-base-200 rounded-lg p-4 space-y-4">
	<div class="flex justify-between items-center">
		<h3 class="font-bold text-lg">Filters</h3>
		<button class="btn btn-ghost btn-sm" onclick={onReset}>Reset All</button>
	</div>

	<!-- Geography Requirements -->
	<div class="form-control">
		<label class="label">
			<span class="label-text font-semibold">Geography</span>
		</label>
		<div class="flex flex-wrap gap-2">
			<label class="label cursor-pointer gap-2">
				<input
					type="checkbox"
					class="checkbox checkbox-primary checkbox-sm"
					checked={filters.requireMountains}
					onchange={(e) => onFilterChange({ requireMountains: e.currentTarget.checked })}
				/>
				<span class="label-text">Mountains</span>
			</label>
			<label class="label cursor-pointer gap-2">
				<input
					type="checkbox"
					class="checkbox checkbox-primary checkbox-sm"
					checked={filters.requireOcean}
					onchange={(e) => onFilterChange({ requireOcean: e.currentTarget.checked })}
				/>
				<span class="label-text">Ocean</span>
			</label>
			<label class="label cursor-pointer gap-2">
				<input
					type="checkbox"
					class="checkbox checkbox-primary checkbox-sm"
					checked={filters.requireBoth}
					onchange={(e) => onFilterChange({ requireBoth: e.currentTarget.checked })}
				/>
				<span class="label-text">Both (Mountains + Ocean)</span>
			</label>
		</div>
	</div>

	<!-- Regions -->
	<div class="form-control">
		<label class="label">
			<span class="label-text font-semibold">Regions</span>
		</label>
		<div class="flex flex-wrap gap-2">
			{#each regions as region}
				<label class="label cursor-pointer gap-2">
					<input
						type="checkbox"
						class="checkbox checkbox-primary checkbox-sm"
						checked={filters.regions.includes(region)}
						onchange={(e) => handleRegionChange(region, e.currentTarget.checked)}
					/>
					<span class="label-text">{region}</span>
				</label>
			{/each}
		</div>
	</div>

	<!-- Climate Range Filters -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="form-control">
			<label class="label">
				<span class="label-text">Min Sunny Days: {minSunnyDays}</span>
			</label>
			<input
				type="range"
				min="0"
				max="350"
				step="10"
				bind:value={minSunnyDays}
				class="range range-primary range-sm"
				onchange={applyRangeFilters}
			/>
			<div class="flex justify-between text-xs opacity-50 px-1">
				<span>0</span>
				<span>350</span>
			</div>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text">Max Humidity: {maxHumidity}%</span>
			</label>
			<input
				type="range"
				min="30"
				max="100"
				step="5"
				bind:value={maxHumidity}
				class="range range-primary range-sm"
				onchange={applyRangeFilters}
			/>
			<div class="flex justify-between text-xs opacity-50 px-1">
				<span>30%</span>
				<span>100%</span>
			</div>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text">Min Walk Score: {minWalkScore}</span>
			</label>
			<input
				type="range"
				min="0"
				max="100"
				step="5"
				bind:value={minWalkScore}
				class="range range-primary range-sm"
				onchange={applyRangeFilters}
			/>
			<div class="flex justify-between text-xs opacity-50 px-1">
				<span>0</span>
				<span>100</span>
			</div>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text">Max Cost of Living: {maxCostOfLiving}</span>
			</label>
			<input
				type="range"
				min="30"
				max="200"
				step="5"
				bind:value={maxCostOfLiving}
				class="range range-primary range-sm"
				onchange={applyRangeFilters}
			/>
			<div class="flex justify-between text-xs opacity-50 px-1">
				<span>30</span>
				<span>200</span>
			</div>
		</div>
	</div>

	<!-- Countries (collapsed by default) -->
	<details class="collapse collapse-arrow bg-base-300 rounded-lg">
		<summary class="collapse-title font-semibold">Filter by Country</summary>
		<div class="collapse-content">
			<div class="flex flex-wrap gap-2 pt-2">
				{#each countries as country}
					<label class="label cursor-pointer gap-2">
						<input
							type="checkbox"
							class="checkbox checkbox-primary checkbox-xs"
							checked={filters.countries.includes(country)}
							onchange={(e) => handleCountryChange(country, e.currentTarget.checked)}
						/>
						<span class="label-text text-sm">{country}</span>
					</label>
				{/each}
			</div>
		</div>
	</details>
</div>
