<script>
  import ComboBarsGraphExtBar from './ComboBarsGraphExtBar.svelte';

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
    <ComboBarsGraphExtBar 
      {count}
      {shift}
      {height}
      {padding}
      {index}
      {min}
      {max}
      data={point}
    />
  {/if}
{/each}