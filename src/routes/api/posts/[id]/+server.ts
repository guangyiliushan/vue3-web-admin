import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const PUT = async ({ params, request }: { params: { id: string }; request: Request }) => {
  const { id } = params;
  const { title, content, categoryId, tags }: {
    title: string;
    content: string;
    categoryId: string | null;
    tags: string
  } = await request.json();

  try {
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

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        tags: {
          set: [],
          connect: tagRecords.map(tag => ({ id: tag.id }))
        },
        timeToRead,
      },
      include: {
        category: true,
        tags: true
      }
    });

    return json({ success: true, data: updatedPost, error: null }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return json({ success: false, data: null, error: '更新失败' }, { status: 500 });
  }
};

export const DELETE = async ({ params }) => {
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