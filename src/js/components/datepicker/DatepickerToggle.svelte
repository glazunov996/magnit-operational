<script>
  export let label;
  export let note = null;
  export let disabled = false;
  export let isActive;

  function renderToggleNote() {
    if (note) return ` (${note})`;
    return '';
  }

  function show() {
    isActive = true;
  }

  function onToggleClick() {
    if (!isActive) setTimeout(show, 5);
  }
</script>

<button
  class="txcm-datepickerToggle"
  class:txcm-datepickerToggle-is-active={isActive}
  on:click={onToggleClick}
  {disabled}>
    {label}
    {renderToggleNote(note)}
    <svg
      class="txcm-datepickerToggleIcon">
        <use
          xlink:href="#txspt-icons-fatArrow" />
    </svg>
</button>
