<script>
  import { tick } from 'svelte';
  import { updateFilter, getFilterState } from 'state/filter';
  import Pick from 'components/core/pick/Pick.svelte';
  import Select from 'components/core/select/Select.svelte';
  import Stepper from 'components/core/stepper/Stepper.svelte';
  import Picks from 'components/picks/Picks.svelte';
  import ControlledSelect from 'components/controlledSelect/ControlledSelect.svelte';

  const ELEMENTS = {
    stepper: Stepper,
    pick: Pick,
    picks: Picks,
    select: Select,
    controlledSelect: ControlledSelect,
  };

  const PROPS = {
    stepper: ['cancel', 'options'],
    picks: [],
    pick: ['label', 'value'],
    select: ['label'],
    controlledSelect: ['label'],
  };

  export let element;
  export let options;
  export let disabled;

  const { data } = element;
  const { name } = data;
  const valueStore = getFilterState(name);

  let { pick } = data;

  $: updatePick($valueStore);
  $: updateFilterElement(pick);

  function shouldUpdate() {
    const valueFromStore = $valueStore;
    if (Array.isArray(valueFromStore)) {
      return pick.length !== valueFromStore.length || pick.some((pickValue, index) => pickValue !== valueFromStore[index]);
    }
    return pick !== valueFromStore;
  }

  async function updatePick() {
    await tick();
    if (shouldUpdate()) pick = $valueStore;
  }

  function pickElement(type) {
    if (ELEMENTS[type]) return ELEMENTS[type];
    return ELEMENTS.pick;
  }

  function pickProp(props, propName, elementData) {
    return {
      ...props,
      [propName]: elementData[propName],
    };
  }

  function pickProps() {
    const { type, data: elementData } = element;
    const names = PROPS[type] || PROPS.pick;
    return names.reduce((props, propName) => pickProp(props, propName, elementData), {});
  }

  function updateFilterElement() {
    if (shouldUpdate()) updateFilter({ [name]: pick });
  }
</script>

<svelte:component
  this={pickElement(element.type)}
  {...pickProps(element)}
  {options}
  {name}
  {disabled}
  bind:pick />
