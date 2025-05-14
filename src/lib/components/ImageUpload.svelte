<script lang="ts">
  export let onImageUploaded = (url: string) => {};

  let loading = false;
  let fileInput: HTMLInputElement;

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    loading = true;
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success && result.url) {
        onImageUploaded(result.url);
      } else {
        console.error('Upload failed:', result.error);
        alert('上传失败，请重试');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传出错，请重试');
    } finally {
      loading = false;
      fileInput.value = '';
    }
  }
</script>

<div>
  <button 
    type="button"
    class="flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
    on:click={() => fileInput?.click()}
    disabled={loading}
  >
    {#if loading}
      <span class="mr-2">上传中...</span>
    {:else}
      <span class="mr-2">上传图片</span>
    {/if}
  </button>
  <input 
    bind:this={fileInput}
    type="file" 
    accept="image/*"
    class="hidden" 
    on:change={handleFileChange} 
  />
</div>
