<script>
  import LineGraphPoint from './LineGraphPoint.svelte';

  export let points;
  export let min;
  export let max;
  export let count;
  export let shift;
  export let height;
  export let padding;
</script>

{#each points as point, index}
  {#if point}
    <LineGraphPoint
      {count}
      {shift}
      {height}
      {padding}
      {index}
      {min}
      {max}
      data={point} />
  {/if}
{/each}
