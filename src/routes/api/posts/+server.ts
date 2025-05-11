import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({ request }: { request: Request }) => {
  const { title, content, category, tags }: { title: string; content: string; category: string | null; tags: string } = await request.json();

  try {
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
        categoryId: category || null,
        tags: {
          connect: tagRecords.map(tag => ({ id: tag.id }))
        }
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

    return json({ success: true, data: posts, error: null });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ success: false, data: null, error: '获取失败' }, { status: 500 });
  }
};

export const DELETE = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    await prisma.post.delete({
      where: { id }
    });
    return json({ message: '文章已删除' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return json({ error: '删除文章失败' }, { status: 500 });
  }
};
