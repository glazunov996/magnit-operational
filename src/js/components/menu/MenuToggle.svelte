<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { getUIState, updateUI } from 'state/ui';

  const menu = getUIState('menu');

  function show() {
    updateUI({ menu: true });
    updateUI({ menuDashNav: false });
  }

  function onToggleClick() {
    if (!$menu) setTimeout(show, 5);
  }
</script>

<button
  class="txcm-menuToggle"
  on:click={onToggleClick}>
    <Int
      key="Меню" />
</button>
