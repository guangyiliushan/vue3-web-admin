import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, tags: true }
  });

  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  if (post) {
    return {
      post: {
        ...post,
        category: post.category?.name || null,
        categoryId: post.category?.id || null,
        tags: post.tags.map(tag => tag.name).join(', ')
      },
      categories: categories.map(c => c.name)
    };
  } else {
    throw redirect(303, '/posts');
  }
};

export const actions: Actions = {
  default: async ({ params, request }: { params: { id: string }; request: Request }) => {
    const { id } = params;
    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const categoryId = data.get('categoryId') as string || null;
    const tagsString = data.get('tags') as string;

    const wordCount = content.trim().split(/\s+/).length;
    const timeToRead = Math.max(1, Math.ceil(wordCount / 200));

    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5);

    const tagRecords = await Promise.all(
      tags.map(tagName =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })
      )
    );

    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        categoryId: categoryId || null,
        tags: {
          set: [],
          connect: tagRecords.map(tag => ({ id: tag.id }))
        },
        timeToRead
      }
    });

    throw redirect(303, '/posts');
  }
};