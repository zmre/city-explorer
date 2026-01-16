<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categoryColors = {
		recommendations: 'badge-primary',
		analysis: 'badge-secondary',
		data: 'badge-accent',
		methodology: 'badge-info'
	};

	const categoryLabels = {
		recommendations: 'Recommendations',
		analysis: 'Analysis',
		data: 'Data',
		methodology: 'Methodology'
	};
</script>

<svelte:head>
	<title>{data.article.title} - Climate Explorer Research</title>
	<meta name="description" content={data.article.description} />
</svelte:head>

<div class="max-w-5xl mx-auto">
	<!-- Breadcrumb and back link -->
	<div class="flex items-center gap-2 mb-6 text-sm">
		<a href="/" class="link link-hover opacity-70">Home</a>
		<span class="opacity-50">/</span>
		<a href="/research" class="link link-hover opacity-70">Research</a>
		<span class="opacity-50">/</span>
		<span class="opacity-50">{data.article.title}</span>
	</div>

	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center gap-3 mb-3">
			<span class="badge {categoryColors[data.article.category]}"
				>{categoryLabels[data.article.category]}</span
			>
			{#if data.article.featured}
				<span class="badge badge-outline">Featured</span>
			{/if}
		</div>
		<h1 class="text-3xl md:text-4xl font-bold mb-4">{data.article.title}</h1>
		<p class="text-lg opacity-80">{data.article.description}</p>
	</header>

	<!-- Article content -->
	<article class="research-article prose prose-lg max-w-none">
		{@html data.content}
	</article>

	<!-- Footer navigation -->
	<footer class="mt-12 pt-8 border-t border-base-300">
		<div class="flex flex-wrap gap-4">
			<a href="/research" class="btn btn-outline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				All Research
			</a>
			<a href="/" class="btn btn-primary">Explore Dashboard</a>
		</div>
	</footer>
</div>

