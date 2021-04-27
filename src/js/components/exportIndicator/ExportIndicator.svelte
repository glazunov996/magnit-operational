<script>
  import { createEventDispatcher } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';

  export let index;
  export let indicator;

  const dispatch = createEventDispatcher();

  function onRemoveClick() {
    dispatch('removeindicator', { index });
  }
</script>

<div
  class="txcm-exportIndicator">
    <div
      class="txcm-exportIndicatorLabel">
        <Int
          key={indicator.label} />
        <button
          class="txcm-exportIndicatorRemove"
          on:click={onRemoveClick}>
          <Int
            key="Удалить" />
        </button>
    </div>
</div>
