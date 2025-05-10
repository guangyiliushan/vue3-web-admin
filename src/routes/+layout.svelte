<script lang="ts">
  import '../app.css';
  
  let { children } = $props();
</script>

  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-2 flex items-center justify-between">
        <a href="/" class="text-xl font-bold">Markdown博客管理</a>
        <div>
          <a href="/posts" class="px-3 py-2 hover:text-blue-600">博客文章</a>
        </div>
      </div>
    </nav>

    <main class="min-h-[calc(100vh-64px)]">
      {@render children()}
    </main>
  </div>