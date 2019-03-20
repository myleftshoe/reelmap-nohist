import { useState } from 'react';
import data from './data'

export default function dataStore() {

    const [state, setState] = useState(new Map(data.map(data => [data.OrderId, data])));
    const update = () => setState(new Map(state));
    return [state, update];

};
