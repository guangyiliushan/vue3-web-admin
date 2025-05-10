<script lang="ts">
  import { compile } from 'mdsvex';

  export let markdown = '';
  let htmlContent = '';

  $: updatePreview(markdown);

  async function updatePreview(md: string) {
    if (!md) {
      htmlContent = '';
      return;
    }

    try {
      const result = await compile(md);
      htmlContent = result?.code || '';
    } catch (error) {
      console.error('Error compiling markdown:', error);
      htmlContent = '<p>Error rendering markdown</p>';
    }
  }
</script>

<div class="prose max-w-none">
  {@html htmlContent}
</div>
