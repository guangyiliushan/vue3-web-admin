import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET = async () => {
try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });

    return new Response(
      JSON.stringify({ data: categories }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST = async ({ request }: { request: Request }) => {
  const { name }: { name: string } = await request.json();

  try {
    const newCategory = await prisma.category.create({
      data: { name }
    });

    return json({ success: true, data: newCategory, error: null }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return json({ success: false, data: null, error: '创建失败' }, { status: 500 });
  }
};
