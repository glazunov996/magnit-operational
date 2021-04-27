<script>
  import DatepickerOptionsYears from './DatepickerOptionsYears.svelte';

  export let precision;
  export let year;

  export let yearOptions;

  function renderStatus() {
    if (precision === 4) return 'txcm-datepickerSection-years-is-active';
    return 'txcm-datepickerSection-years-is-inactive';
  }
</script>

<div
  class={`txcm-datepickerSection ${renderStatus(precision)}`}>
    <DatepickerOptionsYears
      bind:precision
      bind:year
      {yearOptions} />
</div>
