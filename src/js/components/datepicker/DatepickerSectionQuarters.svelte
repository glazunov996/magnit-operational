<script>
  import DatepickerSwitcher from './DatepickerSwitcher.svelte';
  import DatepickerOptionsQuarters from './DatepickerOptionsQuarters.svelte';
  import DatepickerOptionsMonths from './DatepickerOptionsMonths.svelte';

  export let precision;
  export let month;
  export let quarter;
  export let year;
  export let name;

  export let lowerLimit;
  export let upperLimit;
  export let monthOptions;
  export let quarterOptions;
  export let yearOptions;

  let highlitedQuarter;
  let prevPrecision = precision;

  function renderStatus() {
    if (precision > 1 && precision <= 3) {
      if (prevPrecision === 4) {
        prevPrecision = precision;
        return 'txcm-datepickerSection-quarters-is-activeFromLeft';
      } else if (prevPrecision <= 1) {
        prevPrecision = precision;
        return 'txcm-datepickerSection-quarters-is-activeFromRight';
      }
      prevPrecision = precision;
      return 'txcm-datepickerSection-quarters-is-active';
    } else if (prevPrecision > 1 && prevPrecision <= 3) {
      prevPrecision = precision;
      if (precision === 4) return 'txcm-datepickerSection-quarters-is-inactiveToLeft';
      return 'txcm-datepickerSection-quarters-is-inactiveToRight';
    }
    prevPrecision = precision;
    return 'txcm-datepickerSection-quarters-is-inactive';
  }
</script>

<div
  class={`txcm-datepickerSection ${renderStatus(precision)}`}>
    <DatepickerSwitcher
      bind:precision
      bind:pick={year}
      options={yearOptions}
      precisionOption={4} />
    <DatepickerOptionsQuarters
      bind:precision
      bind:month
      bind:quarter
      bind:highlitedQuarter
      {name}
      {year}
      {lowerLimit}
      {upperLimit}
      {yearOptions}
      {quarterOptions} />
    <DatepickerOptionsMonths
      bind:precision
      bind:month
      bind:quarter
      {name}
      {year}
      {lowerLimit}
      {upperLimit}
      {highlitedQuarter}
      {yearOptions}
      {monthOptions} />
</div>
