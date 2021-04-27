<script>
  import { getContext } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import { calculateQuarter } from 'utilities/date';
  import moment from 'moment';
  import { generateAvailableDays } from 'utilities/date';
  

  export let precision;
  export let month;
  export let quarter;
  export let year;

  export let lowerLimit;
  export let upperLimit;
  export let highlitedQuarter = null;
  export let yearOptions;
  export let quarterOptions;
  export let name;

  const appConfig = getContext('app').getAppConfig();

  $: limits = updateLimits(year, lowerLimit, upperLimit);
  $: newQuarterOptions = updateQuarter(year, quarterOptions, name)

  function updateQuarter() {
    const opts = [];
    const { dateMin } = appConfig;
    const yearMin = new Date(dateMin).getFullYear() + year;
    for (let index = 0; index < 4; ++index) {
      const startOfQuarter = moment([yearMin, index * 3]).startOf('quarter');
      const endOfQuarter = moment([yearMin, index * 3]).endOf('quarter');
      const availDays = generateAvailableDays(startOfQuarter.toDate(), endOfQuarter.toDate(), precision, name);
      opts.push({
        disabled: !availDays.length,
        name: quarterOptions[index]
      })
    }
    return opts;
  }

  function updateLimits() {
    return {
      year: yearOptions[year],
      lowerLimitYear: lowerLimit ? new Date(lowerLimit).getFullYear() : -10000,
      lowerLimitQuarter: lowerLimit ? calculateQuarter(lowerLimit) : -10000,
      upperLimitYear: upperLimit ? new Date(upperLimit).getFullYear() : 10000,
      upperLimitQuarter: upperLimit ? calculateQuarter(upperLimit) : 10000,
    };
  }

  function isActive(index) {
    return precision === 3 && index === quarter;
  }

  function onOptionClick({ target }) {
    precision = 3;
    quarter = parseInt(target.dataset.option, 10);
    month = quarter * 3;
  }

  function onOptionMouseOver({ target }) {
    highlitedQuarter = parseInt(target.dataset.option, 10);
  }

  function onOptionMouseOut() {
    highlitedQuarter = null;
  }

  function checkDisabled(option) {
    const optionQuarter = option + 1;
    const isLowerYear = limits.year > limits.upperLimitYear;
    const isUpperYear = limits.year < limits.lowerLimitYear;
    const isLowerQuarter = (limits.year === limits.upperLimitYear && optionQuarter > limits.upperLimitQuarter);
    const isUpperQuarter = (limits.year === limits.lowerLimitYear && optionQuarter < limits.lowerLimitQuarter);
    return isLowerYear || isUpperYear || isLowerQuarter || isUpperQuarter;
  }

</script>

<ol
  class="txcm-datepickerQuarters">
    {#each newQuarterOptions as quarterOption, index}
      <li
        class="txcm-datepickerQuarter">
          <button
            class="txcm-datepickerQuarterButton"
            class:txcm-datepickerQuarterButton-is-active={isActive(index, quarter, precision)}
            data-option={index}
            on:click={onOptionClick}
            on:mouseover={onOptionMouseOver}
            on:mouseout={onOptionMouseOut}
            disabled={checkDisabled(index, year)}
           >
              <Int
                key={quarterOption.name} />
          </button>
      </li>
    {/each}
</ol>
