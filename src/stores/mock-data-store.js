import { useState, useReducer } from 'react';
import data from './data'

const initialState = new Map(data.map(data => [data.OrderId, data]));

function reducer(state, action) {
    console.log('reducing.....', action)
    switch (action.type) {
        case 'assign': {
            const item = state.get(action.id);
            item.Driver = action.driver;
            return new Map(state);
        }
        case 'reassign-route': {
            const { from, to } = action;
            [...state.values()].forEach(item => {
                if (item.Driver === from) {
                    item.Driver = to;
                }
                else if (item.Driver === to) {
                    item.Driver = from;
                }
            });
            return new Map(state);
        }
        case 'update': {
            return new Map(state);
        }
        default:
            throw new Error();
    }
}


export default function dataStore() {

    // const persist = false;
    // const [state, setState] = useState(new Map(data.map(data => [data.OrderId, data])));

    const [state, dispatch] = useReducer(reducer, initialState);

    return [state, dispatch];
    // function update() {
    //     console.log('Updating mock-data-store');
    //     setState(new Map(state));
    // }
    // const storeFromArray = (items) => setState(new Map(items.map(data => [data.OrderId, data])));
    // return [state, update, persist, storeFromArray];

};
