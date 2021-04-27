<script>
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { createEventDispatcher } from 'svelte';
  import { getUIState } from 'state/ui';

  const dispatch = createEventDispatcher();

  const updating = getUIState('updating');

  export let to;
  export let partial = false;
  export let linkClass;

  $: disabled = $updating > 0

  function isCurrentLink(isCurrent, isPartiallyCurrent) {
    return isCurrent || (partial && isPartiallyCurrent);
  }

  function getProps({ isCurrent, isPartiallyCurrent }) {
    if (isCurrentLink(isCurrent, isPartiallyCurrent)) return { class: `${linkClass} ${linkClass}-is-active` };
    return { class: linkClass };
  }

  function handleClick() {
    dispatch('click')
  }

</script>

<a
  on:click={handleClick}
  use:link
  class={ !disabled ? `${linkClass}` : `${linkClass}-is-disabled`}
  use:active={{className: `${linkClass} ${linkClass}-is-active`, inactiveClassName: `${linkClass}`}}
  href={to}
>
  <slot />
</a>
