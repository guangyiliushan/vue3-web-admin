<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';

  export let data: { categories?: string[] };

  async function handlePostSubmit(payload: { id: string | null; title: string; content: string; category: string; tags: string }) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert('发布文章失败');
    } else {
      window.location.href = '/posts'; // 跳转到文章列表页
    }
  }

  // 处理分类创建
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
  <div class="mb-6">
    <h1 class="text-2xl font-bold">新建文章</h1>
  </div>

  <PostForm 
    data={{ categories: data.categories }} 
    onSubmit={handlePostSubmit} 
    onCreateCategory={handleCreateCategory} 
  />
</div>