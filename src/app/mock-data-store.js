import { useReducer } from 'react';
import data from './data'
import reducer from './reducer';

const initialState = new Map(data.slice(0, 6).map(data => [data.OrderId, data]));

export default function dataStore() {

    const [state, dispatch] = useReducer(reducer, initialState);

    return [state, dispatch];

};
