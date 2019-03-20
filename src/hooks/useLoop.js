import { useState } from 'react'

export default function useLoop(arr, initialValue) {
    const [index, setIndex] = useState(arr.indexOf(initialValue) || 0);
    function next() {
        let _index = index;
        if (_index >= arr.length - 1)
            _index = 0;
        else
            _index++;
        setIndex(_index);
        return arr[_index];
    }
    return next;
}
