<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { renderID } from 'utilities/render';

  export let label;
  export let selected;
  export let highlighted;
  export let name;
  export let index;
  export let value;
  export let disabled = false;
  export let isActive;

  const id = renderID(name, index);

  let node;

  $: updateEvents(isActive);
  $: scrollPickIntoView(selected);
  $: scrollActiveIntoView(isActive);
  $: scrollHighlightIntoView(highlighted);

  function scrollPickIntoView() {
    if (node && selected === value) node.scrollIntoView({ block: 'nearest' });
  }

  function scrollHighlightIntoView() {
    if (node && highlighted === index) node.scrollIntoView({ block: 'nearest' });
  }

  function scrollActiveIntoView() {
    if (node && isActive && selected === value) node.scrollIntoView({ block: 'center' });
  }

  function isHighlighted() {
    return highlighted === index;
  }

  function onOptionClick(event) {
    if (selected === value) {
      event.preventDefault();
      selected = null;
    }
  }

  function onMouseOver({ target }) {
    highlighted = parseInt(target.dataset.option, 10);
  }

  function subscribeClick() {
    if (node) {
      node.addEventListener('click', onOptionClick);
      node.addEventListener('mouseover', onMouseOver);
    }
  }

  function unsubscribeClick() {
    if (node) {
      node.removeEventListener('click', onOptionClick);
      node.removeEventListener('mouseover', onOptionClick);
    }
  }

  function updateEvents() {
    if (isActive) subscribeClick();
    else unsubscribeClick();
  }
</script>

<li
  class="txcm-selectOption">
    <input
      class="txcm-selectInput"
      type="radio"
      bind:group={selected}
      {name}
      {id}
      {disabled}
      value={index}>
    <label
      class="txcm-selectLabel"
      class:txcm-selectLabel-is-highlighted={isHighlighted(highlighted)}
      for={id}
      data-option={index}
      bind:this={node}>
        <Int
          key={label} />
    </label>
</li>
