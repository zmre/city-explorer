<script lang="ts">
	import type { City, SortConfig, SortField } from '$lib/types/city';
	import { formatPopulation, formatRank, getGeographyLabel, getGeographyBadgeClass } from '$lib/utils/formatting';

	interface Props {
		cities: City[];
		sortField: SortField;
		sortDirection: 'asc' | 'desc';
		onSort: (field: SortField) => void;
		onCityClick?: (slug: string) => void;
		selectable?: boolean;
		selectedSlugs?: string[];
		onSelectionChange?: (slugs: string[]) => void;
	}

	let {
		cities,
		sortField,
		sortDirection,
		onSort,
		onCityClick,
		selectable = false,
		selectedSlugs = [],
		onSelectionChange
	}: Props = $props();

	function getSortIndicator(field: SortField): string {
		if (sortField !== field) return '';
		return sortDirection === 'asc' ? ' ↑' : ' ↓';
	}

	function handleRowClick(city: City) {
		if (onCityClick) {
			onCityClick(city.slug);
		}
	}

	function handleSelect(e: Event, slug: string) {
		e.stopPropagation();
		if (onSelectionChange) {
			if (selectedSlugs.includes(slug)) {
				onSelectionChange(selectedSlugs.filter(s => s !== slug));
			} else {
				onSelectionChange([...selectedSlugs, slug]);
			}
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="table table-zebra table-pin-rows">
		<thead>
			<tr class="bg-base-200">
				{#if selectable}
					<th class="w-12">
						<span class="sr-only">Select</span>
					</th>
				{/if}
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('rank')}>
					Rank{getSortIndicator('rank')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('name')}>
					City{getSortIndicator('name')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('country')}>
					Country{getSortIndicator('country')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('population')}>
					Population{getSortIndicator('population')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('sunnyDays')}>
					Sunny Days{getSortIndicator('sunnyDays')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('humidity')}>
					Humidity{getSortIndicator('humidity')}
				</th>
				<th>Geography</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('walkScore')}>
					Walk{getSortIndicator('walkScore')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('costOfLiving')}>
					Cost{getSortIndicator('costOfLiving')}
				</th>
				<th class="cursor-pointer hover:bg-base-300" onclick={() => onSort('total')}>
					Score{getSortIndicator('total')}
				</th>
			</tr>
		</thead>
		<tbody>
			{#each cities as city (city.slug)}
				<tr
					class="hover cursor-pointer transition-colors"
					class:bg-primary={selectedSlugs.includes(city.slug)}
					class:bg-opacity-20={selectedSlugs.includes(city.slug)}
					onclick={() => handleRowClick(city)}
				>
					{#if selectable}
						<td>
							<input
								type="checkbox"
								class="checkbox checkbox-primary checkbox-sm"
								checked={selectedSlugs.includes(city.slug)}
								onchange={(e) => handleSelect(e, city.slug)}
							/>
						</td>
					{/if}
					<td class="font-bold text-primary">{formatRank(city.rank)}</td>
					<td>
						<div class="font-semibold">{city.name}</div>
						<div class="text-xs opacity-60">{city.region}</div>
					</td>
					<td>{city.country}</td>
					<td class="text-right">{formatPopulation(city.population)}</td>
					<td class="text-right">
						<span class="font-mono">{city.climate.sunnyDays}</span>
					</td>
					<td class="text-right">
						<span class="font-mono">{city.climate.humidity}%</span>
					</td>
					<td>
						<span class="badge badge-sm {getGeographyBadgeClass(city)}">
							{getGeographyLabel(city)}
						</span>
					</td>
					<td class="text-right">
						<span class="font-mono">{city.livability.walkScore}</span>
					</td>
					<td class="text-right">
						<span class="font-mono">{city.livability.costOfLiving.toFixed(1)}</span>
					</td>
					<td class="text-right">
						<span class="badge badge-lg badge-primary font-bold">
							{city.scores.total.toFixed(1)}
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if cities.length === 0}
	<div class="text-center py-12 text-base-content/60">
		<p class="text-lg">No cities match your filters</p>
		<p class="text-sm">Try adjusting your filter criteria</p>
	</div>
{/if}
