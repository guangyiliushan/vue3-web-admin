<script>
  import { goto } from '$app/navigation';
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6">SvelteKit Markdown博客管理系统</h1>
  
  <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">欢迎使用博客管理系统</h2>
    <p class="mb-4">使用这个系统，您可以轻松地管理您的Markdown博客文章。</p>
    
    <div class="flex flex-wrap gap-4 mt-6">
      <a 
        href="/posts" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center"
      >
        进入博客管理
      </a>
    </div>
  </div>
</div>