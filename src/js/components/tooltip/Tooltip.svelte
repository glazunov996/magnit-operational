<script>
  import { getUIState } from 'state/ui';

  const tooltip = getUIState('tooltip');
  const scrollY = getUIState('scrollY');

  let isActive;
  let showTimeout;

  $: style = updateStyle($tooltip);
  $: updateStatus($tooltip);

  function show() {
    showTimeout = setTimeout(() => { isActive = true; }, 100);
  }

  function hide() {
    isActive = false;
  }

  function updateStatus() {
    clearTimeout(showTimeout);
    if ($tooltip) show();
    else hide();
  }

  function updateStyle() {
    if ($tooltip) return `transform: translate(${$tooltip.position.x}px, ${$tooltip.position.y + $scrollY}px)`;
    return '';
  }

  function renderSideClass() {
    if (isActive) {
      if ($tooltip.side === 'bottom') return ' txcm-tooltip-is-bottom';
      else if ($tooltip.side === 'right') return ' txcm-tooltip-is-right';
      else if ($tooltip.side === 'left') return ' txcm-tooltip-is-left';
      return ' txcm-tooltip-is-top';
    }
    return '';
  }

  function renderThemeClass() {
    if (isActive && $tooltip.theme) return ` ${$tooltip.theme}`;
    return '';
  }

  function onScroll() {
    hide();
  }
</script>

<div
  class={`txcm-tooltip${renderSideClass(isActive)}${renderThemeClass(isActive)}`}
  class:txcm-tooltip-is-active={isActive}
  {style}>
    <div class="txcm-tooltipContent">
      {#if $tooltip && $tooltip.content}
        {#if $tooltip.content.component}
          <svelte:component
            this={$tooltip.content.component}
            data={$tooltip.content.data} />
        {:else}
          {$tooltip.content}
        {/if}
      {/if}
    </div>
</div>
<svelte:window
  on:scroll={onScroll} />
