import { useState } from 'react';
import { useSnapShot, batchWrite } from '../hooks/firebase'
import { geocode } from '../map/services/geocode';

const collection = 'SavedRuns'

export default function dataStore() {

    const [state, setState] = useState(new Map());
    const persist = true;
    function update(persist = false) {
        persist && batchWrite(collection, [...state.values()], 'OrderId')
        setState(new Map(state));
    }

    useSnapShot(collection, changes => {
        changes.forEach(function ({ id, type, data }) {
            switch (type) {
                case 'added':
                case 'modified':
                    if (!data.GeocodedAddress) {
                        geocode(data.FullAddress).then(({ lat, lng }) => {
                            data.GeocodedAddress = { latitude: lat, longitude: lng }
                            update(persist);
                        })
                    }
                    state.set(id, data)
                    break;
                case 'removed':
                    state.delete(id);
                    break;
                default:
                    break;
            }
        })
        // console.log(state);
        update();
    })

    return [state, update, persist];

};
