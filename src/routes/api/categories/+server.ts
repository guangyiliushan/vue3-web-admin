import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({ request }) => {
  const { name } = await request.json();

  if (!name || typeof name !== 'string') {
    return json({ error: '分类名称无效' }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name }
    });
    return json(category, { status: 201 });
  } catch (error) {
    return json({ error: error }, { status: 500 });
  }
};
