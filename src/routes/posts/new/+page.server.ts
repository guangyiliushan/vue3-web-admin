import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const categories = await prisma.category.findMany({
    select: { name: true }
  });

  return {
    categories: categories.map(c => c.name)
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const categoryName = data.get('category') as string || null;
    const tagsString = data.get('tags') as string;

    // 计算阅读时间（基于字数）
    const wordCount = content.trim().split(/\s+/).length;
    const timeToRead = Math.max(1, Math.ceil(wordCount / 200)); // 假设每分钟阅读200字

    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // 最多5个标签

    // 处理分类
    let category = null;
    if (categoryName) {
      category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });
    }

    // 处理标签
    const tagRecords = await Promise.all(
      tags.map(tagName =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })
      )
    );

    await prisma.post.create({
      data: {
        title,
        content,
        categoryId: category?.id || null,
        tags: {
          connect: tagRecords.map(tag => ({ id: tag.id }))
        },
        timeToRead,
        viewCount: 0
      }
    });

    throw redirect(303, '/posts');
  }
};