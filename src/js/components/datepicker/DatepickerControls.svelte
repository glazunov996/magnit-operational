<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let mode;
  export let precision;

  function isMonthsQuarters() {
    return precision === 2 || precision === 3;
  }

  function isYears() {
    return precision === 4;
  }

  function changePrecision(option) {
    precision = option;
  }

  function onPrecisionClick(event) {
    const option = parseInt(event.target.dataset.option, 10);
    changePrecision(option);
  }
</script>

<div
  class="txcm-datepickerControls">
    {#if mode === 0}
      <button
        class="txcm-datepickerPrecisionControl"
        class:txcm-datepickerPrecisionControl-is-active={isMonthsQuarters(precision)}
        data-option={0}
        on:click={onPrecisionClick}>
          <svg
            class="txcm-datepickerPrecisionControlIcon">
              <use
                xlink:href="#txspt-icons-arrow" />
          </svg>
          <Int
            key="месяц" />
      </button>
    {/if}
    <button
      class="txcm-datepickerPrecisionControl"
      class:txcm-datepickerPrecisionControl-is-active={isYears(precision)}
      data-option={2}
      on:click={onPrecisionClick}>
        <svg
          class="txcm-datepickerPrecisionControlIcon">
            <use
              xlink:href="#txspt-icons-arrow" />
        </svg>
        <Int
          key="год" />
    </button>
    <slot />
</div>
