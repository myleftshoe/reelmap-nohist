import { createRef } from 'react';

const snapshots = createRef();
snapshots.current = new Map();

export default function reducer(state, action) {

    console.log('reducing.....', action)

    switch (action.type) {
        case 'add': {
            snapshots.current.set(action.id, JSON.stringify([...state]))
            console.log(snapshots)
            break;
        }
        case 'apply-snapshot': {
            state = JSON.parse(snapshots.current.get(action.id));
            break;
        }
        case 'delete': {
            console.log(action.id)
            snapshots.current.delete(action.id);
            break;
        }
        case 'clear': {
            // const current = [...snapshots.current].pop();
            // snapshots.current = new Map([current]);
            snapshots.current = null;
            break;
        }
        default: { }
    }

    return new Map(snapshots.current);

}
