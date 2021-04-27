<script>
  /* eslint  unicorn/filename-case: 'off' */
  import { getDashboardState } from 'state/dashboard';
  import DeviationRow from 'components/deviation/DeviationRow.svelte';

  export let data;
  export let indicator;

  const units = getDashboardState('units');

  $: ({ formatDeviations, regionDeviations } = data);

  function hasDeviations(key) {
    return key && key.countDeviation > 0;
  }
</script>

{#if hasDeviations(formatDeviations)}
  <DeviationRow
    multiple="форматам"
    data={formatDeviations}
    {indicator}
    tab="formats" />
{/if}
{#if hasDeviations(regionDeviations)}
  <DeviationRow
    multiple="регионам"
    data={regionDeviations}
    {indicator}
    tab="regions" />
{/if}
