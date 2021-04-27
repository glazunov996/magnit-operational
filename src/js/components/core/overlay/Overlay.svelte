<script>
  import { createEventDispatcher } from 'svelte';
  import { focusTrap } from 'utilities/focusTrap';

  export let isActive;

  const dispatch = createEventDispatcher();

  $: updateEvents(isActive);

  function isCloseKey(keyCode) {
    return keyCode === 27;
  }

  function hide() {
    if (isActive) dispatch('overlayclose');
  }

  function onWindowClick() {
    hide();
  }

  function onKeyUp({ keyCode }) {
    if (isCloseKey(keyCode) && isActive) hide();
  }

  function subscribeWindow() {
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keyup', onKeyUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('click', onWindowClick);
    window.removeEventListener('keyup', onKeyUp);
  }

  function updateEvents() {
    if (isActive) subscribeWindow();
    else unsubscribeWindow();
  }
</script>

<div
  use:focusTrap
  class="txcm-overlay"
  class:txcm-overlay-is-visible={isActive}>
    <slot />
</div>
