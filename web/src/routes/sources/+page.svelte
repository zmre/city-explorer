<script lang="ts">
	interface DataSource {
		name: string;
		url: string;
		description: string;
		category: 'climate' | 'livability' | 'cost' | 'reference';
	}

	const sources: DataSource[] = [
		{
			name: 'Climate-Data.org',
			url: 'https://climate-data.org',
			description: 'Historical climate data, temperature averages, and precipitation data for cities worldwide.',
			category: 'climate'
		},
		{
			name: 'WeatherSpark',
			url: 'https://weatherspark.com',
			description: 'Detailed weather reports with sunshine hours, cloud cover, and seasonal variations.',
			category: 'climate'
		},
		{
			name: 'Current Results',
			url: 'https://www.currentresults.com',
			description: 'Annual sunshine data including sunny days per year for various locations.',
			category: 'climate'
		},
		{
			name: 'Numbeo',
			url: 'https://numbeo.com',
			description: 'Cost of living index, safety index, and quality of life metrics.',
			category: 'cost'
		},
		{
			name: 'WalkScore',
			url: 'https://walkscore.com',
			description: 'Walk Score, Bike Score, and Transit Score for cities and neighborhoods.',
			category: 'livability'
		},
		{
			name: 'Wikipedia',
			url: 'https://wikipedia.org',
			description: 'Population data, geographic information, and general city facts.',
			category: 'reference'
		},
		{
			name: 'Environment Canada',
			url: 'https://climate.weather.gc.ca',
			description: 'Official Canadian climate data and weather statistics.',
			category: 'climate'
		},
		{
			name: 'NOAA Climate Data',
			url: 'https://ncdc.noaa.gov',
			description: 'US climate normals and historical weather data.',
			category: 'climate'
		},
		{
			name: 'OECD Regional Well-Being',
			url: 'https://oecdregionalwellbeing.org',
			description: 'Regional quality of life indicators across OECD countries.',
			category: 'livability'
		},
		{
			name: 'Alternative Fuels Data Center',
			url: 'https://afdc.energy.gov',
			description: 'EV charging station data and alternative fuel infrastructure.',
			category: 'livability'
		}
	];

	const categoryLabels = {
		climate: 'Climate Data',
		livability: 'Livability Metrics',
		cost: 'Cost of Living',
		reference: 'General Reference'
	};

	const categoryColors = {
		climate: 'badge-info',
		livability: 'badge-success',
		cost: 'badge-warning',
		reference: 'badge-ghost'
	};

	function getSourcesByCategory(category: string) {
		return sources.filter((s) => s.category === category);
	}
</script>

<svelte:head>
	<title>Data Sources - Climate Explorer</title>
	<meta name="description" content="Data sources and references used for the Climate Explorer city livability rankings." />
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8">
	<div class="prose prose-lg">
		<h1>Data Sources</h1>
		<p>
			The Climate Explorer uses data from multiple reputable sources to compile comprehensive city profiles. Below are the primary sources used for climate, livability, and cost of living data.
		</p>
	</div>

	<!-- Source categories -->
	{#each Object.entries(categoryLabels) as [category, label]}
		{@const categorySources = getSourcesByCategory(category)}
		{#if categorySources.length > 0}
			<div class="bg-base-200 rounded-lg p-6">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="badge {categoryColors[category as keyof typeof categoryColors]}">{label}</span>
				</h2>
				<div class="space-y-4">
					{#each categorySources as source}
						<div class="bg-base-300 rounded-lg p-4">
							<div class="flex items-start justify-between gap-4">
								<div>
									<h3 class="font-bold text-lg">{source.name}</h3>
									<p class="text-sm opacity-70 mt-1">{source.description}</p>
								</div>
								<a
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-sm btn-outline shrink-0"
								>
									Visit
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}

	<!-- Data quality notes -->
	<div class="bg-base-200 rounded-lg p-6">
		<h2 class="text-xl font-bold mb-4">Data Quality Notes</h2>
		<div class="prose max-w-none">
			<ul>
				<li>
					<strong>Climate data</strong> is based on historical averages, typically from 30-year climate normals where available.
				</li>
				<li>
					<strong>Sunny days</strong> counts may vary by source definition. We use "full sun + partly cloudy" days where possible.
				</li>
				<li>
					<strong>Cost of living</strong> indices are relative values, with 100 typically representing the baseline average.
				</li>
				<li>
					<strong>Walk/Bike Scores</strong> may not be available for all cities, particularly smaller or non-US locations.
				</li>
				<li>
					<strong>Safety indices</strong> are based on reported crime rates and perception surveys.
				</li>
				<li>
					<strong>EV infrastructure</strong> scores are estimates based on available charging station data.
				</li>
			</ul>
		</div>
	</div>

	<!-- Disclaimer -->
	<div class="alert alert-info">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
		<div>
			<h3 class="font-bold">Disclaimer</h3>
			<p class="text-sm">
				This data is compiled for research and exploration purposes. While we strive for accuracy, data may be incomplete or outdated. Always verify critical information through official sources before making relocation decisions.
			</p>
		</div>
	</div>

	<div class="flex gap-4">
		<a href="/methodology" class="btn btn-primary">View Methodology</a>
		<a href="/" class="btn btn-outline">Back to Dashboard</a>
	</div>
</div>
