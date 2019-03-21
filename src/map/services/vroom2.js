async function doFetch(payload) {
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
    });
    // console.log(response.json());
    return response.json();
}



export default async function vroom(items = [], drivers = []) {

    const itemsMap = new Map([...items.map(item => [item.OrderId, item])]);
    // const items = [...itemsMap.values()];
    const depot = [145.005252, -37.688797];
    // const drivers = ['CHA'];

    const jobs = items.map(item => ({
        id: parseInt(item.OrderId, 10),
        location: [item.GeocodedAddress.longitude, item.GeocodedAddress.latitude],
        amount: [1],
        skills: [item.Driver ? drivers.indexOf(item.Driver) + 1 : 0]
    }));

    const capacity = [Math.ceil(1.2 * items.length / drivers.length)]

    const vehicles = drivers.map((_, index) => ({
        "id": index,
        "start": depot,
        "end": depot,
        "time_window": [36000, 61200],
        capacity,
        skills: [0, index + 1]
    }));

    const options = { "g": true }; //returns route geometry

    const json = await doFetch({ vehicles, jobs, options });

    const newItems = [];
    json.routes.forEach(r => {
        const steps = r.steps.filter(s => s.type === "job");
        console.log(steps);
        steps.forEach((s, i) => {
            const item = itemsMap.get(`${s.job}`);
            item.Driver = drivers[r.vehicle];
            item.Sequence = i + 1;
            newItems.push(item);
        });
    });

    const paths = json.routes.map(r => ({ driver: drivers[r.vehicle], path: r.geometry }));

    return { paths, items: newItems };
    // return new Items(newItems);
}
