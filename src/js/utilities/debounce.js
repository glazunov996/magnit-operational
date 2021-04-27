const DEBOUNCE_DURATION = 50;

export default function debounce(callback, duration = DEBOUNCE_DURATION) {
  let timeout;

  return (arg, force = false, ...args) => {
    clearTimeout(timeout);
    const processedDuration = force ? 0 : duration;
    timeout = setTimeout(callback, processedDuration, arg, ...args);
  };
}
