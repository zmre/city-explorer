import { error } from '@sveltejs/kit';
import { getArticleBySlug } from '$lib/data/research-articles';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const article = getArticleBySlug(params.slug);

	if (!article) {
		throw error(404, 'Research article not found');
	}

	try {
		// Fetch the markdown file from static folder
		const response = await fetch(`/research/${article.file}`);

		if (!response.ok) {
			throw error(404, 'Research content not found');
		}

		const markdown = await response.text();

		// Configure marked for better table rendering
		marked.setOptions({
			gfm: true,
			breaks: true
		});

		const content = await marked(markdown);

		return {
			article,
			content
		};
	} catch (e) {
		console.error('Error loading research article:', e);
		throw error(500, 'Failed to load research article');
	}
};
