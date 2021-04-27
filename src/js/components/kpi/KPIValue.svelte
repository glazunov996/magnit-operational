<script>
  /* eslint  unicorn/filename-case: 'off' */

  import KPIValueMain from './KPIValueMain.svelte';
  import KPIValueAdd from './KPIValueAdd.svelte';

  export let units;
  export let valueUnits = 0;
  export let dynamics = 0;
  export let status = false;
</script>

{#if status}
  <KPIValueMain
    {units}
    {valueUnits}
    {dynamics}>
      <slot />
  </KPIValueMain>
{:else}
  <KPIValueAdd
    {dynamics}>
      <slot />
  </KPIValueAdd>
{/if}
