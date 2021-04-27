<script>
  import DatepickerSectionMonth from './DatepickerSectionMonth.svelte';
  import DatepickerSectionQuarters from './DatepickerSectionQuarters.svelte';
  import DatepickerSectionYears from './DatepickerSectionYears.svelte';

  const LEFT_MARGIN = 16;

  export let isActive;

  export let precision;
  export let day;
  export let week;
  export let month;
  export let quarter;
  export let year;
  export let name;

  export let mode;
  export let lowerLimit;
  export let upperLimit;
  export let monthOptions;
  export let quarterOptions;
  export let yearOptions;

  let node;
  let shift = 0;
  let screenWidth;

  $: updateShift(isActive);

  function updateShift() {
    if (isActive && node) {
      const rect = node.getBoundingClientRect();
      const { x } = rect;
      shift = x < 0 ? `translateX(${-x + LEFT_MARGIN}px)` : 'translateX(0)';
    }
  }
</script>

<div
  class="txcm-datepickerContainer"
  class:txcm-datepickerContainer-is-active={isActive}
  style="--shift:{shift};"
  on:click|stopPropagation
  bind:this={node}>
    <div
      class="txcm-datepickerSections">
        {#if mode === 0}
          <DatepickerSectionMonth
            bind:precision
            bind:day
            bind:week
            bind:month
            bind:year
            {name}
            {lowerLimit}
            {upperLimit}
            {monthOptions}
            {yearOptions} />
        {/if}
        {#if mode <= 1}
          <DatepickerSectionQuarters
            bind:precision
            bind:month
            bind:quarter
            bind:year
            {name}
            {lowerLimit}
            {upperLimit}
            {monthOptions}
            {quarterOptions}
            {yearOptions} />
        {/if}
        {#if mode === 0}
          <DatepickerSectionYears
            bind:precision
            bind:year
            {yearOptions} />
        {/if}
    </div>
    <slot />
</div>
<svelte:window
  bind:innerWidth={screenWidth} />
