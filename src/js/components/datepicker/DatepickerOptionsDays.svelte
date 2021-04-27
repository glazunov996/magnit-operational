<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { generateDayOptions, calculateWeekNumber } from 'utilities/date';

  export let precision;
  export let day;
  export let week;
  export let month;
  export let year;
  export let name;

  export let yearOptions;

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const maxYear = yearOptions[yearOptions.length - 1];

  $: dayOptions = generateDayOptions(month, yearOptions[year], maxYear, name);

  function findYearOption(value) {
    return yearOptions.indexOf(value);
  }

  function isActive(dayOption, day, precision) {
    const yearOption = findYearOption(dayOption.year);
    return precision === 0 && dayOption.day === day && dayOption.month === month && yearOption === year;
  }

  function isPadding(dayOption) {
    const yearOption = findYearOption(dayOption.year);
    return dayOption.month !== month || yearOption !== year;
  }

  function onOptionClick({ target }) {
    const index = parseInt(target.dataset.option, 10);
    const dayOption = dayOptions[index];
    const yearOption = findYearOption(dayOption.year);
    precision = 0;
    ({ day, month } = dayOption);
    year = yearOption;
    week = calculateWeekNumber(day, month, dayOption.year);
  }
</script>

<ol
  class="txcm-datepickerDayNames">
    {#each dayNames as dayName}
      <li
        class="txcm-datepickerDayName">
          <Int
            key={dayName} />
      </li>
    {/each}
</ol>
<ol
  class="txcm-datepickerDays">
    {#each dayOptions as dayOption, index}
      <li
        class="txcm-datepickerDay">
          <button
            class="txcm-datepickerDayButton"
            class:txcm-datepickerDayButton-is-active={isActive(dayOption, day, precision)}
            class:txcm-datepickerDayButton-is-padding={isPadding(dayOption, month, year)}
            data-option={index}
            disabled={dayOption.disabled}
            on:click={onOptionClick}>
              <Int
                key={dayOption.day} />
          </button>
      </li>
    {/each}
</ol>
