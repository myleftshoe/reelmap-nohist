const depot = [145.005252, -37.688797];

// const vehicleProps = {
//     'CHA': { timeWindow: [36000, 61200], capacity: 100 },
//     'DRK': { timeWindow: [36000, 61200], capacity: 100 },
//     'SAM1': { timeWindow: [36000, 61200], capacity: 100 },
// }


// const shiftDurations = [1, .9, .6]

// const totalDuration = shiftDurations.reduce((a, b) => a + b, 0)

async function fetchSolution(payload) {
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
    });
    return response.json();
}


const mapItemsToJobs = (items, drivers) => items.map(item => ({
    id: parseInt(item.OrderId, 10),
    location: [item.GeocodedAddress.longitude, item.GeocodedAddress.latitude],
    // amount: [1],
    skills: [item.Driver ? drivers.indexOf(item.Driver) + 1 : 0],
    service: 120 //2 mins
}));

const mapDriversToVehicles = (drivers) => drivers.map((driver, index) => {
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

const mapSolutionToItems = (solution, items, drivers) => {
    const itemsMap = new Map(items.map(item => [item.OrderId, item]));
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
    return newItems;
}

export default async function vroom(items = [], drivers = []) {

    if (!items.length) return { paths: [], items };

    // const depot = [145.005252, -37.688797];
    // const drivers = ['CHA'];

    const jobs = mapItemsToJobs(items, drivers);

    // const capacity = [Math.ceil(1.2 * items.length / drivers.length)]

    // const totalJobs = items.length;
    // const _totalDuration = (drivers.length === 1) ? 1 : totalDuration;
    // const capacityFactor = totalJobs / _totalDuration;
    // console.log(capacityFactor)
    const vehicles = mapDriversToVehicles(drivers);

    const options = { "g": true }; //returns route geometry

    const solution = await fetchSolution({ vehicles, jobs, options });

    const newItems = mapSolutionToItems(solution, items, drivers);

    const paths = new Map(solution.routes.map(route => ([drivers[route.vehicle], route.geometry])));

    return { paths, items: newItems, solution };
    // return new Items(newItems);
}
