<script>
  import Factors from 'components/factors/Factors.svelte';
  import Overview from 'components/overview/Overview.svelte';
  import Slices from 'components/slices/Slices.svelte';
  import Comparisons from 'components/comparisons/Comparisons.svelte';
  import Export from 'components/export/Export.svelte';

  export let data;
  export let filterData;
  export let units;
  export let dashboard;
  export let indicator;
  export let detail;
  export let conditions;

</script>

{#if detail}
  {#if detail === 'comparisons'}
    <Comparisons
      {indicator}
      {data} />
  {:else}
    <Factors
      {indicator}
      {dashboard}
      {data} />
  {/if}
{:else if indicator === 'export'}
  <Export
    data={filterData}
    {dashboard}
    {conditions} />
{:else if indicator}
  <Slices
    {dashboard}
    {indicator}
    {data} />
{:else}
  <Overview
    {dashboard}
    {units}
    {data} />
{/if}
