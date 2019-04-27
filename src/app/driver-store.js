import { useReducer } from 'react';
import reducer from './driver-reducer';
import { drivers } from '../common/constants';
import Dict from '../common/dict';

const initialState = drivers;

export default function driverStore() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const store = new Dict(state);
    store.setColor = (id, color) => {
        console.log(id, color)
        dispatch({ type: 'set-color', id, color })
    }

    return store;

};
