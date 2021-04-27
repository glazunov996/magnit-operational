import { calculateQuarter, addMonths, addWeeks, calculateWeekNumber } from 'utilities/date';

export function renderPointX(pointIndex, pointCount, offset = 0.5) {
  return `${(((pointIndex + offset) / pointCount) * 100)}%`;
}

export function renderPointY(point, min, max, height, padding) {
  const paddedHeight = height - (padding * 2);
  const base = max - min;
  const fraction = base ? 1 - ((point - min) / (max - min)) : 0;
  return (paddedHeight * fraction) + padding + 0.5;
}

function generateMonthName(index) {
  if (index === 0) return 'Jan';
  if (index === 1) return 'Feb';
  if (index === 2) return 'Mar';
  if (index === 3) return 'Apr';
  if (index === 4) return 'May';
  if (index === 5) return 'Jun';
  if (index === 6) return 'Jul';
  if (index === 7) return 'Aug';
  if (index === 8) return 'Sep';
  if (index === 9) return 'Oct';
  if (index === 10) return 'Nov';
  return 'Dec';
}

export function fillDayData(series, timestamp) {    
  const fillData = data => {
    const seriesMap = data.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {})
    const newData = [];
    for (let i = 0; i < 31; ++i) {
      const date = new Date(timestamp);
      date.setDate(date.getDate() + i - 30);
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const day = `${date.getDate()}`.padStart(2, 0);
      const name = `${date.getFullYear()}${month}${day}`;
      newData.push(seriesMap[name] ? seriesMap[name] : { name, data: null, text: '-' })
    }
    return newData;
  }
  return series.map(seriesData => ({
    name: seriesData.name,
    data: fillData(seriesData.data.slice())
  }));
}

export function fillWeekData(series, timestamp) {
  const fillData = data => {
    const seriesMap = data.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {})
    const newData = [];
    const date = new Date(timestamp);
    for (let i = 0; i < 11; ++i) {      
      const week = new Date(addWeeks(date.getTime(), i - 10));
      const weekNumber = calculateWeekNumber(week.getDate(), week.getMonth(), week.getFullYear());
      const year = weekNumber === 53 && week.getMonth() === 0 ?
        week.getFullYear() - 1 : week.getFullYear();
      const name = `${year}${`${weekNumber}`.padStart(2, 0)}`;
      newData.push(seriesMap[name] ? seriesMap[name] : { name, data: null, text: '-' })
    }
    return newData;
  }
  return series.map(seriesData => ({
    name: seriesData.name,
    data: fillData(seriesData.data.slice())
  }));
}

export function fillMonthData(series, timestamp) {
  const fillData = data => {
    const seriesMap = data.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {})
    const newData = [];
    for (let i = 0; i < 13; ++i) {
      const date = new Date(timestamp);
      date.setDate(1);
      date.setMonth(date.getMonth() + i- 12);
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const name = `${year}${month}`;
      newData.push(seriesMap[name] ? seriesMap[name] : { name, data: null, text: '-' })
    }
    return newData;
  }
  return series.map(seriesData => ({
    name: seriesData.name,
    data: fillData(seriesData.data.slice())
  }));
}

export function fillQuaterData(series, timestamp) {
  const fillData = data => {
    const seriesMap = data.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {})
    const newData = [];
    for (let i = 0; i < 5; ++i) {
      const date = new Date(addMonths(timestamp, i * 3 - 12));
      const year = date.getFullYear();
      const quarter = `${calculateQuarter(date)}`.padStart(2, 0);
      const name = `${year}${quarter}`;
      newData.push(seriesMap[name] ? seriesMap[name] : { name, data: null, text: '-' })
    }
    return newData;
  }
  return series.map(seriesData => ({
    name: seriesData.name,
    data: fillData(seriesData.data.slice())
  }));
}

export function fillYearData(series, timestamp) {
  const fillData = data => {
    const seriesMap = data.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {})
    const newData = [];
    for (let i = 0; i < 3; ++i) {
      const date = new Date(timestamp);
      const year = date.getFullYear() + i - 2;
      const name = `${year}`;
      newData.push(seriesMap[name] ? seriesMap[name] : { name, data: null, text: '-' });
    }
    return newData;
  }
  return series.map(seriesData => ({
    name: seriesData.name,
    data: fillData(seriesData.data.slice())
  }));
}

