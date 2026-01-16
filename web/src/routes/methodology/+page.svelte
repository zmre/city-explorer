<script lang="ts">
	import { DEFAULT_WEIGHTS } from '$lib/types/city';
</script>

<svelte:head>
	<title>Scoring Methodology - Climate Explorer</title>
	<meta
		name="description"
		content="Learn how cities are scored and ranked in the Climate Explorer based on climate, geography, livability, and sustainability factors."
	/>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-12">
	<!-- Header -->
	<header class="text-center">
		<h1 class="text-4xl font-bold mb-4">Scoring Methodology</h1>
		<p class="text-lg opacity-80 max-w-2xl mx-auto">
			This research project identifies and ranks cities globally based on climate quality,
			livability factors, and forward-thinking urban policies. The goal is to find ideal relocation
			candidates that balance excellent weather, quality of life, and progressive infrastructure.
		</p>
	</header>

	<!-- Boulder Baseline -->
	<section class="bg-base-200 rounded-xl p-6">
		<h2 class="text-2xl font-bold mb-4 text-primary">Reference Baseline: Boulder, Colorado</h2>
		<p class="mb-4">
			Boulder serves as our climate benchmark with approximately 300 sunny days per year, low
			relative humidity (30-50%), four distinct seasons, mild winters with occasional snow, and warm
			but not hot summers.
		</p>
		<div class="stats stats-vertical lg:stats-horizontal shadow bg-base-300 w-full">
			<div class="stat">
				<div class="stat-title">Sunny Days</div>
				<div class="stat-value text-primary">300</div>
				<div class="stat-desc">days per year</div>
			</div>
			<div class="stat">
				<div class="stat-title">Humidity</div>
				<div class="stat-value text-secondary">30-50%</div>
				<div class="stat-desc">annual average</div>
			</div>
			<div class="stat">
				<div class="stat-title">Summer High</div>
				<div class="stat-value">88°F</div>
				<div class="stat-desc">31°C average</div>
			</div>
		</div>
	</section>

	<!-- Category Weights -->
	<section>
		<h2 class="text-2xl font-bold mb-6 text-primary">Category Weights</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Climate Quality</h3>
						<span class="badge badge-primary badge-lg">{DEFAULT_WEIGHTS.climate} pts</span>
					</div>
					<p class="text-sm opacity-70">Sunny days, temperature, humidity</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Geographic Features</h3>
						<span class="badge badge-secondary badge-lg">{DEFAULT_WEIGHTS.geography} pts</span>
					</div>
					<p class="text-sm opacity-70">Mountains, ocean, natural beauty</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Accessibility</h3>
						<span class="badge badge-accent badge-lg">{DEFAULT_WEIGHTS.accessibility} pts</span>
					</div>
					<p class="text-sm opacity-70">Airports, connectivity, walkability</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Cost of Living</h3>
						<span class="badge badge-info badge-lg">{DEFAULT_WEIGHTS.cost} pts</span>
					</div>
					<p class="text-sm opacity-70">Housing, general expenses</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Family-Friendliness</h3>
						<span class="badge badge-warning badge-lg">{DEFAULT_WEIGHTS.family} pts</span>
					</div>
					<p class="text-sm opacity-70">Schools, safety, activities</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-lg">
				<div class="card-body">
					<div class="flex justify-between items-center">
						<h3 class="card-title text-lg">Sustainability</h3>
						<span class="badge badge-success badge-lg">{DEFAULT_WEIGHTS.sustainability} pts</span>
					</div>
					<p class="text-sm opacity-70">Biking, EVs, forward-thinking policies</p>
				</div>
			</div>
		</div>
		<p class="text-sm opacity-70 mt-4 text-center">
			Weights can be customized using the scoring sliders on the main dashboard. Weights are
			automatically normalized to 100 for scoring.
		</p>
	</section>

	<!-- Climate Scoring -->
	<section class="space-y-6">
		<h2 class="text-2xl font-bold text-primary">Climate Scoring</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Sunny Days -->
			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Sunny Days (0-10 points)</h3>
				<ul class="space-y-2">
					<li class="flex justify-between items-center">
						<span>300+ days</span>
						<span class="badge badge-success">10 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>250-299 days</span>
						<span class="badge">8 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>200-249 days</span>
						<span class="badge">6 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>150-199 days</span>
						<span class="badge">4 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>100-149 days</span>
						<span class="badge">2 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>&lt;100 days</span>
						<span class="badge badge-ghost">0 pts</span>
					</li>
				</ul>
			</div>

			<!-- Humidity -->
			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Humidity Comfort (0-10 points)</h3>
				<ul class="space-y-2">
					<li class="flex justify-between items-center">
						<span>&lt;40% average</span>
						<span class="badge badge-success">10 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>40-50%</span>
						<span class="badge">8 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>50-60%</span>
						<span class="badge">6 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>60-70%</span>
						<span class="badge">4 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>70-80%</span>
						<span class="badge">2 pts</span>
					</li>
					<li class="flex justify-between items-center">
						<span>&gt;80%</span>
						<span class="badge badge-ghost">0 pts</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Temperature -->
		<div class="bg-base-200 rounded-xl p-6">
			<h3 class="text-lg font-semibold mb-4">Temperature Mildness (0-10 points)</h3>
			<p>
				Based on deviation from the ideal temperature range (60-80°F / 15-27°C for highs). Cities
				with fewer extreme hot and cold days receive higher scores.
			</p>
		</div>
	</section>

	<!-- Geographic Scoring -->
	<section>
		<h2 class="text-2xl font-bold mb-6 text-primary">Geographic Scoring</h2>
		<div class="bg-base-200 rounded-xl p-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="text-center p-4 bg-base-300 rounded-lg">
					<div class="text-3xl font-bold text-success">10</div>
					<div class="text-sm opacity-70 mt-1">Mountains + Ocean</div>
				</div>
				<div class="text-center p-4 bg-base-300 rounded-lg">
					<div class="text-3xl font-bold">3</div>
					<div class="text-sm opacity-70 mt-1">Mountains Only</div>
				</div>
				<div class="text-center p-4 bg-base-300 rounded-lg">
					<div class="text-3xl font-bold">3</div>
					<div class="text-sm opacity-70 mt-1">Ocean Only</div>
				</div>
				<div class="text-center p-4 bg-base-300 rounded-lg">
					<div class="text-3xl font-bold opacity-50">0</div>
					<div class="text-sm opacity-70 mt-1">Neither</div>
				</div>
			</div>
		</div>
	</section>

	<!-- City Selection -->
	<section class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-base-200 rounded-xl p-6">
			<h2 class="text-xl font-bold mb-4 text-primary">Population Requirements</h2>
			<ul class="space-y-3">
				<li class="flex justify-between">
					<span class="font-medium">Minimum</span>
					<span class="font-mono">50,000</span>
				</li>
				<li class="flex justify-between">
					<span class="font-medium">Maximum</span>
					<span class="font-mono">1,000,000</span>
				</li>
			</ul>
			<p class="text-sm opacity-70 mt-4">
				Large enough for amenities, small enough to avoid mega-city problems.
			</p>
		</div>

		<div class="bg-base-200 rounded-xl p-6">
			<h2 class="text-xl font-bold mb-4 text-primary">Target Regions</h2>
			<div class="flex flex-wrap gap-2">
				<span class="badge badge-outline">North America</span>
				<span class="badge badge-outline">Central America</span>
				<span class="badge badge-outline">South America</span>
				<span class="badge badge-outline">Europe</span>
				<span class="badge badge-outline">Oceania</span>
			</div>
		</div>
	</section>

	<!-- Livability Factors -->
	<section>
		<h2 class="text-2xl font-bold mb-6 text-primary">Livability Factors</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Accessibility</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Airport proximity and flight destinations</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Distance to major cities (500k+ population)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Walk Score (where available)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Public transportation quality</span>
					</li>
				</ul>
			</div>

			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Cost of Living</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Cost of living index (relative to baseline)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Housing costs (median home price, rent)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Healthcare and grocery costs</span>
					</li>
				</ul>
			</div>

			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Family-Friendliness</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>School quality ratings</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Crime rates and safety perception</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						<span>Parks, recreation, and cultural amenities</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Sustainability Criteria -->
	<section>
		<h2 class="text-2xl font-bold mb-6 text-primary">Sustainability Criteria</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Transportation</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Bike lane miles and bike share programs</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Pedestrian zones and sidewalk coverage</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Public transit coverage and reliability</span>
					</li>
				</ul>
			</div>

			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Electric Vehicle Support</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>EV charging stations per capita</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>DC fast charging availability</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>EV incentives and emissions regulations</span>
					</li>
				</ul>
			</div>

			<div class="bg-base-200 rounded-xl p-6">
				<h3 class="text-lg font-semibold mb-4">Environmental Progress</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Clean energy percentage</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Net-zero commitments</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-success">•</span>
						<span>Sustainability initiatives</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Custom Scoring -->
	<section class="bg-base-200 rounded-xl p-6">
		<h2 class="text-2xl font-bold mb-4 text-primary">Custom Scoring</h2>
		<p class="mb-4">
			The dashboard allows you to customize category weights to match your priorities:
		</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div class="bg-base-300 rounded-lg p-4">
				<div class="font-semibold">Climate Focus</div>
				<div class="text-sm opacity-70">Prioritizes sunny days and comfortable temperatures</div>
			</div>
			<div class="bg-base-300 rounded-lg p-4">
				<div class="font-semibold">Budget Focus</div>
				<div class="text-sm opacity-70">Prioritizes low cost of living</div>
			</div>
			<div class="bg-base-300 rounded-lg p-4">
				<div class="font-semibold">Family Focus</div>
				<div class="text-sm opacity-70">Prioritizes safety and kid-friendliness</div>
			</div>
			<div class="bg-base-300 rounded-lg p-4">
				<div class="font-semibold">Green Focus</div>
				<div class="text-sm opacity-70">Prioritizes sustainability and biking infrastructure</div>
			</div>
		</div>
		<p class="text-sm opacity-70 mt-4">
			Your custom weights are reflected in the URL, making it easy to share your personalized
			rankings with others.
		</p>
	</section>

	<!-- CTA -->
	<footer class="flex flex-wrap gap-4 justify-center">
		<a href="/" class="btn btn-primary btn-lg">Explore Dashboard</a>
		<a href="/sources" class="btn btn-outline btn-lg">View Data Sources</a>
		<a href="/research" class="btn btn-outline btn-lg">Read Research</a>
	</footer>
</div>
