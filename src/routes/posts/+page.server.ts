import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  return { posts };
};
