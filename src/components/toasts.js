import React from 'react'
import Solution from './solution';
import { Header } from './group.sc';
import { drivers } from '../constants';

export default function SolutionToast(id, solution) {
    const { vehicle, distance, duration, service } = solution.summary;
    return ({
        id,
        content: <>
            {/* <Header id={vehicle}>
                <div>{drivers[vehicle]}</div>
                <div>{formattedDuration(duration + service)}</div>
            </Header> */}
            <Solution distance={distance} duration={duration} service={service} />
        </>,
        expandedContent: solution.routes.map(route => {
            const { vehicle, distance, duration, service } = route;
            return <>
                <Header id={vehicle}>
                    <div>{drivers[vehicle]}</div>

                </Header>
                <Solution distance={distance} duration={duration} service={service} />
            </>;
        })
    })
}
