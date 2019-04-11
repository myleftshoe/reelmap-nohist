import { useRef } from 'react'

/*
    useRef doesn't trigger rerender when .current changes -
    use here instead of state because snapshots don't
    need to be renderered.
*/

function useSnapshot() {

    const snapshots = useRef(new Map());

    const actions = {

        add(id, state) {
            snapshots.current.set(id, JSON.stringify([...state]))
        },

        delete(id) {
            snapshots.current.delete(id);
        },

        clear() {
            snapshots.current.clear();
        },

        get(id) {
            return JSON.parse(snapshots.current.get(id));
        }
    }

    return actions

}

export default useSnapshot;