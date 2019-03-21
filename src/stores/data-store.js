import firebaseStore from '../dbs/firebase'
import { geocode } from '../map/services/geocode';

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

    const driver = window.location.pathname.split('/')[1];
    const where = driver && ['Driver', '==', driver];
    const [state, update, persist] = firebaseStore(collection, { where }, handleUpdate);

    return [state, update, persist];
}
