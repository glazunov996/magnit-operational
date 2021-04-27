export function renderID(name, index) {
  return `${name}-${index}`;
}

export function renderURL(dashboard, indicator) {
  return `/dashboard/${dashboard}/${indicator}`;
}

export function shortenLabel(text) {
  if (text.length > 4) return text.slice(0, 3);
  return text;
}
