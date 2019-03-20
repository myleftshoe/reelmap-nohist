import { useEffect } from 'react';

const firestore = global.firebase.firestore();

// useEffect should return a cleanup function. In this case it
// should unsubscribe from snapshot. Here it is done seemingly
// impilcitly as onSnapshot returns an unsubscribe function and
// the use effect arrow function returns it to the caller
// (cw verbose version below)
export function useSnapShot(name, callback) {
    function handleSnapshot(snapshot) {
        const changes = snapshot.docChanges().map(({ type, doc }) => ({ type, id: doc.id, data: doc.data() }));
        callback(changes);
    }
    useEffect(() => firestore.collection(name).limit(55).onSnapshot(handleSnapshot), []);
}

export function batchWrite(name, data, id) {
    const batch = firestore.batch();
    const collection = firestore.collection(name);
    data.forEach(item => {
        const ref = collection.doc(item[id].toString());
        batch.set(ref, item);
    });
    batch.commit();
}

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
