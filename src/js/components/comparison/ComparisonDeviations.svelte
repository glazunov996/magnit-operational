<script>
  import DeviationRow from 'components/deviation/DeviationRow.svelte';

  export let data;

  $: ({ formatDeviations, regionDeviations } = data);
</script>

{#if formatDeviations}
  <DeviationRow
    multiple="форматам"
    key="formatName"
    data={formatDeviations} />
{/if}
{#if regionDeviations}
  <DeviationRow
    multiple="регионам"
    key="regionName"
    data={regionDeviations} />
{/if}
