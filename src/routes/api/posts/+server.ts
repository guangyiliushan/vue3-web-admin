import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({ request }: { request: Request }) => {
  const { title, content, category, tags }: { title: string; content: string; category: string | null; tags: string[] } = await request.json();

  try {
    const categoryRecord = category
      ? await prisma.category.upsert({
          where: { name: category },
          update: {},
          create: { name: category }
        })
      : null;

    const tagRecords = await Promise.all(
      tags.map((tag: string) =>
        prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag }
        })
      )
    );

    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: categoryRecord?.id || null,
        tags: {
          connect: tagRecords.map(tag => ({ id: tag.id }))
        },
        timeToRead: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
        viewCount: 0
      }
    });

    return json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return json({ error: '创建文章失败' }, { status: 500 });
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
