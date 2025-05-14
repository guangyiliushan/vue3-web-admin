<script lang="ts">
  import { categoriesStore, updateCategories } from '$lib/stores/categories';
  import { onMount } from 'svelte';

  export let onCategoryChange: (category: { id: string; name: string }) => void;
  export let selectedCategoryId: string | null = null;

  let categories = $categoriesStore;
  let isCreatingCategory = false;
  let newCategoryName = '';

  onMount(async () => {
     updateCategories(); 
  })

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      alert('分类名称不能为空');
      return;
    }
    if (categories.some((cat) => cat.name === newCategoryName)) {
      alert('分类已存在');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });

      if (response.ok) {
        const newCategory = await response.json();
        updateCategories();
        categories = $categoriesStore
        selectedCategoryId = newCategory.id;
        onCategoryChange(newCategory);
        newCategoryName = '';
        isCreatingCategory = false;
      } else {
        alert('创建分类失败');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('创建分类失败');
    }
  }

  function handleCategorySelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedCategory = categories.find((cat) => cat.id === selectedId);
    if (selectedCategory) {
      selectedCategoryId = selectedCategory.id;
      onCategoryChange(selectedCategory);
    }
  }
</script>


{#if isCreatingCategory}
  <div class="flex items-center gap-2">
    <input
      type="text"
      bind:value={newCategoryName}
      placeholder="输入新分类名称"
      class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
    />
    <button
      type="button"
      class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      on:click={handleCreateCategory}
    >
      确认
    </button>
    <button
      type="button"
      class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
      on:click={() => {
        isCreatingCategory = false;
        newCategoryName = '';
      }}
    >
      取消
    </button>
  </div>
{:else}
  <div class="flex items-center gap-2">
    <select
      id="category"
      name="category"
      bind:value={selectedCategoryId}
      on:change={handleCategorySelect}
      class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
      required
    >
      <option value="" disabled>请选择分类</option>
      {#each categories as cat}
        <option value={cat.id}>{cat.name}</option>
      {/each}
    </select>
    <button
      type="button"
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      on:click={() => (isCreatingCategory = true)}
    >
      新建分类
    </button>
  </div>
{/if}