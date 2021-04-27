<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { renderID } from 'utilities/render';

  export let precision;
  export let precisionOptions = [];
  export let name;
  export let mode;

  function detectStatus(index) {
    return index < (mode * 2);
  }
</script>

<div class="txcm-datepickerPrecision">
  <Int
    key="Грануляция" />
  <ul
    class="txcm-datepickerPrecisionOptions">
      {#each precisionOptions as precisionOption, index}
        <li
          class="txcm-datepickerPrecisionOption">
            <input
              class="txcm-datepickerPrecisionInput"
              id={renderID(`datepickerPrecision${name}`, index)}
              bind:group={precision}
              value={index}
              disabled={detectStatus(index, mode)}
              type="radio" />
            <label
              class="txcm-datepickerPrecisionLabel"
              for={renderID(`datepickerPrecision${name}`, index)}>
                <Int
                  key={precisionOption} />
            </label>
        </li>
      {/each}
  </ul>
</div>
