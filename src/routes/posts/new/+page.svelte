<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';

  export let data: {
    post?: {
      id: string;
      title: string;
      content: string;
      categoryId: string | null;
      tags: string;
    };
    categories: { id: string; name: string }[];
  };

  async function handlePostSubmit(payload: { id: string | null; title: string; content: string; categoryId: string | null; tags: string }) {
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
</script>

<div class="container mx-auto p-4">
  <div class="mb-6">
    <h1 class="text-2xl font-bold">新建文章</h1>
  </div>

  <PostForm 
    data={{ categories: data.categories }} 
    onSubmit={handlePostSubmit} 
  />
</div>