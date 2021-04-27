export function checkDynamics(value, threshold) {
  if (typeof threshold === 'number') {
    if (value < threshold) return -2;
    if (value < 0) return -1;
  }
  if (value < 0) return -2;
  if (value > 0) return 1;
  return 0;
}

export function checkArrowDynamics(fact, value, arrow) {
  if (arrow === 0 || arrow === 1) {
    if (value < 0) return -2;
    if (value > 0) return 1;
  } else if (arrow === 2 || arrow === 3) {
    if (value > 0) return -2;
    if (value < 0) return 1;
  }
  
  return 0;
}

export function compareDynamics(value1, value2) {
  const diff = Math.round(((value1 * 10000) - (value2 * 10000)));
  if (diff < 0) return -2;
  if (diff > 0) return 1;
  return 0;
}

export function renderDynamicsClass(baseClass, dynamics) {
  if (dynamics === -2) return `${baseClass} ${baseClass}-is-decreasingCritically`;
  if (dynamics === -1) return `${baseClass} ${baseClass}-is-decreasing`;
  if (dynamics === 1) return `${baseClass} ${baseClass}-is-increasing`;
  return baseClass;
}

export function renderArrowDynamicsClass(baseClass, dynamics) {
  if (dynamics === 0) return `${baseClass} ${baseClass}-is-decreasingCritically`;
  if (dynamics === 1) return `${baseClass} ${baseClass}-is-increasing`;
  if (dynamics === 2) return `${baseClass} ${baseClass}-is-decreasingCritically-inverted`;
  if (dynamics === 3) return `${baseClass} ${baseClass}-is-increasing-inverted`;
  

  return baseClass;
}