<script>
  import Dropdown from 'components/core/dropdown/Dropdown.svelte';

  const RIGHT_MARGIN = 8;

  export let isActive;

  let node;
  let shift = 0;
  let screenWidth;

  $: shift = updateShift(isActive);

  function updateShift() {
    if (isActive && node) {
      const { x } = node.parentNode.getBoundingClientRect();
      const { width } = node.getBoundingClientRect();
      const diff = screenWidth - (x + width + RIGHT_MARGIN);
      if (diff < 0) return `translateX(100%) translateX(${diff}px)`;
      return 'translateX(100%)';
    }
    return 'translateX(0)';
  }
</script>

<Dropdown
  {isActive}
  on:dropdownclose>
    <div
      style="--shift:{shift};"
      on:click|stopPropagation
      on:wheel|stopPropagation
      class="txcm-dropdownDrawer"
      class:txcm-dropdownDrawer-is-opened={isActive}
      bind:this={node}>
        <slot />
    </div>
</Dropdown>
<svelte:window
  bind:innerWidth={screenWidth} />
