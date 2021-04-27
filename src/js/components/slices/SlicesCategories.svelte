<script>
  import SlicesCategory from './SlicesCategory.svelte';

  export let data;
  export let tab;
  export let units;
  export let indicator;
  export let isInverted;

  let hasFormats = true;
  let hasRegions = true;
  let hasGroups = true;

  $: ({ formats, regions, groups } = data);

  function shouldRender(options) {
    return options && options.length > 0;
  }
</script>

{#if shouldRender(formats) && hasFormats}
  <SlicesCategory
    bind:hasData={hasFormats}
    label="Форматы"
    data={formats}
    key="formats"
    {isInverted}
    {indicator}
    {units}
    {tab} />
{/if}
{#if shouldRender(regions) && hasRegions}
  <SlicesCategory
    bind:hasData={hasRegions}
    label="Округа"
    data={regions}
    key="regions"
    {isInverted}
    {indicator}
    {units}
    {tab} />
{/if}
{#if shouldRender(groups) && hasGroups}
  <SlicesCategory
    bind:hasData={hasGroups}
    label="Категории"
    data={groups}
    key="groups"
    {isInverted}
    {indicator}
    {units}
    {tab} />
{/if}
