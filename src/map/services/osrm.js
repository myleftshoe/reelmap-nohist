const depot = '145.005252,-37.688797';


async function fetchSolution({service = 'route', payload, options=''}) {
    const response = await fetch(`http://localhost:5000/${service}/v1/driving/${payload}${options}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        // body: JSON.stringify(payload)
    });
    return response.json();
}

export default async function route(items) {

    const options = '?overview=full&source=first&destination=last'
    const source=depot;
    const destination=depot;
    const lngLats = items.map(  ({GeocodedAddress: {latitude, longitude}}) => `${longitude},${latitude}`);
    const payload = [source, ...lngLats, destination].join(';');
    console.log(payload);
    const response = await fetchSolution({service: 'trip', payload, options});
    console.log(response);
    const waypoints = [...response.waypoints]
    waypoints.pop();
    waypoints.shift();
    const newItems = [];
    const order = waypoints.map(({waypoint_index:id }) => id);
    waypoints.forEach((w, i) => {
        const item = items[i];
        item.Sequence = i + 1;
        newItems.push(item);
    });
    console.table(order);
    return {newItems, path: response.trips[0].geometry, order};
}