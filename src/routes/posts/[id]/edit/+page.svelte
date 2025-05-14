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

	async function handlePostSubmit(payload: {
		id: string | null;
		title: string;
		content: string;
		categoryId: string | null;
		tags: string;
	}) {
		const response = await fetch(`/api/posts/${payload.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			alert('更新文章失败');
		} else {
			window.location.href = '/posts';
		}
	}
</script>

<div class="container mx-auto p-4">
	{#if data.post}
		<h1 class="mb-6 text-2xl font-bold">编辑文章</h1>
		<PostForm {data} onSubmit={handlePostSubmit} />
	{:else}
		<p class="text-gray-500">加载文章失败，请稍后重试。</p>
	{/if}
</div>
