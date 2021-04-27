<script>
  import LineGraphSegment from './LineGraphSegment.svelte';

  export let segments;
  export let min;
  export let max;
  export let count;
  export let shift;
  export let height;
  export let padding;

  function shouldDrawSegment(point, index) {
    return segments[index] && segments[index + 1];
  }
</script>

{#each segments as point, index}
  {#if shouldDrawSegment(segments, index)}
    <LineGraphSegment
      {count}
      {shift}
      {height}
      {padding}
      {index}
      {min}
      {max}
      points={[point, segments[index + 1]]} />
  {/if}
{/each}
