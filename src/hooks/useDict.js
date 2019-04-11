import { useRef } from 'react'

// Stores data without triggering rerenders!

function useDict(init) {
    const dict = useRef(new Map(init));
    return dict.current;
}

export default useDict;