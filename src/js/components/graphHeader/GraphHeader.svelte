<script>
  import { onMount, getContext, tick } from 'svelte';
  import { getUIState } from 'state/ui';
  import { getDashboardState } from 'state/dashboard';
  import { getGraphsState } from 'state/graphs';
  import {
    calculateDatePoP,
    calculateWeekNumber,
    calculateYearWeekCount,
    calculateDatesMonthsCount,
    calculateDatesQuartersCount,
    calculateQuartersRestCount,
    calculateDatesYearsCount,
    calcuateMonthDayCount,
    generateYearsWeekCache,
    generateYearsWeekRangeCache,
    renderMonthShort,
    renderMonthLong,
    subtractDays,
    subtractWeeks,
    DAY,
  } from 'utilities/date';
  import GraphScaleDate from 'components/graphScale/GraphScaleDate.svelte';
  import GraphScaleFixed from 'components/graphScale/GraphScaleFixed.svelte';
  import GraphStickers from 'components/graphStickers/GraphStickers.svelte';
  import GraphHeaderScrollTrack from './GraphHeaderScrollTrack.svelte';
  import { translate } from 'utilities/dictionary';

  const locale = getUIState('locale');

  const SCALE_FIXED_VALUES = ['graphModeCounty', 'graphModeFormat', 'graphModeCategory'];
  const SCALE_FIXED_OPTION_WIDTHS = {
    graphModeCounty: 90,
    graphModeFormat: 50,
    graphModeCategory: 90,
  };
  const SCALE_DATE_OPTION_WIDTHS = {
    graphDetailDay: 40,
    graphDetailAvgCheck: 40,
    graphDetailWeek: 40,
    graphDetailMonth: 50,
    graphDetailQuarter: 70,
    graphDetailYear: 40,
  };
  const SCALE_DAYS_COUNT = 30;
  const SCALE_WEEKS_COUNT = 11;

  const sectionScrollX = getUIState('sectionScrollX');
  const date = getDashboardState('date');
  const appConfig = getContext('app').getAppConfig();
  const graphConfig = appConfig.graphs;
  const { dateMin, dateMax } = appConfig;
  const fixedOptions = flattenFixedOptions();
  const mode = getGraphsState('mode');
  const dynamics = getGraphsState('dynamics');
  const count = getGraphsState('count');
  const step = getGraphsState('step');
  const highlighted = getGraphsState('highlighted');
  const shift = getGraphsState('shift');
  const status = getGraphsState('status');
  const weeksCache = generateYearsWeekCache(dateMin, dateMax);
  const weekRangesCache = generateYearsWeekRangeCache(dateMin, dateMax, weeksCache);
  
  const optionWidthMax = getGraphsState('optionWidthMax');
  const scroll = getGraphsState('scroll');
  const scrollMax = getGraphsState('scrollMax');

  let node;
  let width;
  let top;
  let left;
  let pointer = null;
  let pointerPositionStart;
  let pointerScrollStart;
  let pointerPositionCurrent;
  let isPointDown = false;

  $: datePoP = calculateDatePoP($date, $dynamics);
  $: optionWidthBase = pickOptionWidthBase($mode, $dynamics, $date, datePoP);
  $: options = pickOptions($mode, $dynamics, $date, datePoP, $locale);
  $: generator = pickGenerator($dynamics, $locale);
  $: stickers = generateStickers($dynamics, $date, datePoP, $locale);
  $: $count = calculateCount($dynamics, width, options, $date, datePoP);
  $: $status = updateStatus($scroll, $scrollMax);
  $: stepMax = updateStepMax($count, options);
  $: updateScrollLimits($count, width, options);
  $: resetStep($mode, $dynamics, $date, datePoP);
  $: updateStep($scroll);
  $: updateHighighted(pointer, $optionWidthMax);
  $: resetScroll($mode, $dynamics, $date, datePoP);
  $: measureComponent($sectionScrollX);

  onMount(measureComponent);

  function isHaveScroll() {
    return stepMax > 0;
  }

  function isFixedScale() {
    return SCALE_FIXED_VALUES.includes($mode);
  }

  function isDaysOption() {
    return $dynamics === graphConfig.dynamics[0].value;
  }

  function isWeeksOption() {
    return $dynamics === graphConfig.dynamics[1].value;
  }

  function isMonthsOption() {
    return $dynamics === graphConfig.dynamics[2].value;
  }

  function isQuartersDaysOption() {
    return $dynamics === graphConfig.dynamics[3].value;
  }

  function measureComponent() {
    if (node) {
      const rect = node.getBoundingClientRect();
      ({ left, top, width } = rect);
    }
  }

  function fattenFixedOption(result, option) {
    if (option.options) {
      return {
        ...result,
        [option.value]: appConfig[option.options],
      };
    }
    return result;
  }

  function flattenFixedOptions() {
    return graphConfig.modes.reduce(fattenFixedOption, {});
  }

  function pickOptionWidthBase() {
    if (isFixedScale()) return SCALE_FIXED_OPTION_WIDTHS[$mode];
    return SCALE_DATE_OPTION_WIDTHS[$dynamics];
  }

  function generateDayOptions() {
    return {
      length: SCALE_DAYS_COUNT + 1,
    };
  }

  function generateWeekOptions() {
    return {
      length: SCALE_WEEKS_COUNT,
    };
  }

  function generateMonthOptions() {
    return {
      length: calculateDatesMonthsCount(datePoP, $date),
    };
  }

  function generateQuarterOptions() {
    return {
      length: calculateDatesQuartersCount(datePoP, $date),
    };
  }

  function generateYearOptions() {
    return {
      length: calculateDatesYearsCount(datePoP, $date),
    };
  }

  function generateDateOptions() {
    if (isDaysOption()) return generateDayOptions();
    else if (isWeeksOption()) return generateWeekOptions();
    else if (isMonthsOption()) return generateMonthOptions();
    else if (isQuartersDaysOption()) return generateQuarterOptions();
    return generateYearOptions();
  }

  function pickOptions() {
    if (isFixedScale()) return fixedOptions[$mode];
    return generateDateOptions();
  }

  function generateDayFragment() {
    const daysDateMin = new Date(datePoP).getTime();
    const startOption = daysDateMin + (DAY * ($step));
    const result = [];
    for (let index = 0; index <= $count; ++index) {
      const timestamp = startOption + (index * DAY);
      const label = (new Date(timestamp)).getDate();
      result.push({ label });
    }
    return result;
  }

  function generateWeekFragment() {    
    const weeksDateObjectMin = new Date(datePoP);
    const yearMin = weeksDateObjectMin.getFullYear();
    const monthMin = weeksDateObjectMin.getMonth();
    const dayMin = weeksDateObjectMin.getDate();
    const weekStart = calculateWeekNumber(dayMin, monthMin, yearMin);
    let weekCount = calculateWeekNumber(31, 11, yearMin)
    weekCount = weekCount === 1 ? 52 : weekCount;
    const result = [];
    for (let index = 0; index <= $count; index += 1) {
      const week = (weekStart + $step + index - 1) % (weekCount) + 1;
      const label = `${week}`;
      result.push({ label });
    }
    return result;
  }

  function generateMonthFragment() {
    const monthsDateObjectMin = new Date(datePoP);
    const monthStart = monthsDateObjectMin.getMonth();
    const result = [];
    for (let index = 0; index <= $count; index += 1) {
      const month = (monthStart + $step + index) % 12;
      const label = renderMonthShort(Date.UTC(2000, month, 1), $locale);
      result.push({ label });
    }
    return result;
  }

  function generateQuarterFragment() {
    const quarterStart = 4 - calculateQuartersRestCount(datePoP);
    const result = [];
    for (let index = 0; index <= $count; index += 1) {
      const quarter = ((quarterStart + $step + index) % 4) + 1;
      const label = `${quarter} ${translate("квартал", $locale)}`;
      result.push({ label });
    }
    return result;
  }

  function generateYearFragment() {
    const yearMin = (new Date(datePoP)).getFullYear();
    const result = [];
    for (let index = 0; index <= $count; index += 1) {
      const year = yearMin + $step + index;
      const label = year;
      result.push({ label });
    }
    return result;
  }

  function pickGenerator() {
    if (isDaysOption()) return generateDayFragment;
    else if (isWeeksOption()) return generateWeekFragment;
    else if (isMonthsOption()) return generateMonthFragment;
    else if (isQuartersDaysOption()) return generateQuarterFragment;
    return generateYearFragment;
  }

  function generateDayStickers() {
    const daysDateMin = new Date(datePoP).getTime();
    const daysDatObjectMin = new Date(daysDateMin);
    const yearMin = daysDatObjectMin.getFullYear();
    const monthMin = daysDatObjectMin.getMonth();
    const dayMin = daysDatObjectMin.getDate();
    const daysDatObjectMax = new Date($date);
    const yearMax = daysDatObjectMax.getFullYear();
    const monthMax = daysDatObjectMax.getMonth();
    const yearsCount = calculateDatesYearsCount(daysDateMin, $date);
    const result = [];
    for (let yearShift = 0; yearShift < yearsCount; yearShift += 1) {
      const year = yearMin + yearShift;
      const monthStart = year !== yearMin ? 0 : monthMin;
      const monthLimit = year !== yearMax ? 12 : monthMax + 1;
      for (let month = monthStart; month < monthLimit; month += 1) {
        const timestamp = Date.UTC(year, (month + 1), 0);
        const label = `${renderMonthLong(timestamp, $locale)} ${year}`;
        const days = calcuateMonthDayCount(timestamp);
        const index = ((yearShift * 12) + month) - monthMin;
        const stepStart = index !== 0 ? (result[index - 1].stepFinish + 1) : 0;
        const stepFinish = index !== 0 ? (stepStart + days) - 1 : stepStart + (days - dayMin);
        result.push({ label, stepStart, stepFinish });
      }
    }
    return result;
  }

  function generateWeekStickers() {
    const weeksDateMin = subtractWeeks($date, SCALE_WEEKS_COUNT);
    const weeksDateObjectMin = new Date(weeksDateMin);
    const yearMin = weeksDateObjectMin.getFullYear();
    const monthMin = weeksDateObjectMin.getMonth();
    const dayMin = weeksDateObjectMin.getDate();
    const weeksMin = calculateWeekNumber(dayMin, monthMin, yearMin);
    const yearsCount = calculateDatesYearsCount(weeksDateMin, $date);
    const result = [];
    for (let yearShift = 0; yearShift < yearsCount; yearShift += 1) {
      const year = yearMin + yearShift;
      const label = year;
      const weeks = calculateYearWeekCount(year);
      const stepStart = yearShift !== 0 ? (result[yearShift - 1].stepFinish + 1) : 0;
      const stepFinish = yearShift !== 0 ? (stepStart + weeks) - 1 : stepStart + (weeks - weeksMin);
      result.push({ label, stepStart, stepFinish });
    }
    return result;
  }

  function generateMonthStickers() {
    const monthsDateObjectMin = new Date(datePoP);
    const yearMin = monthsDateObjectMin.getFullYear();
    const monthMin = monthsDateObjectMin.getMonth();
    const yearsCount = calculateDatesYearsCount(datePoP, $date);
    const result = [];
    for (let yearShift = 0; yearShift < yearsCount; yearShift += 1) {
      const label = yearMin + yearShift;
      const stepStart = yearShift !== 0 ? (result[yearShift - 1].stepFinish + 1) : 0;
      const stepFinish = yearShift !== 0 ? (stepStart + 12) - 1 : (stepStart + 12) - (monthMin + 1);
      result.push({ label, stepStart, stepFinish });
    }
    return result;
  }

  function generateQuarterStickers() {
    const yearMin = (new Date(datePoP)).getFullYear();
    const diff = calculateDatesYearsCount(datePoP, $date);
    const quarterMin = calculateQuartersRestCount(datePoP);
    const result = [];
    for (let yearShift = 0; yearShift <= diff; yearShift += 1) {
      const label = yearMin + yearShift;
      const stepStart = yearShift !== 0 ? (result[yearShift - 1].stepFinish + 1) : 0;
      const stepFinish = yearShift !== 0 ? (stepStart + 4) - 1 : stepStart + (quarterMin - 1);
      result.push({ label, stepStart, stepFinish });
    }
    return result;
  }

  function generateStickers() {
    if (isDaysOption()) return generateDayStickers();
    else if (isWeeksOption()) return generateWeekStickers();
    else if (isMonthsOption()) return generateMonthStickers();
    else if (isQuartersDaysOption()) return generateQuarterStickers();
    return null;
  }

  function renderStatusClass() {
    if ($status === 1) return ' txcm-graphHeader-has-leftShade';
    else if ($status === 2) return ' txcm-graphHeader-has-rightShade';
    else if ($status === 3) return ' txcm-graphHeader-has-leftShade txcm-graphHeader-has-rightShade';
    return '';
  }

  function calculateOptionWidthMax(newCount) {
    if (newCount === 0) return 0;
    return width / newCount;
  }

  function calculateScrollMax() {
    return (options.length - $count) * $optionWidthMax;
  }

  function updateScrollLimits() {
    $optionWidthMax = calculateOptionWidthMax($count, width);
    $scrollMax = calculateScrollMax($count, options, $optionWidthMax);
  }

  function calculateFixedOptionsCount() {
    const { length } = options;
    const widthCount = Math.floor(width / optionWidthBase);
    if (widthCount < length) return widthCount;
    return length;
  }

  function calculateCount() {
    return calculateFixedOptionsCount();
  }

  async function updateHighighted() {
    await tick();
    $highlighted = pointer === null ? null : Math.floor(pointer / $optionWidthMax);
  }

  function updateStatus() {
    if ($scroll) {
      if ($scroll === $scrollMax) return 1;
      return 3;
    } else if ($scrollMax > 0) return 2;
    return 0;
  }

  function updateStepMax() {
    return options.length - $count;
  }

  async function resetStep() {
    await tick();
    $step = isFixedScale() ? 0 : stepMax;
    $shift = 0;
  }

  function updateStep() {
    if ($optionWidthMax) {
      const newStep = Math.floor($scroll / $optionWidthMax);
      $step = newStep;
      $shift = (newStep * $optionWidthMax) - $scroll;
    }
  }

  function shouldHighlight(pageX, pageY) {
    return (pageY >= top) && (pageX > left);
  }

  function onMouseMove({ pageX, pageY }) {
    if (shouldHighlight(pageX, pageY)) pointer = pageX - left - $shift;
    else pointer = null;
  }

  function updateScroll(deltaX) {
    if (($scroll + deltaX) <= 0) $scroll = 0;
    else if (($scroll + deltaX) >= $scrollMax) $scroll = $scrollMax;
    else $scroll += deltaX;
  }

  function changeScroll(deltaX) {
    if ((pointerScrollStart + deltaX) <= 0) $scroll = 0;
    else if ((pointerScrollStart + deltaX) >= $scrollMax) $scroll = $scrollMax;
    else $scroll = pointerScrollStart + deltaX;
  }

  async function resetScroll() {
    await tick();
    $scroll = isFixedScale() ? 0 : $scrollMax;
  }

  function shouldScroll(deltaX) {
    return Math.abs(deltaX) > 0;
  }

  function onWheel(event) {
    const { deltaX } = event;
    if (shouldScroll(deltaX)) {
      event.preventDefault();
      updateScroll(deltaX);
    }
  }

  function onResize() {
    measureComponent();
  }

  function onPointerMove(event) {
    if (isPointDown) {
      pointerPositionCurrent = event.touches ? event.touches[0].clientX : event.clientX;
      const diff = pointerPositionStart - pointerPositionCurrent;
      changeScroll(diff);
    }
  }

  function onPointerUp(event) {
    isPointDown = false;
    event.preventDefault();
    event.stopPropagation();
    unsubscribeWindow();
  }

  function subscribeWindow() {
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    window.removeEventListener('touchend', onPointerUp);
  }

  function onPointerDown(event) {
    isPointDown = true;
    pointerPositionStart = event.touches ? event.touches[0].clientX : event.clientX;
    pointerScrollStart = $scroll;
    subscribeWindow();
  }
</script>

<div
  class={`txcm-graphHeader${renderStatusClass($status)}`}
  bind:this={node}
  on:wheel={onWheel}
  on:mousedown|preventDefault|stopPropagation={onPointerDown}
  on:touchstart|preventDefault|stopPropagation={onPointerDown}>
    {#if isFixedScale($mode)}
      <GraphScaleFixed
        {options} />
    {:else}
      <GraphScaleDate
        {generator} />
      {#if stickers}
        <GraphStickers
          scroll={$scroll}
          {stickers}
          stepWidth={$optionWidthMax} />
      {/if}
    {/if}
    {#if isHaveScroll($count, stepMax)}
      <GraphHeaderScrollTrack />
    {/if}
</div>
<svelte:window
  on:resize={onResize}
  on:mousemove={onMouseMove} />
