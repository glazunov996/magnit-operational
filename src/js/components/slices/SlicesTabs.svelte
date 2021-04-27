<script>
  import { createEventDispatcher } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';

  export let isActive;
  export let showDeviations;

  const dispatch = createEventDispatcher();

  function isAllActive() {
    return isActive && !showDeviations;
  }

  function isDeviationsActive() {
    return isActive && showDeviations;
  }

  function onClickAll() {
    dispatch('tabsall');
  }

  function onClickDeviations() {
    dispatch('tabsdeviations');
  }
</script>

<button
  class="txcm-slicesTab"
  class:txcm-slicesTab-is-active={isAllActive(isActive, showDeviations)}
  on:click={onClickAll}>
    <Int
      key="Все" />
</button>
<button
  class="txcm-slicesTab"
  class:txcm-slicesTab-is-active={isDeviationsActive(isActive, showDeviations)}
  on:click={onClickDeviations}>
    <Int
      key="Отклонения" />
</button>
