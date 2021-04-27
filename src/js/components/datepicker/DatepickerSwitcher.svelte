<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let precision;
  export let options;
  export let pick = 0;
  export let precisionOption;

  const max = options.length - 1;

  function onPrevClick() {
    pick = Math.max(0, pick - 1);
  }

  function onNextClick() {
    pick = Math.min(max, pick + 1);
  }

  function onPrecisionClick() {
    precision = precisionOption;
  }
</script>

<div
  class="txcm-datepickerSwitcher">
    <button
      class="txcm-datepickerPrecisionOption"
      on:click={onPrecisionClick}>
        <Int
          key={options[pick]} />
    </button>
    <button
      class="txcm-datepickerSwitcherPrev"
      class:txcm-datepickerSwitcherPrev-is-inactive={pick === 0}
      on:click={onPrevClick}>
        <Int
          key="Предыдущая опция" />
        <svg
          class="txcm-datepickerSwitcherPrevIcon">
            <use
              xlink:href="#txspt-icons-angleArrow" />
        </svg>
    </button>
    <button
      class="txcm-datepickerSwitcherNext"
      class:txcm-datepickerSwitcherNext-is-inactive={pick === max}
      on:click={onNextClick}>
        <Int
          key="Следующая опция" />
        <svg
          class="txcm-datepickerSwitcherNextIcon">
            <use
              xlink:href="#txspt-icons-angleArrow" />
        </svg>
    </button>
</div>
