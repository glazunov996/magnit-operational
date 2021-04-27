<script>

  import formatLabel from 'utilities/formatLabel';

  export let min;
  export let max;
  export let isCompact;
  export let units;
  export let indicator;

  $: average = Math.round(((max + min) / 2) * 10000) / 10000;
  $: base = indicator.id != '4' ? 1000000.0 : 1.0;

</script>

<div
  class="txcm-linearGraphLabels"
  class:txcm-linearGraphLabels-is-compact={isCompact}>
    <div
      class="txcm-linearGraphLabel">
        { Math.abs(max) <= 0.00001 ? 0 : formatLabel(max, units, '%', base)}
    </div>
    <div
      class="txcm-linearGraphLabel">
        { Math.abs(average) <= 0.00001 ? 0 : formatLabel(average, units, '%', base)}
    </div>
    <div
      class="txcm-linearGraphLabel">
        { Math.abs(min) <= 0.00001 ? 0 : formatLabel(min, units, '%', base)}
    </div>
</div>

