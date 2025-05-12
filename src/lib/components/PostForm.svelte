<script lang="ts">
  import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
  import MarkdownPreview from '$lib/components/MarkdownPreview.svelte';

  export let data: { categories?: string[], post?: { id: string, title: string, content: string, category: string, tags: string } };
  export let onSubmit: (payload: {id: string | null; title: string; content: string; category: string; tags: string }) => Promise<void>;
  export let onCreateCategory: (newCategoryName: string) => Promise<void>;

  let id = data.post?.id || null;
  let content = '';
  let title = '';
  let category = '';
  let tags: string = '';
  let activeTab = 'edit';
  let categories: string[] = [];
  let isCreatingCategory = false;
  let newCategoryName = '';

  $: categories = data.categories || [];

  if (data.post) {
    title = data.post.title;
    content = data.post.content;
    category = data.post.category;
    tags = data.post.tags;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    await onSubmit({id, title, content, category, tags });
  }

  async function confirmNewCategory() {
    if (!newCategoryName.trim()) {
      alert('分类名称不能为空');
      return;
    }
    if (categories.includes(newCategoryName)) {
      alert('分类已存在');
      return;
    }

    await onCreateCategory(newCategoryName);
    categories = [...categories, newCategoryName];
    category = newCategoryName;
    isCreatingCategory = false;
    newCategoryName = '';
  }
</script>

<div class="container mx-auto p-4">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid grid-cols-1 gap-6 mb-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">标题</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          bind:value={title} 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">分类</label>
        {#if isCreatingCategory}
          <div class="flex items-center gap-2">
            <input 
              type="text" 
              bind:value={newCategoryName} 
              placeholder="输入新分类名称" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <button 
              type="button" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              on:click={confirmNewCategory}
            >
              确认
            </button>
            <button 
              type="button" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              on:click={() => { isCreatingCategory = false; newCategoryName = ''; }}
            >
              取消
            </button>
          </div>
        {:else}
          <div class="flex items-center gap-2">
            <select 
              id="category" 
              name="category" 
              bind:value={category} 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>请选择分类</option>
              {#each categories as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
            <button 
              type="button" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              on:click={() => isCreatingCategory = true}
            >
              新建分类
            </button>
          </div>
        {/if}
      </div>

      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">标签 (用逗号分隔)</label>
        <input 
          type="text" 
          id="tags" 
          name="tags" 
          bind:value={tags} 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <input type="hidden" name="content" value={content} />
    </div>

    <div class="bg-white rounded-lg shadow mb-6">
      <div class="border-b px-4 py-2 flex">
        <div>
          <button 
            type="button"
            class="px-4 py-2 mr-2 {activeTab === 'edit' ? 'border-b-2 border-blue-500' : ''}" 
            on:click={() => activeTab = 'edit'}
          >
            编辑
          </button>
          <button 
            type="button"
            class="px-4 py-2 mr-2 {activeTab === 'preview' ? 'border-b-2 border-blue-500' : ''}"
            on:click={() => activeTab = 'preview'}
          >
            预览
          </button>
        </div>
        <button 
          type="button"
          class="px-4 py-2 {activeTab === 'split' ? 'border-b-2 border-blue-500' : ''}"
          on:click={() => activeTab = 'split'}
        >
          同时显示
        </button>
      </div>

      <div class="p-4 h-[500px] overflow-auto">
        {#if activeTab === 'edit'}
          <MarkdownEditor 
            {content} 
            onChange={(value) => content = value} 
          />
        {:else if activeTab === 'preview'}
          <MarkdownPreview markdown={content} />
        {:else if activeTab === 'split'}
          <div class="grid grid-cols-2 gap-4 h-full">
            <div class="border-r pr-4">
              <MarkdownEditor 
                {content} 
                onChange={(value) => content = value} 
              />
            </div>
            <div class="pl-4">
              <MarkdownPreview markdown={content} />
            </div>
          </div>
        {/if}
      </div>
    </div>

    <button 
      type="submit" 
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      {data.post ? '更新文章' : '创建文章'}
    </button>
  </form>
</div>