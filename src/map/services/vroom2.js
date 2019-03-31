const depot = [145.005252, -37.688797];

// const vehicleProps = {
//     'CHA': { timeWindow: [36000, 61200], capacity: 100 },
//     'DRK': { timeWindow: [36000, 61200], capacity: 100 },
//     'SAM1': { timeWindow: [36000, 61200], capacity: 100 },
// }


// const shiftDurations = [1, .9, .6]

// const totalDuration = shiftDurations.reduce((a, b) => a + b, 0)

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

    if (!items.length) return { paths: [], items };

    const itemsMap = new Map([...items.map(item => [item.OrderId, item])]);
    // const items = [...itemsMap.values()];
    // const depot = [145.005252, -37.688797];
    // const drivers = ['CHA'];

    const jobs = items.map(item => ({
        id: parseInt(item.OrderId, 10),
        location: [item.GeocodedAddress.longitude, item.GeocodedAddress.latitude],
        // amount: [1],
        skills: [item.Driver ? drivers.indexOf(item.Driver) + 1 : 0],
        service: 300
    }));

    // const capacity = [Math.ceil(1.2 * items.length / drivers.length)]

    // const totalJobs = items.length;
    // const _totalDuration = (drivers.length === 1) ? 1 : totalDuration;
    // const capacityFactor = totalJobs / _totalDuration;
    // console.log(capacityFactor)
    const vehicles = drivers.map((driver, index) => {
        // console.log(driver, shiftDurations[index], Math.ceil(capacityFactor * shiftDurations[index]))
        return {
            "id": index,
            "start": depot,
            "end": depot,
            // "time_window": [36000, 48000],
            "time_window": [36000, 61200],
            // capacity: [Math.ceil(capacityFactor * shiftDurations[index]) + 2],
            skills: [0, index + 1]
        }
    });

    const options = { "g": true }; //returns route geometry

    const solution = await doFetch({ vehicles, jobs, options });
    console.log(solution)
    const newItems = [];
    solution.routes.forEach(route => {
        const steps = route.steps.filter(s => s.type === "job");
        // console.log(steps);
        steps.forEach((s, i) => {
            const item = itemsMap.get(`${s.job}`);
            item.Driver = drivers[route.vehicle];
            item.Sequence = i + 1;
            newItems.push(item);
        });
    });

    const paths = new Map(solution.routes.map(route => ([drivers[route.vehicle], route.geometry])));

    return { paths, items: newItems };
    // return new Items(newItems);
}
