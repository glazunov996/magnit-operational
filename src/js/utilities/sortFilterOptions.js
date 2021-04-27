import { default as sortedFRMTOptions } from 'configs/dashboards/financial/sortedFRMTOptions.json';

export default function sortFilterOptions(data) {
    let arr = [];

    sortedFRMTOptions.forEach(i => {
        arr.push(data.find(j => j.label === i))
    })

    arr = arr.filter(item => item)

    return [...new Set([...arr, ...data])]
};