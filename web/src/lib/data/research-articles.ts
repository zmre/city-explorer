/**
 * Research articles metadata
 */

export interface ResearchArticle {
	slug: string;
	title: string;
	description: string;
	category: 'analysis' | 'recommendations' | 'data' | 'methodology';
	featured: boolean;
	file: string;
}

export const RESEARCH_ARTICLES: ResearchArticle[] = [
	{
		slug: 'top-recommendations',
		title: 'Tier 1: Top Moderate-Climate City Recommendations',
		description:
			'The absolute top 10 cities appearing on 3+ major rankings with detailed profiles, climate scores, and comparison matrices.',
		category: 'recommendations',
		featured: true,
		file: 'TIER-1-TOP-RECOMMENDATIONS.md'
	},
	{
		slug: 'hidden-gems',
		title: 'Overlooked Cities & Hidden Gems',
		description:
			'45 overlooked cities with excellent climates that often offer better value, less crowding, and more authentic experiences.',
		category: 'recommendations',
		featured: true,
		file: 'OVERLOOKED-HIDDEN-GEMS.md'
	},
	{
		slug: 'comparison-analysis',
		title: 'Comparison Cities Analysis',
		description:
			'Side-by-side comparison of Freiburg, Ljubljana, and Victoria BC against Boulder baseline with detailed metrics.',
		category: 'analysis',
		featured: true,
		file: 'comparison-cities-analysis.md'
	},
	{
		slug: 'research-summary',
		title: 'Research Summary',
		description:
			'Overview of the research methodology, key findings, and summary of climate and livability rankings.',
		category: 'methodology',
		featured: false,
		file: 'research-summary.md'
	},
	{
		slug: 'boulder-baseline',
		title: 'Boulder Baseline Data',
		description:
			"Detailed climate and livability data for Boulder, Colorado - our reference baseline city.",
		category: 'data',
		featured: false,
		file: 'boulder-baseline-data.md'
	},
	{
		slug: 'european-cities-climate',
		title: 'European Cities Climate Data',
		description:
			'Comprehensive climate data for European cities including sunshine hours, temperatures, and weather patterns.',
		category: 'data',
		featured: false,
		file: 'european-cities-climate-data.md'
	},
	{
		slug: 'rankings-research',
		title: 'Climate & Livability Rankings Research',
		description:
			'Full 150+ city analysis covering all climate and livability rankings, methodology, and data sources.',
		category: 'methodology',
		featured: false,
		file: 'climate-livability-rankings-research.md'
	},
	{
		slug: 'research-index',
		title: 'Research Index & Navigation Guide',
		description:
			'Complete guide to all research documents with navigation by goal, region, and climate type.',
		category: 'methodology',
		featured: false,
		file: 'RESEARCH-INDEX.md'
	}
];

export function getArticleBySlug(slug: string): ResearchArticle | undefined {
	return RESEARCH_ARTICLES.find((article) => article.slug === slug);
}

export function getFeaturedArticles(): ResearchArticle[] {
	return RESEARCH_ARTICLES.filter((article) => article.featured);
}

export function getArticlesByCategory(category: ResearchArticle['category']): ResearchArticle[] {
	return RESEARCH_ARTICLES.filter((article) => article.category === category);
}
