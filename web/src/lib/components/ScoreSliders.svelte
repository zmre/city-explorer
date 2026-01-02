<script lang="ts">
	import type { ScoringWeights } from '$lib/types/city';
	import { DEFAULT_WEIGHTS } from '$lib/types/city';

	interface Props {
		weights: ScoringWeights;
		onWeightChange: (weights: Partial<ScoringWeights>) => void;
		onReset: () => void;
	}

	let { weights, onWeightChange, onReset }: Props = $props();

	// Calculate total for display
	let total = $derived(
		weights.climate +
			weights.geography +
			weights.accessibility +
			weights.cost +
			weights.family +
			weights.sustainability
	);

	// Check if weights are default
	let isDefault = $derived(
		weights.climate === DEFAULT_WEIGHTS.climate &&
			weights.geography === DEFAULT_WEIGHTS.geography &&
			weights.accessibility === DEFAULT_WEIGHTS.accessibility &&
			weights.cost === DEFAULT_WEIGHTS.cost &&
			weights.family === DEFAULT_WEIGHTS.family &&
			weights.sustainability === DEFAULT_WEIGHTS.sustainability
	);

	const categories = [
		{
			key: 'climate' as const,
			label: 'Climate',
			description: 'Sunny days, humidity, temperature',
			color: 'range-info',
			max: 50
		},
		{
			key: 'geography' as const,
			label: 'Geography',
			description: 'Mountains, ocean proximity',
			color: 'range-success',
			max: 30
		},
		{
			key: 'accessibility' as const,
			label: 'Accessibility',
			description: 'Walkability, airport access',
			color: 'range-warning',
			max: 30
		},
		{
			key: 'cost' as const,
			label: 'Cost of Living',
			description: 'Housing, expenses',
			color: 'range-error',
			max: 30
		},
		{
			key: 'family' as const,
			label: 'Family',
			description: 'Safety, kid-friendliness',
			color: 'range-secondary',
			max: 30
		},
		{
			key: 'sustainability' as const,
			label: 'Sustainability',
			description: 'Biking, EV infrastructure',
			color: 'range-accent',
			max: 30
		}
	];

	function handleSliderChange(key: keyof ScoringWeights, value: number) {
		onWeightChange({ [key]: value });
	}
</script>

<div class="bg-base-200 rounded-lg p-4 space-y-4">
	<div class="flex justify-between items-center">
		<div>
			<h3 class="font-bold text-lg">Scoring Weights</h3>
			<p class="text-sm opacity-60">Customize how cities are ranked</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="badge" class:badge-success={total === 100} class:badge-warning={total !== 100}>
				Total: {total.toFixed(0)}
			</span>
			{#if !isDefault}
				<button class="btn btn-ghost btn-sm" onclick={onReset}>Reset</button>
			{/if}
		</div>
	</div>

	{#if total !== 100}
		<div class="alert alert-warning text-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span>Weights will be normalized to 100 for scoring</span>
		</div>
	{/if}

	<div class="space-y-4">
		{#each categories as cat}
			<div class="form-control">
				<div class="flex justify-between items-center mb-1">
					<div>
						<span class="label-text font-semibold">{cat.label}</span>
						<span class="label-text text-xs opacity-60 ml-2">({cat.description})</span>
					</div>
					<span class="badge badge-ghost">{weights[cat.key].toFixed(0)}</span>
				</div>
				<input
					type="range"
					min="0"
					max={cat.max}
					step="1"
					value={weights[cat.key]}
					class="range range-sm {cat.color}"
					oninput={(e) => handleSliderChange(cat.key, parseFloat(e.currentTarget.value))}
				/>
				<div class="flex justify-between text-xs opacity-50 px-1">
					<span>0</span>
					<span>{cat.max}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Preset Configurations -->
	<div class="divider text-xs opacity-60">Presets</div>
	<div class="flex flex-wrap gap-2">
		<button
			class="btn btn-sm btn-outline"
			onclick={() =>
				onWeightChange({
					climate: 40,
					geography: 20,
					accessibility: 10,
					cost: 10,
					family: 10,
					sustainability: 10
				})}
		>
			Climate Focus
		</button>
		<button
			class="btn btn-sm btn-outline"
			onclick={() =>
				onWeightChange({
					climate: 20,
					geography: 5,
					accessibility: 10,
					cost: 35,
					family: 20,
					sustainability: 10
				})}
		>
			Budget Focus
		</button>
		<button
			class="btn btn-sm btn-outline"
			onclick={() =>
				onWeightChange({
					climate: 15,
					geography: 10,
					accessibility: 15,
					cost: 15,
					family: 35,
					sustainability: 10
				})}
		>
			Family Focus
		</button>
		<button
			class="btn btn-sm btn-outline"
			onclick={() =>
				onWeightChange({
					climate: 15,
					geography: 5,
					accessibility: 20,
					cost: 10,
					family: 10,
					sustainability: 40
				})}
		>
			Green Focus
		</button>
	</div>
</div>
