import { useEffect, useState } from 'react';

const firestore = global.firebase.firestore();

// useEffect should return a cleanup function. In this case it
// should unsubscribe from snapshot. Here it is done seemingly
// impilcitly as onSnapshot returns an unsubscribe function and
// the use effect arrow function returns it to the caller
// (cw verbose version below)
export function useSnapShot(name, callback, { where, limit } = {}) {
    console.log(where)
    function handleSnapshot(snapshot) {
        const changes = snapshot.docChanges().map(({ type, doc }) => ({ type, id: doc.id, data: doc.data() }));
        callback(changes);
    }
    useEffect(() => {
        let query = firestore.collection(name);
        if (where) query = query.where(...where);
        if (limit) query = query.limit(limit);
        return query.onSnapshot(handleSnapshot);
    }, []);
}

export function batchWrite(name, data) {
    const batch = firestore.batch();
    const collection = firestore.collection(name);
    data.forEach((item, id) => {
        const ref = collection.doc(id.toString());
        batch.set(ref, item);
    });
    batch.commit();
}

export default function firebaseStore(collection, { where, limit } = {}, onUpdate) {

    const [state, setState] = useState(new Map());
    const persist = true;

    function update(persist = false) {
        persist && batchWrite(collection, state)
        setState(new Map(state));
    }

    useSnapShot(collection, changes => {
        changes.forEach(function ({ id, type, data }) {
            switch (type) {
                case 'added':
                case 'modified':
                    // if (!data.GeocodedAddress) {
                    //     geocode(data.FullAddress).then(({ lat, lng }) => {
                    //         data.GeocodedAddress = { latitude: lat, longitude: lng }
                    //         update(persist);
                    //     })
                    // }
                    onUpdate && onUpdate(id, data);
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
    }, { where, limit })

    return [state, update, persist];

};


// Verbose version
// --------------------------
// refs is an array of variable names which the useEffect callback
// uses. In this case gmaps is referenced in the callback function
// so it passes it into useSnapshot. Refer to react hooks docs for
// details. (Without this I had to define gmaps globally in App.js)
//
// export function useSnapShot(name, refs = [],  callback) {
//     useEffect(() => {
//         const db = firestore;
//         const unsubscribe = db.collection(name).limit(5).onSnapshot(
//             function (snapshot) {
//                 const data = [];
//                 snapshot.docChanges().forEach(function (change) {
//                     data.push({ id: change.doc.id, type: change.type, data: change.doc.data() })
//                 });
//                 callback(data)
//             });
//         return () => { unsubscribe() }
//     }, refs);
// }
