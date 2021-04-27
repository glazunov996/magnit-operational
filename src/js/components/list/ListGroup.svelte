<script>
  import Int from 'components/core/internationalization/Int.svelte';
 
  export let label = null;
  export let count;
  export let length;
  export let filter = '';
  export let fixed = false;

  let isOpened = false;

  $: isEmpty = length === 0;
  $: isSingle = fixed || count === 1;
  $: isFiltered = !!filter;
  $: isActive = fixed || isSingle || isOpened || isFiltered;

  function toggle() {
    isOpened = !isOpened;
  }

  function onToggleClick() {
    toggle();
  }
</script>

{#if !isEmpty}
  {#if !isSingle}
    <button
      class="txcm-listGroupToggle"
      class:txcm-listGroupToggle-is-active={isActive}
      on:click={onToggleClick}>
        <Int
          key={label} />
        <svg
          class="txcm-listGroupToggleIcon">
            <use
              xlink:href="#txspt-icons-fatArrow" />
        </svg>
    </button>
  {/if}
  <div
    class="txcm-listGroup"
    class:txcm-listGroup-is-single={isSingle}
    class:txcm-listGroup-is-active={isActive}
    class:txcm-listGroup-is-empty={isEmpty}
    class:txcm-listGroup-is-fixed={fixed}>
      <slot />
  </div>
{/if}
