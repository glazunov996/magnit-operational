<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let precision;
  export let year;

  export let yearOptions;

  function isActive(index) {
    return precision === 4 && index === year;
  }

  function onOptionClick({ target }) {
    precision = 4;
    year = parseInt(target.dataset.option, 10);
  }
</script>

<ol
  class="txcm-datepickerYears">
    {#each yearOptions as yearOption, index}
      <li
        class="txcm-datepickerYear">
          <button
            class="txcm-datepickerYearButton"
            class:txcm-datepickerYearButton-is-active={isActive(index, year, precision)}
            data-option={index}
            on:click={onOptionClick}>
              <Int
                key={yearOption} />
          </button>
      </li>
    {/each}
</ol>
