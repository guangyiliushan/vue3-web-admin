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
</script>

<div class="container mx-auto p-4">
  {#if data.post}
    <h1 class="text-2xl font-bold mb-6">编辑文章</h1>
    <PostForm {data} />
  {:else}
    <p class="text-gray-500">加载文章失败，请稍后重试。</p>
  {/if}
</div>
