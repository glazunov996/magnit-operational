import { cubicInOut } from 'svelte/easing';

export function shiftVertical(node, { delay = 0, duration = 200, height }) {
  const opacity = +getComputedStyle(node).opacity;

  return {
    delay,
    duration,
    css: (ratio) => {
      const eased = cubicInOut(ratio);
      return `
        opacity: ${eased * opacity};
        margin-bottom: ${(1 - eased) * -height}px;
      `;
    },
  };
}
