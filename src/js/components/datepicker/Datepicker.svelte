<script>
  import { getContext } from 'svelte';
  import { renderPreciseDate, renderMonthLong, calculateWeekNumber } from 'utilities/date';
  import DatepickerToggle from './DatepickerToggle.svelte';
  import DatepickerContainer from './DatepickerContainer.svelte';
  import DatepickerControls from './DatepickerControls.svelte';
  import { getUIState } from 'state/ui';
  import { generateAvailableDays, calculateDateForPrecision } from 'utilities/date';
  import moment from 'moment';
  import { getDashboardState } from 'state/dashboard';

  export let pick;
  export let precisionPick;
  export let value;
  export let precisionValue;

  export let lowerLimit = null;
  export let upperLimit = null;
  export let mode = 0;
  export let note = null;
  export let disabledAll;
  export let isActive = false;
  export let name;

  const locale = getUIState('locale');
  const appConfig = getContext('app').getAppConfig();
  $: monthOptions = generateMonthOptions($locale, year);
  const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];
  const yearOptions = generateYearOptions();

  let day;
  let month;
  let year;
  let week;
  let quarter;
  let precision;
  let label;

  $: updateValue(year, quarter, month, week, day, precision);
  $: updatePrecisionValue(precision, $locale);
  $: updateLabel(pick, precisionPick, $locale);
  $: updateDatepicker(isActive);
  $: updateDisabled(disabledAll);

  function renderLabel() {
    return renderPreciseDate(pick, precisionPick, $locale);
  }

  function generateMonthOptions() {
    const { dateMin } = appConfig;
    const yearMin = new Date(dateMin).getFullYear() + year;
    const result = [];
    for (let monthShift = 0; monthShift < 12; monthShift += 1) {
      const startOfMonth = moment([yearMin, monthShift]).startOf('month');
      const endOfMonth = moment([yearMin, monthShift]).endOf('month');
      const availDays = generateAvailableDays(startOfMonth.toDate(), endOfMonth.toDate(), precision, name)
      const monthOption = renderMonthLong(Date.UTC(year, monthShift, 1), $locale);
      result.push({
        disabled: !availDays.length,
        month: monthOption
      });
    }   
    return result;
  }

  function generateYearOptions() {
    const { dateMin, dateMax } = appConfig;
    const yearMin = new Date(dateMin).getFullYear();
    const yearMax = new Date(dateMax).getFullYear();
    const diff = yearMax - yearMin;
    const result = [];
    for (let yearShift = 0; yearShift <= diff; yearShift += 1) {
      const yearOption = yearMin + yearShift;
      result.push(yearOption);
    }
    return result;
  }

  function updateDisabled() {
    if (disabledAll) isActive = false;
  }

  function updatePrecisionValue() {
    precisionValue = precision;
  }

  function updateValue() {
    const timestamp = Date.UTC(yearOptions[year], month, precision == 0 ? day : 1);
    const date = new Date(timestamp);    
    value = calculateDateForPrecision(date, precision, week, name);
  }

  function resetValues() {
    const now = new Date(pick);
    const dayValue = now.getDate();
    const monthValue = now.getMonth();
    const yearValue = now.getFullYear();
    day = dayValue;
    month = monthValue;
    year = yearOptions.indexOf(yearValue);
    week = calculateWeekNumber(day, month, yearValue);
    quarter = Math.floor(month / 3);
    precision = precisionPick;
    value = pick;
    precisionValue = precisionPick;
  }

  function updateLabel() {
    precision = precisionPick;
    precisionValue = precisionPick;
    label = renderLabel();
  }

  function updateDatepicker() {
    if (isActive) {
      subscribeWindow();
      resetValues();
    } else unsubscribeWindow();
  }

  function hide() {
    isActive = false;
  }

  function isCloseKey(keyCode) {
    return keyCode === 27;
  }

  function onKeyUp({ keyCode }) {
    if (isCloseKey(keyCode) && isActive) hide();
  }

  function onWindowClick() {
    hide();
  }

  function subscribeWindow() {
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keyup', onKeyUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('click', onWindowClick);
    window.removeEventListener('keyup', onKeyUp);
  }

  resetValues();
</script>

<div
  class="txcm-datepickerHolder">
    <DatepickerToggle
      bind:isActive
      {label}
      {note}
      disabled={disabledAll} />
    <DatepickerContainer
      {isActive}
      {upperLimit}
      {lowerLimit}
      {mode}
      {monthOptions}
      {quarterOptions}
      {yearOptions}
      {name}
      bind:precision
      bind:day
      bind:week
      bind:month
      bind:quarter
      bind:year>
        <DatepickerControls
          {mode}
          bind:precision>
            <slot />
        </DatepickerControls>
    </DatepickerContainer>
</div>
