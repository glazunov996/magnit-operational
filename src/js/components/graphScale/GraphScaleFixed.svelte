<script>
  import { tick } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import Int from 'components/core/internationalization/Int.svelte';

  const count = getGraphsState('count');
  const step = getGraphsState('step');
  const shift = getGraphsState('shift');

  export let options;

  let fragment;
  let dummy;

  $: updateScale($count, $step, options);

  function updateDummy() {
    const index = $count + $step;
    if (options[index]) return options[index].label;
    return '';
  }

  function updateFragments() {
    if ($count >= options.length) return options;
    return options.slice($step, ($step + $count));
  }

  async function updateScale() {
    await tick();
    fragment = updateFragments();
    dummy = updateDummy();
  }
</script>

{#if fragment}
  <div
    class="txcm-graphScale"
    style="--dummyWidth: {100 / $count}%;transform: translateX({$shift}px);"
    data-dummy={dummy}>
      {#each fragment as option}
        <div
          class="txcm-graphScaleFixedOption">
            <div
              class="txcm-graphScaleFixedOptionText">
                <Int
                  key={option.label} />
            </div>
        </div>
      {/each}
  </div>
{/if}
