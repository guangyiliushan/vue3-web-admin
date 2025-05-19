import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({ request }: { request: Request }) => {
  const { title, content, categoryId, tags }: { title: string; content: string; categoryId: string | null; tags: string } = await request.json();

  try {
    // 计算阅读时间（基于字数，每分钟阅读 200 字）
    const wordCount = content.trim().split(/\s+/).length;
    const timeToRead = Math.max(1, Math.ceil(wordCount / 200));

    const tagRecords = await Promise.all(
      tags.split(',').map((tagName: string) =>
        prisma.tag.upsert({
          where: { name: tagName.trim() },
          update: {},
          create: { name: tagName.trim() }
        })
      )
    );

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: categoryId || null,
        tags: {
          connect: tagRecords.map(tag => ({ id: tag.id }))
        },
        timeToRead,
        views: 0 ,
        likes: 0 ,
      },
      include: {
        category: true,
        tags: true
      }
    });

    return json({ success: true, data: newPost, error: null }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return json({ success: false, data: null, error: '创建失败' }, { status: 500 });
  }
};

export const GET = async ({ url }: { url: URL }) => {
  const category = url.searchParams.get('category');
  const tag = url.searchParams.get('tag');

  try {
    const posts = await prisma.post.findMany({
      where: {
        ...(category && { category: { name: category } }),
        ...(tag && { tags: { some: { name: tag } } })
      },
      include: {
        category: true,
        tags: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    const formattedPosts = posts.map(post => ({
      ...post,
      category: post.category?.name || '未分类'
    }));

    return json({ success: true, data: formattedPosts, error: null });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ success: false, data: null, error: '获取失败' }, { status: 500 });
  }
};

