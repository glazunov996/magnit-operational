<script>
  import SliceLabel from './SliceLabel.svelte';
  import SliceRow from './SliceRow.svelte';
  import SliceCell from './SliceCell.svelte';
  import SliceGraph from './SliceGraph.svelte';

  export let row;
  export let units;
  export let indicator;
  export let isInverted;

  $: hasGraph = !!row.graphs;
  $: sortGraphs(row);

  function sortGraph(graph1, graph2) {
    if (graph1.name > graph2.name) return 1;
    else if (graph1.name < graph2.name) return -1;
    return 0;
  }

  function sortGraphCategory(category) {
    category.data.sort(sortGraph);
  }

  function sortGraphs() {
    if (row && row.graphs) {
      row.graphs.series.forEach(sortGraphCategory);
    }
  }
</script>

<SliceRow
  {hasGraph}>
    {#if row}
      <SliceLabel
        label={row.name} />
      <SliceCell
        {indicator}
        {units}
        data={row.column1} 
      />
      <SliceCell
        {indicator}
        {units}
        data={row.column2} 
      />
      {#if hasGraph}
        <SliceGraph
          {isInverted}
          {indicator}
          data={row.graphs} />
      {/if}
    {/if}
</SliceRow>
