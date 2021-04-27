<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { getUIState } from 'state/ui';
  import { translate } from 'utilities/dictionary';

  export let value;
  export let theme = '';

  const locale = getUIState('locale');
  
  $: searchLabel = translate("Поиск", $locale);

  function onCancelClick() {
    value = '';
  }
</script>

<form
  class={`txcm-listFilter ${theme}`}
  on:submit|preventDefault>
    <svg
      class="txcm-listFilterIcon">
        <use
          xlink:href="#txspt-icons-search" />
    </svg>
    <input
      class="txcm-listFilterInput"
      type="search"
      placeholder={searchLabel}
      bind:value>
    <button
      class="txcm-listFilterCancel"
      type="button"
      on:click={onCancelClick}>
        <Int
          key="Сбросить" />
    </button>
</form>
