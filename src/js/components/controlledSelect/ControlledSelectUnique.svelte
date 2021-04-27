<script>
  import { findIndex } from 'utilities/values';
  import { renderID } from 'utilities/render';
  import { filterSelectOptions } from 'utilities/listFilter';
  import Int from 'components/core/internationalization/Int.svelte';
  import ControlledSelectContainer from './ControlledSelectContainer.svelte';

  export let label;
  export let pick;
  export let name;
  export let options;
  export let theme;
  export let multiple;
  export let grouped;
  export let disabled;
  export let acceptLabel;

  let filter = '';
  let selected = findIndex(options, pick);

  $: filtered = filterSelectOptions(options, filter);

  function onLabelClick(event) {
    const { option } = event.target.dataset;
    if (selected === parseInt(option, 10)) {
      event.preventDefault();
      selected = null;
    }
  }
</script>

<ControlledSelectContainer
  bind:filter
  bind:pick
  bind:selected
  {label}
  {options}
  {theme}
  {multiple}
  {grouped}
  {disabled}
  {acceptLabel}>
    {#each options as option, index}
      <input
        class="txcm-controlledSelectInput"
        type="radio"
        bind:group={selected}
        {name}
        id={renderID(name, option.index || index)}
        value={option.index || index}
        disabled={option.disabled} />
      <label
        for={renderID(name, option.index || index)}
        class="txcm-controlledSelectLabel"
        data-option={option.index || index}
        on:click={onLabelClick}>
          <Int
            key={option.label} />
          <svg
            class="txcm-controlledSelectIcon">
              <use
                xlink:href="#txspt-icons-checkmark" />
          </svg>
      </label>
    {/each}
</ControlledSelectContainer>
