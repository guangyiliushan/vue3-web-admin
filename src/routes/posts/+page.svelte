<script lang="ts">
	export let data: {
		posts: Array<{
			id: string;
			title: string;
			category: string;
			timeToRead: number;
			views: number;
			likes: number;
			createdAt: string;
			updatedAt: string;
		}>;
	};
	const { posts } = data;

	async function deletePost(postId: string) {
		if (confirm('确定要删除这篇文章吗？')) {
			try {
				const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
				if (response.ok) {
					location.reload();
				} else {
					const error = await response.json();
					alert(`删除失败: ${error.message || '未知错误'}`);
				}
			} catch (err) {
				alert('网络错误，删除失败');
			}
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">博客文章管理</h1>
		<a href="/posts/new" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>新建文章</a
		>
	</div>

	<div class="rounded-lg bg-white shadow">
		<table class="min-w-full">
			<thead>
				<tr class="border-b">
					<th class="p-4 text-left">标题</th>
					<th class="p-4 text-left">分类</th>
					<th class="p-4 text-left">阅读时间</th>
					<th class="p-4 text-left">浏览次数</th>
					<th class="p-4 text-left">创建时间</th>
					<th class="p-4 text-left">更新时间</th>
					<th class="p-4 text-left">操作</th>
				</tr>
			</thead>
			<tbody>
				{#each posts as post}
					<tr class="border-b hover:bg-gray-50">
						<td class="p-4">{post.title}</td>
						<td class="p-4">{post.category}</td>
						<td class="p-4">{post.timeToRead} 分钟</td>
						<td class="p-4">{post.views}</td>
						<td class="p-4">{new Date(post.createdAt).toLocaleString()}</td>
						<td class="p-4">{new Date(post.updatedAt).toLocaleString()}</td>
						<td class="p-4">
							<a href="/posts/{post.id}/edit" class="mr-3 text-blue-500 hover:underline">编辑</a>
							<button class="text-red-500 hover:underline" on:click={() => deletePost(post.id)}>
								删除
							</button>
						</td>
					</tr>
				{/each}

				{#if posts.length === 0}
					<tr>
						<td colspan="6" class="p-4 text-center text-gray-500">暂无文章</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
