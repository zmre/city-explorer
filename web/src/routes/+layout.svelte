<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <!-- Navigation -->
  <nav class="navbar bg-base-200 shadow-lg">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">
        <span class="text-primary">City</span>
        <span>Explorer</span>
      </a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/compare">Compare</a></li>
        <li><a href="/research">Research</a></li>
        <li><a href="/methodology">Methodology</a></li>
        <li><a href="/sources">Sources</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main content -->
  <main class="flex-1 container mx-auto px-4 py-6">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <aside>
      <p>City Livability Explorer &copy; 2026</p>
    </aside>
  </footer>
</div>
