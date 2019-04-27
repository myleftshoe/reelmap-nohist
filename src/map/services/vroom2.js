import { LatLng } from "../utils";

const depot = [145.005252, -37.688797];

// const shiftDurations = [1, .9, .6]

// const totalDuration = shiftDurations.reduce((a, b) => a + b, 0)

export default async function vroom(drivers, data) {

    const driverIds = drivers.keys()
    const items = data.all();
    if (!items.length) return { items };

    // const depot = [145.005252, -37.688797];
    // const driverIds = ['CHA'];

    // const capacity = [Math.ceil(1.2 * items.length / driverIds.length)]
    // const totalJobs = items.length;
    // const _totalDuration = (driverIds.length === 1) ? 1 : totalDuration;
    // const capacityFactor = totalJobs / _totalDuration;
    // console.log(capacityFactor)
    console.log(driverIds)
    const jobs = mapItemsToJobs(items, driverIds);
    const vehicles = mapDriversToVehicles(drivers);
    const options = { "g": true }; //returns route geometry

    const solution = await fetchSolution({ vehicles, jobs, options });

    const routes = mapSolutionToRoutes(solution, driverIds);
    const modifiedSolution = modifySolution(solution, driverIds);
    modifiedSolution.routes = routes;

    const slackTime = [...drivers.values()].reduce((acc, driver) => {
        const route = routes.get(driver.id);
        let slack = driver.end - driver.start;
        if (route) {
            slack = driver.end - route.end;
        }
        if (slack > 0)
            return acc + slack;
        return acc;
    }, 0)

    // if (slackTime > 1000) {
    //     const averageSlackTime = slackTime / driverIds.length;
    //     [...drivers.values()].forEach(driver => {
    //         driver.end = Math.trunc(driver.end - averageSlackTime)
    //     })
    //     console.log(drivers);
    //     await vroom(drivers, data)
    // }

    // const result = {summary: modifiedSolution.summary, routes}

    const newItems = mapRoutesToItems(routes, items);
    return { items: newItems, solution: modifiedSolution, slackTime };
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

const mapItemsToJobs = (items, driverIds) => items.map(item => ({
    id: parseInt(item.OrderId, 10),
    location: [item.GeocodedAddress.longitude, item.GeocodedAddress.latitude],
    // amount: [1],
    skills: [item.Driver ? driverIds.indexOf(item.Driver) + 1 : 0],
    service: 120 //2 mins
}));

const mapDriversToVehicles = (driverIds) => [...driverIds.values()].map((driver, index) => {
    // console.log(driver, shiftDurations[index], Math.ceil(capacityFactor * shiftDurations[index]))
    return {
        "id": index,
        "start": depot,
        "end": depot,
        // "time_window": [36000, 48000],
        "time_window": [driver.start, driver.end],
        // capacity: [Math.ceil(capacityFactor * shiftDurations[index]) + 2],
        skills: [0, index + 1]
    }
});

function modifySolution(solution, driverIds) {

    const modifiedSolution = {};
    modifiedSolution.routes = [];
    modifiedSolution.summary = solution.summary;

    solution.routes.forEach(route => {

        const modifiedSteps = route.steps.map(
            (step, index, arr) => {
                const prevStep = arr[index - 1] || { duration: 0, distance: 0 };
                const modifiedStep = {
                    ...step,
                    id: step.job ? step.job + '' : step.type,
                    location: LatLng(step.location),
                    duration: step.duration - prevStep.duration,
                    distance: step.distance - prevStep.distance,
                    service: step.service || 0,
                }
                return modifiedStep;
            }
        )

        const _route = {
            vehicle: driverIds[route.vehicle],
            ...route,
            start: modifiedSteps[0].arrival,
            end: modifiedSteps[modifiedSteps.length - 1].arrival,
            steps: modifiedSteps,
        };


        modifiedSolution.routes.push(_route);

    });

    return modifiedSolution;

}

function mapSolutionToRoutes(solution, driverIds) {

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

        routes.set(driverIds[route.vehicle], _route)

    });

    return routes;
}

const mapRoutesToItems = (routes, items) => {

    const itemsMap = new Map(items.map(item => [item.OrderId, item]));
    const newItems = [];

    routes.forEach((route, key) => {
        const steps = route.steps.slice(1, -1)
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

    return newItems;
}
