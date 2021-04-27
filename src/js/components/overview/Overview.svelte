<script>
  import OverviewTableHeader from './OverviewTableHeader.svelte';
  import OverviewIndicators from './OverviewIndicators.svelte';

  export let data = null;
  export let dashboard;
  export let units = null;

  let overviewData;

  $: updateData(data);

  function updateData() {
    overviewData = data || null;
  }
</script>

<section
  class="txcm-overviewSection">
    <OverviewTableHeader
      {dashboard} />
    {#if overviewData}
      <OverviewIndicators
        data={overviewData}
        {units} />
    {/if}
</section>
