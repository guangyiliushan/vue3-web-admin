import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const categories = await prisma.category.findMany({
    select: { name: true }
  });

  return {
    categories: categories.map(c => c.name)
  };
};

