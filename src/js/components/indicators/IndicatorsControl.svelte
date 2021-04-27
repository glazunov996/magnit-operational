<script>
  import { onDestroy } from 'svelte';
  import { renderID } from 'utilities/render';
  import { shiftVertical } from 'utilities/transitions';
  import { updateIndicators, subscribeIndicators, getIndicatorsData } from 'state/indicators';
  import Int from 'components/core/internationalization/Int.svelte';

  export let id;
  export let label;
  export let note = '';
  export let status;
  export let value;
  export let exclude = false;

  const htmlID = renderID('indicatorToggle', id);

  let checked = getIndicatorsData(id) || status;

  const unsubscribeIndicator = subscribeIndicators(id, onIndicatorUpdate);

  $: updateIndicatorValue(checked);

  onDestroy(unsubscribeIndicator);

  function onIndicatorUpdate(update) {
    checked = update;
  }

  function updateIndicatorValue() {
    updateIndicators({ [id]: checked });
  }
</script>

{#if !exclude || (exclude && !checked)}
  <input
    class="txcm-indicatorsInput"
    type="checkbox"
    bind:checked
    id={htmlID}
    {value}>
  <label
    class="txcm-indicatorsControl"
    for={htmlID}
    transition:shiftVertical={{ height: 32 }}>
      <Int
        key={label} />
      {#if note}
        <span
          class="txcm-indicatorsNote">
            <Int
              key={note} />
        </span>
      {/if}
      <svg
        class="txcm-indicatorsControlIcon"
        class:txcm-indicatorsControlIcon-is-visible={checked}>
          <use
            xlink:href="#txspt-icons-checkmark" />
      </svg>
  </label>
{/if}
