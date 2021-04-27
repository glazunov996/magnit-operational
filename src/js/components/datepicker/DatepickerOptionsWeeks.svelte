<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { generateWeekNumbers } from 'utilities/date';

  export let precision;
  export let day;
  export let week;
  export let month;
  export let year;
  export let name;

  export let yearOptions;

  $: weekNumbers = generateWeekNumbers(day, month, yearOptions[year], name);

  function isActive(weekNumber, week, precision) {
    return precision === 1 && weekNumber === week;
  }

  function onButtonClick({ target }) {
    const option = parseInt(target.dataset.option, 10);
    precision = 1;
    week = option;
  }
</script>

<div class="txcm-datepickerWeekLabel">
  W
</div>
<ol class="txcm-datepickerWeekNumbers">
  {#each weekNumbers as weekNumber}
    <li
      class="txcm-datepickerWeekNumber">
        <button
          class="txcm-datepickerWeekNumberButton"
          class:txcm-datepickerWeekNumberButton-is-active={isActive(weekNumber.number, week, precision)}
          data-option={weekNumber.number}
          disabled={weekNumber.disabled}
          on:click={onButtonClick}>
            <Int
              key={weekNumber.number} />
        </button>
    </li>
  {/each}
</ol>
