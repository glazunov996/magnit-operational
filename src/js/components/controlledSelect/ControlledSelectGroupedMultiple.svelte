<script>
  import { renderID } from 'utilities/render';
  import { findGroupedIndexes } from 'utilities/values';
  import { filterSelectGroups } from 'utilities/listFilter';
  import Int from 'components/core/internationalization/Int.svelte';
  import ListGroup from 'components/list/ListGroup.svelte';
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
  let selected = findGroupedIndexes(options, pick);

  $: filtered = filterSelectGroups(options, filter);
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
    {#each filtered as group, index (group.value)}
      <ListGroup
        label={group.label}
        count={options.length}
        length={group.length}>
          {#each group.options as option, optionIndex (option.value)}
            <input
              class="txcm-controlledSelectInput"
              type="checkbox"
              bind:group={selected}
              {name}
              id={renderID(name, `${index}-${optionIndex}`)}
              value={`${index}-${optionIndex}`}
              disabled={option.disabled} />
            <label
              for={renderID(name, `${index}-${optionIndex}`)}
              class="txcm-controlledSelectLabel">
                <Int
                  key={option.label} />
                <svg
                  class="txcm-controlledSelectIcon">
                    <use
                      xlink:href="#txspt-icons-checkmark" />
                </svg>
            </label>
          {/each}
      </ListGroup>
    {/each}
</ControlledSelectContainer>
