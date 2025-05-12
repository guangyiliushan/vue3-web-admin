<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';

  interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string;
  }

  export let data: { post?: Post; categories?: string[] } = {};

  let post = data.post || { id: '', title: '', content: '', category: '', tags: '' }; 
  let categories = data.categories || [];

  async function handlePostSubmit(payload: { id: string | null; title: string; content: string; category: string; tags: string }) {
    const response = await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert('操作失败');
    }
  }

  async function handleCreateCategory(newCategoryName: string) {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName })
    });

    if (!response.ok) {
      alert('创建分类失败');
    }
  }
</script>

<div class="container mx-auto p-4">
  {#if data.post}
    <h1 class="text-2xl font-bold mb-6">编辑文章</h1>
    <PostForm 
      {data} 
      onSubmit={handlePostSubmit} 
      onCreateCategory={handleCreateCategory} 
    />
  {:else}
    <p class="text-gray-500">加载文章失败，请稍后重试。</p>
  {/if}
</div>
