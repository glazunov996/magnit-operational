<script>
  import FilterElement from './FilterElement.svelte';

  export let group;
  export let options;
  export let disabled;

  const { options: elements } = group;

  function generateEmptyElementOptions({ type }) {
    if (type === 'pick') return null;
    return [];
  }

  function findElementOptions({ type, data }) {
    const elementData = options.find(element => element.key === data.name);
    if (!elementData) return generateEmptyElementOptions(type);
    return elementData.data;
  }

  function generateElementOptions(element) {
    if (!options) return generateEmptyElementOptions(element);
    return findElementOptions(element);
  }
</script>

<div class="txcm-filterGroup">
  {#each elements as element}
    <FilterElement
      {element}
      {disabled}
      options={generateElementOptions(element, options)} />
  {/each}
</div>
