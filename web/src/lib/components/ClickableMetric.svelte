<script lang="ts">
	import { getMetricSource } from '$lib/utils/sources';

	interface Props {
		metric: 'sunnyDays' | 'humidity' | 'temperature' | 'walkScore' | 'bikeScore' | 'costOfLiving' | 'safetyIndex' | 'kidFriendly' | 'evInfrastructure';
		cityName: string;
		country: string;
		coordinates?: { lat: number; lng: number };
		class?: string;
	}

	let { metric, cityName, country, coordinates, class: className = '' }: Props = $props();

	let source = $derived(getMetricSource(metric, cityName, country, coordinates));
</script>

<a
	href={source.url}
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group {className}"
	title="View source: {source.name}"
>
	<slot />
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
		/>
	</svg>
</a>
