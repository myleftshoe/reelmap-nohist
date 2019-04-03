export function groupBy2(arr, keys) {
    const [key1, key2] = keys.split(',');
    const groups = {};
    arr.forEach(o => {
        if (o[key1] && o[key2]) {
            const group = o[key1] + ', ' + o[key2];
            if (!groups[group])
                groups[group] = [];
            groups[group].push(o);
        }
    });
    // console.log(Object.keys(groups).length)
    if (!Object.keys(groups).length)
        groups['undefined'] = arr;

    return groups;
}