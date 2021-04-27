<script>
  import { onDestroy } from 'svelte';
  import { renderID } from 'utilities/render';
  import { shiftVertical } from 'utilities/transitions';
  import { updateComparisonIndicators, subscribeComparisonIndicators, getComparisonIndicatorsData } from 'state/comparisonIndicators';
  import Int from 'components/core/internationalization/Int.svelte';

  export let id;
  export let label;
  export let value;
  export let exclude = false;

  const htmlID = renderID('comparisonIndicatorToggle', id);

  let checked = getComparisonIndicatorsData(id) || true;

  const unsubscribeIndicator = subscribeComparisonIndicators(id, onComparisonIndicatorUpdate);

  $: updateComparisonIndicatorValue(checked);

  onDestroy(unsubscribeIndicator);

  function onComparisonIndicatorUpdate(update) {
    checked = update;
  }

  function updateComparisonIndicatorValue() {
    updateComparisonIndicators({ [id]: checked });
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
      <svg
        class="txcm-indicatorsControlIcon"
        class:txcm-indicatorsControlIcon-is-visible={checked}>
          <use
            xlink:href="#txspt-icons-checkmark" />
      </svg>
  </label>
{/if}