function filterPeriodData(series, startPeriod, endPeriod, timestamp, timestampPoP) {
  const startDate = new Date(timestampPoP);
  const startYear = startDate.getFullYear();
  const startName = `${startYear}${`${startPeriod}`.padStart(2, '0')}`;
  const startIndex = series[0].data.findIndex(point => point.name === startName);
  const endDate = new Date(timestamp);
  const endYear = endDate.getFullYear();
  const endName = `${endYear}${`${endPeriod}`.padStart(2, '0')}`;
  const endIndex = series[0].data.findIndex(point => point.name === endName);
  return series.map(seriesData => ({
    name: seriesData.name,
    data: endIndex < 0 ? seriesData.data.slice(Math.max(startIndex, 0)) 
                       : seriesData.data.slice(Math.max(startIndex, 0), endIndex + 1),
  }));
}

export function filterPeriodMonthData(series, startPeriod, endPeriod, timestamp, timestampPoP) {
  const startDate = new Date(timestampPoP);
  const startYear = startDate.getFullYear();
  const startName = `${generateMonthName(startPeriod)} ${startYear}`;
  const startIndex = series[0].data.findIndex(point => point.name === startName);
  const endDate = new Date(timestamp);
  const endYear = endDate.getFullYear();
  const endName = `${generateMonthName(endPeriod)} ${endYear}`;
  const endIndex = series[0].data.findIndex(point => point.name === endName);
  return series.map(seriesData => ({
    name: seriesData.name,
    data: endIndex < 0 ? seriesData.data.slice(Math.max(startIndex, 0)) 
                       : seriesData.data.slice(Math.max(startIndex, 0), endIndex + 1),
  }));
}

export function filterDayData(series, timestamp, timestampPoP) {
  const startDay = new Date(timestampPoP);
  const endDay = new Date(timestamp);
  const startName = `${startDay.getFullYear()}${`${startDay.getMonth() + 1}`.padStart(2, '0')}${`${startDay.getDate()}`.padStart(2, '0')}`;
  const endName = `${endDay.getFullYear()}${`${endDay.getMonth() + 1}`.padStart(2, '0')}${`${endDay.getDate()}`.padStart(2, '0')}`;
  const startIndex = series[0].data.findIndex(point => point.name === startName);
  const endIndex = series[0].data.findIndex(point => point.name === endName);
  const data = series.map(seriesData => ({
    name: seriesData.name,
    data: endIndex < 0 ? seriesData.data.slice(Math.max(startIndex, 0)) 
                       : seriesData.data.slice(Math.max(startIndex, 0), endIndex + 1),
  }));
  return data;
}

export function filterWeekData(series, timestamp, timestampPoP) {
  const startWeek = new Date(timestampPoP);
  const endWeek = new Date(timestamp);
  const startWeekNumber = calculateWeekNumber(startWeek.getDate(), startWeek.getMonth(), startWeek.getFullYear());
  const endWeekNumber = calculateWeekNumber(endWeek.getDate(), endWeek.getMonth(), endWeek.getFullYear());
  const startName = `${startWeek.getFullYear()}${`${startWeekNumber}`.padStart(2, '0')}`;
  const endName = `${endWeek.getFullYear()}${`${endWeekNumber}`.padStart(2, '0')}`;
  const startIndex = series[0].data.findIndex(point => point.name === startName);
  const endIndex = series[0].data.findIndex(point => point.name === endName);
  const data = series.map(seriesData => ({
    name: seriesData.name,
    data: endIndex < 0 ? seriesData.data.slice(Math.max(startIndex, 0)) 
                       : seriesData.data.slice(Math.max(startIndex, 0), endIndex + 1),
  }));
  return data;
}

export function filterMonthData(series, timestamp, timestampPoP) {
  const startMonth = (new Date(timestampPoP)).getMonth() + 1;
  const endMonth = (new Date(timestamp)).getMonth() + 1;
  return filterPeriodData(series, startMonth, endMonth, timestamp, timestampPoP);
}

export function filterPeriodQuarterData(series, startPeriod, endPeriod, timestamp, timestampPoP) {
  const startDate = new Date(timestampPoP);
  const startYear = startDate.getFullYear();
  const startName = `${startYear}${startPeriod}`;
  const startIndex = series[0].data.findIndex(point => point.name === startName);
  const endDate = new Date(timestamp);
  const endYear = endDate.getFullYear();
  const endName = `${endYear}${endPeriod}`;
  const endIndex = series[0].data.findIndex(point => point.name === endName);
  return series.map(seriesData => ({
    name: seriesData.name,
    data: endIndex < 0 ? seriesData.data.slice(Math.max(startIndex, 0)) 
                       : seriesData.data.slice(Math.max(startIndex, 0), endIndex + 1),
  }));
}

export function filterQuarterData(series, timestamp, timestampPoP) {
  const startQuarter = calculateQuarter(timestampPoP);
  const endQuarter = calculateQuarter(timestamp);
  return filterPeriodData(series, startQuarter, endQuarter, timestamp, timestampPoP);
}

export function filterYearData(series) {
  return series;
}
