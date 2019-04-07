import { createRef } from 'react';

const snapshots = createRef();
snapshots.current = new Map();

export default function reducer(state, action) {

    console.log('reducing.....', action)

    switch (action.type) {
        case 'assign': {
            action.ids.forEach(id => {
                const item = state.get(id);
                item.Driver = action.driver;
                item.Sequence = null;
            });
            break;
        }
        case 'swap-route': {
            const { from, to } = action;
            [...state.values()].forEach(item => {
                if (item.Driver === from) {
                    item.Driver = to;
                }
                else if (item.Driver === to) {
                    item.Driver = from;
                }
            });
            break;
        }
        case 'update': {
            break;
        }
        case 'add-snapshot': {
            snapshots.current.set(action.id, JSON.stringify([...state]))
            console.log(snapshots)
            break;
        }
        case 'apply-snapshot': {
            state = JSON.parse(snapshots.current.get(action.id));
            break;
        }
        default: { }
    }

    return new Map(state);

}
