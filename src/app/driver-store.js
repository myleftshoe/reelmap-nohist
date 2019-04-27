import { useReducer } from 'react';
import reducer from './driver-reducer';
import { drivers } from '../common/constants';

const initialState = drivers;

export default function driverStore() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const actions = {
        setColor(id, color) {
            console.log(id, color)
            dispatch({ type: 'set-color', id, color })
        },
    }

    return [state, actions];

};
