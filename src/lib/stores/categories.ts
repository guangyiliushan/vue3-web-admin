import { writable } from 'svelte/store';

export const categoriesStore = writable<{ id: string; name: string }[]>([]);

export async function updateCategories() {
  try {
    const response = await fetch('/api/categories');
    if (response.ok) {
      const { data } = await response.json();
      categoriesStore.set(data);
    } else {
      console.error('Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
}