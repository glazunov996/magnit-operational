<script>
  import Int from 'components/core/internationalization/Int.svelte';
  
  function handleReload() {
    window.location.reload();
  }

</script>

<div
    class="txcm-reload">
  <div
    class="txcm-background"
  > 
  </div>
  <div
      class="txcm-message">   
    <div>
      <Int key="Сессия разъединена, пожалуйста, обновите страницу"/>
    </div>
    <button
      on:click={handleReload}
      class="txcm-messageButton">
        <Int
          key="Обновить" />
    </button>
  </div>
</div>