import { useRef } from 'react'

function useJsonDict(init) {

    const dict = useRef(new Map(init));

    const actions = {

        get(key) {
            return JSON.parse(dict.current.get(key));
        },

        set(key, state) {
            dict.current.set(key, JSON.stringify([...state]))
        },

        delete(key) {
            dict.current.delete(key);
        },

        clear() {
            dict.current.clear();
        },

        contains(value) {
            return ([...dict.current.values()].includes(JSON.stringify([...value])))
        }

    }

    return actions

}

export default useJsonDict;