import { LatLng } from "../utils";

const depot = '145.005252,-37.688797';


export default async function route(id, data) {

    const items = data.where('Driver', id).sortBy('Sequence').all()
    console.table(items, ['ShortAddress', 'Sequence'])
    // const options = '?overview=full&source=first&destination=last'
    const options = '?overview=full'
    const source = depot;
    const destination = depot;
    const lngLats = items.map(({ GeocodedAddress: { latitude, longitude } }) => `${longitude},${latitude}`);
    const payload = [source, ...lngLats, destination].join(';');
    const solution = await fetchSolution({ service: 'route', payload, options });

    const route = mapSolutionToRoute(solution, items, id);
    const newItems = mapRouteToItems(route, items)
    console.table(items, ['ShortAddress', 'Sequence'])

    return {
        newItems,
        route
    };
}

async function fetchSolution({ service = 'route', payload, options = '' }) {
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

function mapSolutionToRoute(solution, items, id) {

    const waypoints = [...solution.waypoints]
    console.log(solution)
    const { distance, duration, geometry, legs } = solution.routes[0];

    const stepIds = ['start', ...items.map(item => item.OrderId), 'end'];
    const steps = [{ id: 'start', arrival: 36000, duration: 0, location: LatLng(waypoints[0].location), distance: 0, service: 0 }];

    for (let index = 1; index < waypoints.length; index++) {
        const prevStep = steps[index - 1];
        const waypoint = waypoints[index];
        const { duration, distance } = legs[index - 1];
        const id = stepIds[index];
        const step = {
            id,
            location: LatLng(waypoint.location),
            arrival: Math.round(prevStep.arrival + duration + prevStep.service),
            duration: Math.round(duration),
            distance: Math.round(distance),
            service: 120,
        };
        steps.push(step);
    }
    steps[steps.length - 1].service = 0;
    const route = {
        start: 36000,
        end: steps[steps.length - 1].arrival,
        distance: Math.round(distance),
        duration: Math.round(duration),
        geometry,
        service: steps.map(item => item.service).reduce((prev, next) => prev + next),
        steps,
    };
    return route;
}

const mapRouteToItems = (route, items) => {

    const itemsMap = new Map(items.map(item => [item.OrderId, item]));
    const newItems = [];

    // routes.forEach((route, key) => {
    const steps = route.steps.slice(1, -1)
    // const steps = route.steps.filter(step => step.id === "job");
    steps.forEach((step, i) => {
        const item = itemsMap.get(`${step.id}`);
        item.Sequence = i + 1;
        item.arrival = step.arrival;
        item.duration = step.duration;
        newItems.push(item);
    });
    // })

    return newItems;
}
