import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const PUT = async ({ params, request }: { params: { id: string }; request: Request }) => {
  const { id } = params;
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

    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        categoryId: category || null,
        tags: {
          set: [],
          connect: tagRecords.map(tag => ({ id: tag.id }))
        }
      }
    });

    return json({ message: '文章已更新' }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return json({ error: '更新失败' }, { status: 500 });
  }
};
