import { useReducer } from 'react';
import reducer, { actions } from './driver-reducer';
import { drivers } from '../common/constants';

const initialState = drivers;

export default function driverStore() {

    const [state, dispatch] = useReducer(reducer, initialState);

    return [state, actions];

};
