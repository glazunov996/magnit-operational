<script>
  import { getGraphsState } from 'state/graphs';
  import LineGraph from 'components/lineGraph/LineGraph.svelte';

  export let data;

  const step = getGraphsState('step');
  const count = getGraphsState('count');
  const highlighted = getGraphsState('highlighted');
  const shift = getGraphsState('shift');
</script>

<div
  class="txcm-comparisonGraph"
  style="--highlightWidth: {100 / $count}%; --highlightPosition: {100 * $highlighted}%; --highlightOpacity: {$highlighted === null ? 0 : 1}; --highlightShift: {$shift}px">
    <div
      class="txcm-comparisonGraphHolder">
        <LineGraph
          data={data.chart}
          count={$count}
          step={$step}
          shift={$shift} />
    </div>
</div>
