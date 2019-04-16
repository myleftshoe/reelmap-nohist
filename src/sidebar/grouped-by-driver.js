import React from 'react'
import Duration from '../utils/duration';
import { Container, Row, Number, Time, Primary, Secondary, Notes } from './grouped-by-driver-sc';


export default function GroupedByDriver({ items, sortBy }) {

    console.log(sortBy)
    const views = {
        City: ['city', 'street', 'sequence', 'arrival', 'orderId', 'notes'],
        Sequence: ['sequence', 'arrival', 'city', 'street', 'orderId', 'notes'],
        OrderId: ['orderId', 'city', 'street', 'sequence', 'arrival', 'notes'],
    }

    const componentOrder = views[sortBy] || ['sequence', 'arrival', 'city', 'secondary', 'orderId', 'notes'];

    let prevCity;

    return <Container>
        {items.map((item, index) => {
            const components = {
                sequence: <Number key='sequence'>{item.Sequence || '-'}</Number>,
                arrival: <Time key='arrival'>{Duration(item.arrival).format()}</Time>,
                city: <Primary key='city' id={item.City} type='City' draggable title={item.PostalCode} visible={item.City !== prevCity}>{item.City}</Primary>,
                street: <Secondary key='secondary' id={item.OrderId} type='item' draggable>{item.Street}</Secondary>,
                orderId: <Number key='orderid'>{'#' + item.OrderId}</Number>,
                notes: <Notes key='notes'>{item.DeliveryNotes}</Notes>
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
    </Container>
}
