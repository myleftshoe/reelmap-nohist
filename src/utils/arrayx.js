// -------------------------------------------
// ARRAYS
// -------------------------------------------
// chunkify: split array into array of subarrays of given chunksize
// example:
// var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
// var groupedArr = createGroupedArray(arr, 4);
// var result = JSON.stringify(groupedArr);
// result: "[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14]]"

const ArrayX = {
    chunkify: function (arr, chunkSize) {
        var groups = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize));
        }
        return groups;
    }, // chunkify

    sumOfColumn: function (arr, columnName) {
        return arr.reduce((value, _a) => (_a[columnName] || 0) + value, 0);
    },

    sortByProperty: function (arr, property) {
        function compare(_a, _b) {
            const a = _a[property];
            const b = _b[property]
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        }
        const _arr = arr.sort(compare);
        return _arr;
    },

    groupBy: function (arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    },
    groupBy2: function (arr, keys) {
        const [key1, key2] = keys.split(',');
        var groups = {};
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
    },
    // Merge arr2 into arr1 by key e.g. OrderId
    // Values in arr2 will overwrite arr1
    mergeByKey: function (arr1, arr2, key) {
        const mergedArr = arr1.map(a1 => Object.assign(a1, arr2.find(a2 => a2[key] === a1[key])));
        // const items = this.state.items.map(i => Object.assign(i, filteredItems.find(f => f.OrderId === i.OrderId)));
        return mergedArr;
    }
}

export default ArrayX;
