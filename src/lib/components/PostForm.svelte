<script lang="ts">
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import MarkdownPreview from '$lib/components/MarkdownPreview.svelte';
	import CategoryCreator from '$lib/components/CategoryCreator.svelte';

	export let data: {
		categories: {
			id: string;
			name: string;
		}[];
		post?: {
			id: string;
			title: string;
			content: string;
			categoryId: string | null;
			tags: string;
		};
	};
	export let onSubmit: (payload: {
		id: string | null;
		title: string;
		content: string;
		categoryId: string | null;
		tags: string;
	}) => Promise<void>;

	let id = data.post?.id || null;
	let content = data.post?.content || '';
	let title = data.post?.title || '';
	let categoryId: string | null = data.post?.categoryId || null;
	let tags: string = data.post?.tags || '';
	let activeTab = 'edit';

	$: categories = data.categories || [];

	if (data.post) {
		title = data.post.title;
		content = data.post.content;
		categoryId = data.post.categoryId;
		tags = data.post.tags;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		try{
			await onSubmit({ id, title, content, categoryId, tags });
		}catch(error){
			console.error('Error submitting form:', error);
			alert('提交失败');
		}
	}

	function handleCategoryChange(category: { id: string; name: string }) {
		categoryId = category.id; // 更新选中的分类 ID
	}
</script>

<div class="container mx-auto p-4">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="mb-6 grid grid-cols-1 gap-6">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">标题</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					required
				/>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-700">分类</label>
				<CategoryCreator 
					onCategoryChange={handleCategoryChange} 
                    selectedCategoryId={categoryId} 
                />

			<div>
				<label for="tags" class="block text-sm font-medium text-gray-700">标签 (用逗号分隔)</label>
				<input
					type="text"
					id="tags"
					name="tags"
					bind:value={tags}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
			</div>

			<input type="hidden" name="content" value={content} />
		</div>

		<div class="mb-6 rounded-lg bg-white shadow">
			<div class="flex border-b px-4 py-2">
				<div>
					<button
						type="button"
						class="mr-2 px-4 py-2 {activeTab === 'edit' ? 'border-b-2 border-blue-500' : ''}"
						on:click={() => (activeTab = 'edit')}
					>
						编辑
					</button>
					<button
						type="button"
						class="mr-2 px-4 py-2 {activeTab === 'preview' ? 'border-b-2 border-blue-500' : ''}"
						on:click={() => (activeTab = 'preview')}
					>
						预览
					</button>
				</div>
				<button
					type="button"
					class="px-4 py-2 {activeTab === 'split' ? 'border-b-2 border-blue-500' : ''}"
					on:click={() => (activeTab = 'split')}
				>
					同时显示
				</button>
			</div>

			<div class="h-[500px] overflow-auto p-4">
				{#if activeTab === 'edit'}
					<MarkdownEditor {content} onChange={(value) => (content = value)} />
				{:else if activeTab === 'preview'}
					<MarkdownPreview markdown={content} />
				{:else if activeTab === 'split'}
					<div class="grid h-full grid-cols-2 gap-4">
						<div class="border-r pr-4">
							<MarkdownEditor {content} onChange={(value) => (content = value)} />
						</div>
						<div class="pl-4">
							<MarkdownPreview markdown={content} />
						</div>
					</div>
				{/if}
			</div>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			{data.post ? '更新文章' : '创建文章'}
		</button>
	</form>
</div>
