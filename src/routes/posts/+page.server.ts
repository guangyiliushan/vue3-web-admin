import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/posts');
    if (response.ok) {
      const { data: posts } = await response.json();
      return { posts };
    } else {
      console.error('Failed to fetch posts');
      return { posts: [] };
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    return { posts: [] };
  }
};