import firebaseStore from '../dbs/firebase'
import { useReducer } from 'react'
import { geocode } from '../map/services/geocode'
import reducer from './reducer'

const collection = 'Items2'

export default function dataStore() {

    function handleUpdate(id, data) {
        if (!data.GeocodedAddress) {
            console.log('geocoding')
            geocode(data.FullAddress).then(({ lat, lng }) => {
                data.GeocodedAddress = { latitude: lat, longitude: lng }
                update(persist);
            })
        }
    }

    // const driver = window.location.pathname.split('/')[1];
    // const where = driver && ['Driver', '==', driver];
    const where = null;
    const [dbState, update, persist] = firebaseStore(collection, { where, limit: 120 }, handleUpdate);

    const [state, dispatch] = useReducer(reducer, dbState);

    return [state, dispatch, persist];
}
