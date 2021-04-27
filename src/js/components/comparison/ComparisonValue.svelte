<script>
  import ComparisonValueMain from './ComparisonValueMain.svelte';
  import ComparisonValueAdd from './ComparisonValueAdd.svelte';

  export let units = 0;
  export let valueUnits = 0;
  export let dynamics = 0;
  export let status = false;
</script>

{#if status}
  <ComparisonValueMain
    {units}
    {valueUnits}
    {dynamics}>
      <slot />
  </ComparisonValueMain>
{:else}
  <ComparisonValueAdd
    {dynamics}>
      <slot />
  </ComparisonValueAdd>
{/if}
