<script>
  import { tick } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import GraphsSticker from './GraphsSticker.svelte';

  const count = getGraphsState('count');
  const step = getGraphsState('step');
  const shift = getGraphsState('shift');

  export let stickers;
  export let scroll;
  export let stepWidth;

  let fragment;

  $: updateStickers($count, $step, stickers);

  function filterSticker(sticker) {
    const { stepStart, stepFinish } = sticker;
    const stepSpace = $count;
    return $step > (stepStart - stepSpace) && $step < (stepFinish + stepSpace);
  }

  async function updateStickers() {
    await tick();
    fragment = stickers.filter(filterSticker);
  }
</script>

{#if fragment}
  {#each fragment as sticker}
    <GraphsSticker
      {sticker}
      {scroll}
      {stepWidth}
      count={$count}
      step={$step}
      shift={$shift} />
  {/each}
{/if}
