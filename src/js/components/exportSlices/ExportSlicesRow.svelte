<script>
  import ExportSlice from 'components/exportSlice/ExportSlice.svelte';

  export let slices;
</script>

<div
  class="txcm-exportSlicesRow">
    {#each slices as slice (slice.value)}
      <ExportSlice
        on:removeslice
        on:switchslices
        {slice} />
    {/each}
</div>
