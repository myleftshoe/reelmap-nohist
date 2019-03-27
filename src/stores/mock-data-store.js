import { useState } from 'react';
import data from './data'

export default function dataStore() {

    const persist = false;
    const [state, setState] = useState(new Map(data.map(data => [data.OrderId, data])));
    const update = () => setState(new Map(state));
    const storeFromArray = (items) => setState(new Map(items.map(data => [data.OrderId, data])));
    return [state, update, persist, storeFromArray];

};
