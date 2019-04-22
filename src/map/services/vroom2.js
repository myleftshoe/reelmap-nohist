import { LatLng } from "../utils";

const depot = [145.005252, -37.688797];

// const vehicleProps = {
//     'CHA': { timeWindow: [36000, 61200], capacity: 100 },
//     'DRK': { timeWindow: [36000, 61200], capacity: 100 },
//     'SAM1': { timeWindow: [36000, 61200], capacity: 100 },
// }


// const shiftDurations = [1, .9, .6]

// const totalDuration = shiftDurations.reduce((a, b) => a + b, 0)

export default async function vroom(drivers = [], data) {

    const items = data.all();
    if (!items.length) return { paths: [], items };

    // const depot = [145.005252, -37.688797];
    // const drivers = ['CHA'];

    // const capacity = [Math.ceil(1.2 * items.length / drivers.length)]
    // const totalJobs = items.length;
    // const _totalDuration = (drivers.length === 1) ? 1 : totalDuration;
    // const capacityFactor = totalJobs / _totalDuration;
    // console.log(capacityFactor)

    const jobs = mapItemsToJobs(items, drivers);
    const vehicles = mapDriversToVehicles(drivers);
    const options = { "g": true }; //returns route geometry

    const solution = await fetchSolution({ vehicles, jobs, options });
    console.log(solution)

    // const paths = mapRoutesToPaths(solution, drivers);
    const routes = mapSolutionToRoutes(solution, drivers);
    const newItems = mapRoutesToItems(routes, items);

    return { items: newItems, solution, routes };
    // return new Items(newItems);
}

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

function mapSolutionToRoutes(solution, drivers) {

    const routes = new Map();
    solution.routes.forEach(route => {

        const { distance, duration, geometry, service } = route;

        const steps = route.steps.map(
            ({ arrival, distance, duration, job, location, service, type }, index, arr) => {
                const prevStep = arr[index - 1] || { duration: 0, distance: 0 };
                const step = {
                    id: job ? job + '' : type,
                    location: LatLng(location),
                    arrival,
                    duration: duration - prevStep.duration,
                    distance: distance - prevStep.distance,
                    service: service || 0,
                }
                return step;
            }
        )

        const _route = {
            start: steps[0].arrival,
            end: steps[steps.length - 1].arrival,
            distance,
            duration,
            service,
            steps,
            geometry,
        }

        routes.set(drivers[route.vehicle], _route)

    });

    return routes;
}

const mapRoutesToItems = (routes, items) => {

    const itemsMap = new Map(items.map(item => [item.OrderId, item]));
    const newItems = [];

    routes.forEach((route, key) => {
        const steps = route.steps.slice(1, -1)
        console.log(steps)
        // const steps = route.steps.filter(step => step.id === "job");
        steps.forEach((step, i) => {
            const item = itemsMap.get(`${step.id}`);
            item.Driver = key;
            item.Sequence = i + 1;
            item.arrival = step.arrival;
            item.duration = step.duration;
            newItems.push(item);
        });
    })

    console.log(newItems)
    return newItems;
}
