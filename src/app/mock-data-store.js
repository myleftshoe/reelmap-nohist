import { useReducer } from 'react';
import data from './data'
import reducer from './reducer';

const initialState = new Map(data.map(data => [data.OrderId, data]));


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
