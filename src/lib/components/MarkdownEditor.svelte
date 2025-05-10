<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { markdown } from '@codemirror/lang-markdown';
  // import ImageUpload from './ImageUpload.svelte';

  export let content = '';
  export let onChange = (value: string) => {};

  let element: HTMLElement;
  let view: EditorView;

  onMount(() => {
    view = new EditorView({
      doc: content,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            content = update.state.doc.toString();
            onChange(content);
          }
        })
      ],
      parent: element
    });

    return () => {
      view.destroy();
    };
  });

  // function insertImage(url: string) {
  //   const imageMarkdown = `![image](${url})`;

  //   if (view) {
  //     const transaction = view.state.update({
  //       changes: {
  //         from: view.state.selection.main.from,
  //         to: view.state.selection.main.to,
  //         insert: imageMarkdown
  //       }
  //     });
  //     view.dispatch(transaction);
  //   }
  // }
</script>

<div class="flex flex-col h-full">
  <div class="border-b border-gray-300 p-2 flex">
    <!-- <ImageUpload onImageUploaded={insertImage} /> -->
  </div>
  <div class="flex-grow overflow-auto border border-gray-300 rounded" bind:this={element}></div>
</div>
