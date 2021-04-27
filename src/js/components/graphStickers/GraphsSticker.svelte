<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let sticker;
  export let scroll;
  export let shift;
  export let count;
  export let step;
  export let stepWidth;

  let stepStart;
  let stepFinish;
  let stepsSpace;

  $: updateSticker(sticker);
  $: relativeShift = updateRelativeShift(step, shift);

  function updateSticker() {
    ({ stepStart, stepFinish } = sticker);
    stepsSpace = stepFinish - stepStart;
  }

  function shouldShow() {
    return step < stepStart;
  }

  function shouldStick() {
    return step >= stepStart && step < stepFinish;
  }

  function show() {
    return -scroll;
  }

  function stick() {
    return (stepWidth * (step - stepStart)) - scroll - shift;
  }

  function hide() {
    return (stepWidth * stepsSpace) - scroll;
  }

  function updateRelativeShift() {
    if (shouldShow()) return show();
    else if (shouldStick()) return stick();
    return hide();
  }
</script>

<div
  class="txcm-graphScaleDateSticker"
  style="left: {(100 / count) * stepStart}%; width: {100 / count}%; transform: translateX({relativeShift}px);">
    <Int
      key={sticker.label} />
</div>
