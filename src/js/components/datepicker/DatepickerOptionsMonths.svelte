<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let precision;
  export let month;
  export let quarter;
  export let year;

  export let lowerLimit;
  export let upperLimit;
  export let highlitedQuarter = null;
  export let monthOptions;
  export let yearOptions;

  $: limits = updateLimits(year, lowerLimit, upperLimit);

  function updateLimits() {
    const lowerLimitDate = new Date(lowerLimit);
    const upperLimitDate = new Date(upperLimit);
    console.log("UPPER", lowerLimitDate, upperLimitDate)
    return {
      year: yearOptions[year],
      lowerLimitYear: lowerLimit ? lowerLimitDate.getFullYear() : -10000,
      lowerLimitMonth: lowerLimit ? lowerLimitDate.getMonth() : -10000,
      upperLimitYear: upperLimit ? upperLimitDate.getFullYear() : 10000,
      upperLimitMonth: upperLimit ? upperLimitDate.getMonth() : 10000,
    };
  }

  function isActive(index) {
    return precision === 2 && index === month;
  }

  function isHighlighted(index) {
    const monthQuarter = Math.floor(index / 3);
    return (precision === 3 && monthQuarter === quarter) || highlitedQuarter === monthQuarter;
  }

  function onOptionClick({ target }) {
    precision = 2;
    month = parseInt(target.dataset.option, 10);
    quarter = Math.floor(month / 3);
  }

  function checkDisabled(option) {    
    const optionMonth = option;
    const isLowerYear = limits.year > limits.upperLimitYear;
    const isUpperYear = limits.year < limits.lowerLimitYear;
    const isLowerMonth = (limits.year === limits.upperLimitYear && optionMonth > limits.upperLimitMonth);
    const isUpperMonth = (limits.year === limits.lowerLimitYear && optionMonth < limits.lowerLimitMonth);
    return isLowerYear || isUpperYear || isLowerMonth || isUpperMonth;
  }
</script>

<ol
  class="txcm-datepickerMonths">
    {#each monthOptions as monthOption, index}
      <li
        class="txcm-datepickerMonth">
          <button
            class="txcm-datepickerMonthButton"
            class:txcm-datepickerMonthButton-is-active={isActive(index, month, precision)}
            class:txcm-datepickerMonthButton-is-highlighted={isHighlighted(index, quarter, precision, highlitedQuarter)}
            data-option={index}
            on:click={onOptionClick}
            disabled={checkDisabled(index, year)}>
              <Int
                key={monthOption.month} />
          </button>
      </li>
    {/each}
</ol>
