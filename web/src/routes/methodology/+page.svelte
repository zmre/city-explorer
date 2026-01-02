<script lang="ts">
	import { DEFAULT_WEIGHTS } from '$lib/types/city';
</script>

<svelte:head>
	<title>Scoring Methodology - Climate Explorer</title>
	<meta name="description" content="Learn how cities are scored and ranked in the Climate Explorer based on climate, geography, livability, and sustainability factors." />
</svelte:head>

<div class="prose prose-lg max-w-4xl mx-auto">
	<h1>Scoring Methodology</h1>

	<p class="lead">
		This research project identifies and ranks cities globally based on climate quality, livability factors, and forward-thinking urban policies. The goal is to find ideal relocation candidates that balance excellent weather, quality of life, and progressive infrastructure.
	</p>

	<h2>Reference Baseline: Boulder, Colorado</h2>

	<p>
		Boulder serves as our climate benchmark with approximately 300 sunny days per year, low relative humidity (30-50%), four distinct seasons, mild winters with occasional snow, and warm but not hot summers.
	</p>

	<h2>Category Weights</h2>

	<div class="overflow-x-auto">
		<table class="table table-zebra">
			<thead>
				<tr>
					<th>Category</th>
					<th>Default Weight</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="font-semibold">Climate Quality</td>
					<td>{DEFAULT_WEIGHTS.climate} pts</td>
					<td>Sunny days, temperature, humidity</td>
				</tr>
				<tr>
					<td class="font-semibold">Geographic Features</td>
					<td>{DEFAULT_WEIGHTS.geography} pts</td>
					<td>Mountains, ocean, natural beauty</td>
				</tr>
				<tr>
					<td class="font-semibold">Accessibility</td>
					<td>{DEFAULT_WEIGHTS.accessibility} pts</td>
					<td>Airports, connectivity, walkability</td>
				</tr>
				<tr>
					<td class="font-semibold">Cost of Living</td>
					<td>{DEFAULT_WEIGHTS.cost} pts</td>
					<td>Housing, general expenses</td>
				</tr>
				<tr>
					<td class="font-semibold">Family-Friendliness</td>
					<td>{DEFAULT_WEIGHTS.family} pts</td>
					<td>Schools, safety, activities</td>
				</tr>
				<tr>
					<td class="font-semibold">Sustainability</td>
					<td>{DEFAULT_WEIGHTS.sustainability} pts</td>
					<td>Biking, EVs, forward-thinking policies</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p class="text-sm opacity-70">
		Weights can be customized using the scoring sliders on the main dashboard. Weights are automatically normalized to 100 for scoring.
	</p>

	<h2>Climate Scoring</h2>

	<h3>Sunny Days (0-10 points)</h3>
	<ul>
		<li><strong>300+ days:</strong> 10 points (Boulder baseline)</li>
		<li><strong>250-299 days:</strong> 8 points</li>
		<li><strong>200-249 days:</strong> 6 points</li>
		<li><strong>150-199 days:</strong> 4 points</li>
		<li><strong>100-149 days:</strong> 2 points</li>
		<li><strong>&lt;100 days:</strong> 0 points</li>
	</ul>

	<h3>Humidity Comfort (0-10 points)</h3>
	<ul>
		<li><strong>&lt;40% average:</strong> 10 points (ideal)</li>
		<li><strong>40-50%:</strong> 8 points</li>
		<li><strong>50-60%:</strong> 6 points</li>
		<li><strong>60-70%:</strong> 4 points</li>
		<li><strong>70-80%:</strong> 2 points</li>
		<li><strong>&gt;80%:</strong> 0 points</li>
	</ul>

	<h3>Temperature Mildness (0-10 points)</h3>
	<p>
		Based on deviation from the ideal temperature range (60-80°F / 15-27°C for highs). Cities with fewer extreme hot and cold days receive higher scores.
	</p>

	<h2>Geographic Scoring</h2>

	<ul>
		<li><strong>Both mountains AND ocean:</strong> 10 points</li>
		<li><strong>Near mountains only:</strong> 3 points</li>
		<li><strong>Near ocean only:</strong> 3 points</li>
		<li><strong>Neither:</strong> 0 points</li>
	</ul>

	<h2>City Selection Criteria</h2>

	<h3>Population Requirements</h3>
	<ul>
		<li><strong>Minimum:</strong> 50,000 residents</li>
		<li><strong>Maximum:</strong> 1,000,000 residents</li>
		<li><strong>Rationale:</strong> Large enough for amenities, small enough to avoid mega-city problems</li>
	</ul>

	<h3>Target Regions</h3>
	<ul>
		<li><strong>North America:</strong> USA, Canada, Mexico</li>
		<li><strong>Central America:</strong> All countries</li>
		<li><strong>South America:</strong> All countries</li>
		<li><strong>Europe:</strong> Western and Eastern Europe</li>
		<li><strong>Oceania:</strong> Australia, New Zealand</li>
	</ul>

	<h2>Livability Factors</h2>

	<h3>Accessibility</h3>
	<ul>
		<li>Airport proximity and flight destinations</li>
		<li>Distance to major cities (500k+ population)</li>
		<li>Walk Score (where available)</li>
		<li>Public transportation quality</li>
	</ul>

	<h3>Cost of Living</h3>
	<ul>
		<li>Cost of living index (relative to baseline)</li>
		<li>Housing costs (median home price, rent)</li>
		<li>Healthcare and grocery costs</li>
	</ul>

	<h3>Family-Friendliness</h3>
	<ul>
		<li>School quality ratings</li>
		<li>Crime rates and safety perception</li>
		<li>Parks, recreation, and cultural amenities</li>
	</ul>

	<h2>Sustainability Criteria</h2>

	<h3>Transportation</h3>
	<ul>
		<li>Bike lane miles and bike share programs</li>
		<li>Pedestrian zones and sidewalk coverage</li>
		<li>Public transit coverage and reliability</li>
	</ul>

	<h3>Electric Vehicle Support</h3>
	<ul>
		<li>EV charging stations per capita</li>
		<li>DC fast charging availability</li>
		<li>EV incentives and emissions regulations</li>
	</ul>

	<h3>Environmental Progress</h3>
	<ul>
		<li>Clean energy percentage</li>
		<li>Net-zero commitments</li>
		<li>Sustainability initiatives</li>
	</ul>

	<h2>Custom Scoring</h2>

	<p>
		The dashboard allows you to customize category weights to match your priorities. For example:
	</p>

	<ul>
		<li><strong>Climate Focus:</strong> Prioritizes sunny days and comfortable temperatures</li>
		<li><strong>Budget Focus:</strong> Prioritizes low cost of living</li>
		<li><strong>Family Focus:</strong> Prioritizes safety and kid-friendliness</li>
		<li><strong>Green Focus:</strong> Prioritizes sustainability and biking infrastructure</li>
	</ul>

	<p>
		Your custom weights are reflected in the URL, making it easy to share your personalized rankings with others.
	</p>

	<div class="mt-8 flex gap-4">
		<a href="/" class="btn btn-primary">Explore Dashboard</a>
		<a href="/sources" class="btn btn-outline">View Data Sources</a>
	</div>
</div>
