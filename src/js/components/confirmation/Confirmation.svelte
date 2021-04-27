<script>
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte';
  import Overlay from 'components/core/overlay/Overlay.svelte';

  const confirmation = getUIState('confirmation');

  let header = '';
  let message = '';
  let cancel;

  $: isActive = !!$confirmation;
  $: updateUI(isActive);

  function updateUI() {
    if (isActive) {
      ({ header, message } = $confirmation);
      if (cancel && isActive) cancel.focus();
    }
  }

  function close() {
    $confirmation = null;
  }

  function onCancelClick() {
    if ($confirmation.cancel) $confirmation.cancel();
    close();
  }

  function onAcceptClick() {
    $confirmation.action();
    close();
  }

  function onOverlayClose() {
    close();
  }
</script>

<Overlay
  {isActive}
  on:overlayclose={onOverlayClose}>
    <div
      class="txcm-confirmation"
      class:txcm-confirmation-is-active={isActive}
      on:click|stopPropagation>
        <div
          class="txcm-confirmationHeader">
            <Int
              key={header} />
        </div>
        <div
          class="txcm-confirmationMessage">
            <Int
              key={message} />
        </div>
        <button
          bind:this={cancel}
          class="txcm-confirmationCancel"
          on:click={onCancelClick}>
            <Int
              key="Отмена" />
        </button>
        <button
          class="txcm-confirmationAccept"
          on:click={onAcceptClick}>
            <Int
              key="Удалить" />
        </button>
    </div>
</Overlay>
