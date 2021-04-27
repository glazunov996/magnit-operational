<script>
  import { createEventDispatcher } from 'svelte';

  export let isActive;

  const dispatch = createEventDispatcher();

  $: updateEvents(isActive);

  function isCloseKey(keyCode) {
    return keyCode === 27;
  }

  function hide() {
    if (isActive) dispatch('dropdownclose');
  }

  function onWindowClick() {
    hide();
  }

  function onKeyUp({ keyCode }) {
    if (isCloseKey(keyCode) && isActive) hide();
  }

  function onWheel() {
    hide();
  }

  function subscribeWindow() {
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel);
  }

  function unsubscribeWindow() {
    window.removeEventListener('click', onWindowClick);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('wheel', onWheel);
  }

  function updateEvents() {
    if (isActive) subscribeWindow();
    else unsubscribeWindow();
  }
</script>

<slot />
