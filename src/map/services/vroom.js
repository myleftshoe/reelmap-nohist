// import GAS from './GlobalAppState';
// import Items from './Items';


// if (!input.vehicles[0].capacity) {
//     for (var j = 0; j < input.jobs.length; j++) {
//       input.jobs[j].amount = [1];
//     }
//     var C = Math.ceil(1.2 * input.jobs.length / input.vehicles.length);
//     for (var v = 0; v < input.vehicles.length; v++) {
//       input.vehicles[v].capacity = [C];
//     }
//   }
export default async function vroom(items) {
    // console.log("vroom", GAS.depot.LatLng);
    // const depot = [GAS.depot.LatLng.longitude, GAS.depot.LatLng.latitude];
    const depot = [145.005252, -37.688797];
    const drivers = ['CHA'];
    const _items = items.reduce((obj, item) => ((obj[item.OrderId] = item, obj)), {});
    console.log(JSON.parse(JSON.stringify(_items)));
    const jobs = items.map(item => {
        return { id: parseInt(item.OrderId, 10), location: [item.GeocodedAddress.longitude, item.GeocodedAddress.latitude], amount: [1], skills: [item.Driver ? drivers.indexOf(item.Driver) + 1 : 0] }
    });//.slice(0,90);
    const capacity = [Math.ceil(1.2 * items.length / drivers.length)]
    console.log(JSON.parse(JSON.stringify(jobs)));
    const vehicles = drivers.map((d, index) => ({ "id": index, "start": depot, "end": depot, "time_window": [36000, 61200], capacity, skills: [0, index + 1] }));
    const options = { "g": true }; //returns route geometry
    console.log(vehicles);
    // console.log(JSON.stringify({ vehicles, jobs, options }));
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ vehicles, jobs, options })
    });
    // console.log(response.json());
    const json = await response.json();
    console.log("vroom", json);
    let newItems = [];
    json.routes.forEach(r => {
        const steps = r.steps.filter(s => s.type === "job");
        console.log(steps);
        steps.forEach(s => {
            let item = _items[s.job];
            item.Driver = drivers[r.vehicle];
            newItems.push(item);
        });
    });
    console.log(newItems);
    let paths = json.routes.map(r => ({ driver: drivers[r.vehicle], path: r.geometry }));
    console.log("vroom", paths);
    console.log(newItems);
    return paths;
    // return new Items(newItems);
}

// export default async function vroom() {
//     const response = await fetch(`http://localhost:3000/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             // 'Authorization': `Bearer ${accessToken}`
//         },
//         body: JSON.stringify(
//             {"vehicles":[{"id":0,"start":[2.3526,48.8604],"end":[2.3526,48.8604]}],"jobs":[{"id":0,"location":[2.3691,48.8532],"service":300},{"id":1,"location":[2.2911,48.8566],"service":300}]}
//         )
//     });
//     const json = await response.json();
//     console.log("vroom",json);
// }