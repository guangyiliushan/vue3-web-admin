import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

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