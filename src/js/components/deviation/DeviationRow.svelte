<script>
  import DeviationLabel from './DeviationLabel.svelte';
  import DeviationCell from './DeviationCell.svelte';

  export let data;
  export let multiple;
  export let indicator;
  export let tab;

</script>

<div
  class="txcm-deviationRow">
    <DeviationLabel
      {multiple}
      {data}
      {indicator}
      {tab} />
    {#if data}
      <DeviationCell
        data={data.column1} />
      <DeviationCell
        data={data.column2} />
    {/if}
</div>
