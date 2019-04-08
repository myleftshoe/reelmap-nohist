import React from 'react'
import posed, { PoseGroup } from 'react-pose';
import styled from '@emotion/styled';
import Minibar from './minibar';
import Expandable from './expandable';
import Solution from './solution';
import formattedDuration from '../utils/formatted-duration';
import { Header } from './group.sc';
import { drivers } from '../constants';

const toast = {};

toast.style = styled.div`
    background-color: #0003;
    margin: 4px 12px 4px 8px;
    padding-bottom: 8px;
`

toast.pose = posed(toast.style)({
    enter: { opacity: 1, delay: 300 },
    exit: { opacity: 0 }
});

const Toast = toast.pose

export default function Toasts({ toasts, onSelect, onDelete }) {
    console.log([...toasts.keys()])
    return (
        <PoseGroup>{
            [...toasts.entries()].reverse().map(([key, { summary, routes }], index) =>
                <Toast key={key}>
                    <Minibar>
                        <Minibar.Button title='Restore' visible >restore</Minibar.Button>
                        <Minibar.Button title='Clear history' visible >clear</Minibar.Button>
                    </Minibar>
                    {/* <TextButton style={{ display: 'flex', width: '100%', justifyContent: 'center' }} color='#fff7' onClick={() => dispatch('apply-snapshot')(key)}>Show</TextButton> */}
                    <Expandable key={'totals'} expanded={false} content={
                        <Solution id={key} distance={summary.distance} duration={summary.duration} service={summary.service} />
                    } >
                        {routes.map(route => <>
                            <Header id={route.vehicle}>
                                <div>{drivers[route.vehicle]}</div>
                                <div>{formattedDuration(route.duration + route.service)}</div>
                            </Header>
                            <Solution distance={route.distance} duration={route.duration} service={route.service} />
                        </>
                        )}
                    </Expandable>
                </Toast>
            )
        }
        </PoseGroup>
    )
}