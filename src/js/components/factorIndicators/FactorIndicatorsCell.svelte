<script>
  export let base;
  export let comparison;
  export let bridge;

  let shift;

  $: calculateValues(base, comparison);

  function calculateRatio() {
    return comparison / base;
  }

  function calculateShift(ratio) {
    return bridge < 0 ? (1 / ratio) * 100 : 100;
  }

  function calculateValues() {
    const ratio = calculateRatio(base, comparison);
    shift = calculateShift(ratio);
  }
</script>

<div
  class="txcm-factorsTotalDiagramIndicatorHolder">
    <div
      class="txcm-factorsTotalDiagramIndicator"
      style="--shift: {shift}%" />
</div>
