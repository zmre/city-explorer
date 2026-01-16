<script lang="ts">
  import {
    RESEARCH_ARTICLES,
    getFeaturedArticles,
    getArticlesByCategory,
  } from "$lib/data/research-articles";

  const featured = getFeaturedArticles();
  const recommendations = getArticlesByCategory("recommendations");
  const analysis = getArticlesByCategory("analysis");
  const data = getArticlesByCategory("data");
  const methodology = getArticlesByCategory("methodology");

  const categoryColors = {
    recommendations: "badge-primary",
    analysis: "badge-secondary",
    data: "badge-accent",
    methodology: "badge-info",
  };

  const categoryLabels = {
    recommendations: "Recommendations",
    analysis: "Analysis",
    data: "Data",
    methodology: "Methodology",
  };
</script>

<svelte:head>
  <title>Research - City Livability Explorer</title>
  <meta
    name="description"
    content="In-depth climate and livability research covering 150+ cities worldwide with detailed analysis and recommendations."
  />
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold mb-4">Climate Research</h1>
    <p class="text-lg opacity-80">
      In-depth analysis of 150+ cities worldwide, covering climate data,
      livability rankings, and hidden gems for those seeking the ideal
      moderate-climate destination.
    </p>
  </div>

  <!-- Featured Articles -->
  <section>
    <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      Featured Research
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each featured as article}
        <a
          href="/research/{article.slug}"
          class="card bg-base-200 hover:bg-base-300 transition-colors shadow-lg"
        >
          <div class="card-body">
            <div class="flex justify-between items-start">
              <span class="badge {categoryColors[article.category]}"
                >{categoryLabels[article.category]}</span
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="card-title text-lg">{article.title}</h3>
            <p class="text-sm opacity-70">{article.description}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- All Articles by Category -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Recommendations -->
    <section class="bg-base-200 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="badge badge-primary">Recommendations</span>
      </h2>
      <div class="space-y-3">
        {#each recommendations as article}
          <a
            href="/research/{article.slug}"
            class="block p-3 bg-base-300 rounded-lg hover:bg-base-100 transition-colors"
          >
            <h3 class="font-semibold">{article.title}</h3>
            <p class="text-sm opacity-70 mt-1">{article.description}</p>
          </a>
        {/each}
      </div>
    </section>

    <!-- Analysis -->
    <section class="bg-base-200 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="badge badge-secondary">Analysis</span>
      </h2>
      <div class="space-y-3">
        {#each analysis as article}
          <a
            href="/research/{article.slug}"
            class="block p-3 bg-base-300 rounded-lg hover:bg-base-100 transition-colors"
          >
            <h3 class="font-semibold">{article.title}</h3>
            <p class="text-sm opacity-70 mt-1">{article.description}</p>
          </a>
        {/each}
      </div>
    </section>

    <!-- Data -->
    <section class="bg-base-200 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="badge badge-accent">Data</span>
      </h2>
      <div class="space-y-3">
        {#each data as article}
          <a
            href="/research/{article.slug}"
            class="block p-3 bg-base-300 rounded-lg hover:bg-base-100 transition-colors"
          >
            <h3 class="font-semibold">{article.title}</h3>
            <p class="text-sm opacity-70 mt-1">{article.description}</p>
          </a>
        {/each}
      </div>
    </section>

    <!-- Methodology -->
    <section class="bg-base-200 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="badge badge-info">Methodology</span>
      </h2>
      <div class="space-y-3">
        {#each methodology as article}
          <a
            href="/research/{article.slug}"
            class="block p-3 bg-base-300 rounded-lg hover:bg-base-100 transition-colors"
          >
            <h3 class="font-semibold">{article.title}</h3>
            <p class="text-sm opacity-70 mt-1">{article.description}</p>
          </a>
        {/each}
      </div>
    </section>
  </div>

  <!-- Quick Stats -->
  <section class="stats shadow-lg bg-base-200 w-full">
    <div class="stat">
      <div class="stat-title">Cities Analyzed</div>
      <div class="stat-value text-primary">150+</div>
      <div class="stat-desc">Across 6 continents</div>
    </div>
    <div class="stat">
      <div class="stat-title">Top Tier Cities</div>
      <div class="stat-value text-secondary">15</div>
      <div class="stat-desc">Appearing on 3+ major rankings</div>
    </div>
    <div class="stat">
      <div class="stat-title">Hidden Gems</div>
      <div class="stat-value text-accent">45</div>
      <div class="stat-desc">Overlooked excellent cities</div>
    </div>
    <div class="stat">
      <div class="stat-title">Research Articles</div>
      <div class="stat-value">{RESEARCH_ARTICLES.length}</div>
      <div class="stat-desc">In-depth analysis documents</div>
    </div>
  </section>
</div>
