<script>
  import { tick } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import Int from 'components/core/internationalization/Int.svelte';

  const count = getGraphsState('count');
  const step = getGraphsState('step');
  const shift = getGraphsState('shift');

  export let generator;

  let fragment;
  let dummy;

  $: updateScale($count, $step, generator);

  function updateDummy(values) {
    return values[$count] ? values[$count].label : '';
  }

  function updateFragments(values) {
    return values.slice(0, -1);
  }

  async function updateScale() {
    const values = generator();
    await tick();
    dummy = updateDummy(values);
    fragment = updateFragments(values);
  }
</script>

{#if fragment}
  <div
    class="txcm-graphScale"
    style="--dummyWidth: {100 / $count}%;transform: translateX({$shift}px);"
    data-dummy={dummy}>
      {#each fragment as option}
        <div
          class="txcm-graphScaleDateOption">
            <div
              class="txcm-graphScaleDateOptionText">
                <Int
                  key={option.label} />
            </div>
        </div>
      {/each}
  </div>
{/if}
