import { useRef } from 'react'

function useJsonDict(init) {

    const dict = useRef(new Map(init));

    const actions = {

        get(key) {
            return JSON.parse(dict.current.get(key));
        },

        set(key, value) {
            dict.current.set(key, JSON.stringify([...value]))
        },

        delete(key) {
            dict.current.delete(key);
        },

        clear() {
            dict.current.clear();
        },

        contains(value) {
            return ([...dict.current.values()].includes(JSON.stringify([...value])))
        },

        get last() {
            const size = dict.current.size;
            if (!size) return {};
            const key = [...dict.current.keys()][size - 1];
            return { key, value: actions.get(key) };
        },

        equals(key, value) {
            return (dict.current.get(key) === JSON.stringify([...value]))
        },

    }

    return actions

}

export default useJsonDict;