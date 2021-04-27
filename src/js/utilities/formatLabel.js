export default (value, units, suffix = '', base = 1000000.0) => {
  if (isNaN(value) || Math.abs(value) <= 0.00001)
    return '-';
  if (units === '%')
    return value = (value * 100.0).toFixed(2).toString() + suffix;
  else if (units === 'руб.')
    return value = (value / base).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  else if (units === 'шт.' || units === "штук в чеке" || units === 'чел')
    return value.toFixed(0).toString().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  else if (units === 'дн.')
    return value.toFixed(0).toString()
  return value.toString();
} 