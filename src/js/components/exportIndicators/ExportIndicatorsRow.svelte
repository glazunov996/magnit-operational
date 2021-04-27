<script>
  import ExportIndicator from 'components/exportIndicator/ExportIndicator.svelte';

  export let indicators;
</script>

<div
  class="txcm-exportIndicatorsRow">
    {#each indicators as indicator, index (indicator.id)}
      <ExportIndicator
        on:removeindicator
        {index}
        {indicator} />
    {/each}
</div>
