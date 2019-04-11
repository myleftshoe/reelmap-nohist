import { useRef } from 'react'

function useDict() {
    const dict = useRef(new Map());
    return dict.current;
}

export default useDict;