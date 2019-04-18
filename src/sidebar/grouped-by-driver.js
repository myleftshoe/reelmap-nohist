import React from 'react'
import Duration from '../utils/duration';
import { Container, Row, Number, Time, Primary, Secondary, Notes } from './grouped-by-driver-sc';
import { searchable } from '../common/filter';
import { PoseGroup } from 'react-pose';
import createGhostElement from '../common/ghost-element';





export default function GroupedByDriver({ items, sortBy }) {

    console.log(sortBy)
    const views = {
        City: ['city', 'street', 'sequence', 'arrival', 'orderId', 'notes'],
        Sequence: ['arrival', 'sequence', 'street', 'city', 'orderId', 'notes'],
        OrderId: ['orderId', 'street', 'city', 'sequence', 'arrival', 'notes'],
    }

    function handleDragStart(e) {

        let count;
        if (sortBy === 'City') {
            count = items.filter(({ City }) => City === 'Brunswick').length
        }

        const target = e.currentTarget;

        const { x, y, width, height } = target.firstChild.getBoundingClientRect();
        const posX = e.clientX - x + 8;
        const posY = e.clientY - y + 4;

        const ghostElement = createGhostElement({ target, width, height: height + 4, badgeContent: count })

        e.dataTransfer.setDragImage(ghostElement, posX, posY);
    }

    const componentOrder = views[sortBy] || ['sequence', 'arrival', 'city', 'secondary', 'orderId', 'notes'];

    let prevCity;

    return <Container>
        <PoseGroup>
            {items.map((item, index) => {
                const components = {
                    sequence: (
                        <Number key='sequence'>{item.Sequence || '-'}</Number>
                    ),
                    arrival: (
                        <Time key='arrival'>{Duration(item.arrival).format()}</Time>
                    ),
                    city: (
                        <Primary key='city' id={item.City} type='City' draggable onDragStart={handleDragStart} title={item.PostalCode} visible={item.City !== prevCity}>
                            {searchable(item.City)}
                        </Primary>
                    ),
                    street: (
                        <Secondary key='secondary' id={item.OrderId} type='item' draggable onDragStart={handleDragStart}>
                            {searchable(item.Street)}
                        </Secondary>
                    ),
                    orderId: (
                        <Number key='orderid'>
                            {searchable('#' + item.OrderId)}
                        </Number>
                    ),
                    notes: (
                        <Notes key='notes'>
                            {searchable(item.DeliveryNotes)}
                        </Notes>
                    ),
                }
                const row = (
                    <Row key={item.OrderId}>
                        {componentOrder.map(component => components[component])}
                    </Row>
                );
                prevCity = item.City;
                return row;
            })
            }
        </PoseGroup>
    </Container>
}
