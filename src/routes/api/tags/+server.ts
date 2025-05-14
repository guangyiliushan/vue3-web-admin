import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET = async () => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });

    return json({ success: true, data: tags, error: null });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return json({ success: false, data: null, error: '获取失败' }, { status: 500 });
  }
};

export const POST = async ({ request }: { request: Request }) => {
  const { name }: { name: string } = await request.json();

  try {
    const newTag = await prisma.tag.create({
      data: { name }
    });

    return json({ success: true, data: newTag, error: null }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return json({ success: false, data: null, error: '创建失败' }, { status: 500 });
  }
};
