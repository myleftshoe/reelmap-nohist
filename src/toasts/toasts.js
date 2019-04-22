import React from 'react'
import Solution from '../common/solution';
import { drivers } from '../common/constants';
import styled from '@emotion/styled';

export const Header = styled.span`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding: 0 12px 0 12px;
    line-height: 2.0rem;
    font-size: 0.6rem;
    color: #aaaa;
    max-width: 800px;
    text-transform: uppercase;
    /* max-width:312px; */
    &:hover { background-color: #7773; };
`

export function SolutionToast(id, solution) {
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
                    <div>{drivers.get(vehicle)}</div>

                </Header>
                <Solution distance={distance} duration={duration} service={service} />
            </>;
        })
    })
}
