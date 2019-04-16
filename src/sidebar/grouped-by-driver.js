import React from 'react'
import Duration from '../utils/duration';
import { Container, Row, Number, Time, Primary, Secondary, Notes } from './grouped-by-driver-sc';


export default function GroupedByDriver({ items, sortBy }) {

    console.log(sortBy)
    const views = {
        City: ['primary', 'secondary', 'sequence', 'arrival', 'orderId', 'notes'],
        Sequence: ['sequence', 'arrival', 'primary', 'secondary', 'orderId', 'notes'],
        OrderId: ['orderId', 'secondary', 'primary', 'sequence', 'arrival', 'notes'],
    }

    const componentOrder = views[sortBy] || ['sequence', 'arrival', 'primary', 'secondary', 'orderId', 'notes'];

    let primary = sortBy;
    if (['OrderId', 'Sequence'].includes(primary))
        primary = 'City'

    let prev;


    return <Container>
        {items.map((item, index) => {
            const components = {
                sequence: <Number key='sequence'>{item.Sequence}</Number>,
                arrival: <Time key='arrival'>{Duration(item.arrival).format()}</Time>,
                primary: <Primary key='primary' id={item[primary]} type={primary} draggable title={item.PostalCode} visible={item[primary] !== prev}>{item[primary]}</Primary>,
                secondary: <Secondary key='secondary' id={item.OrderId} type='item' draggable>{item.Street}</Secondary>,
                orderId: <Number key='orderid'>{'#' + item.OrderId}</Number>,
                notes: <Notes key='notes'>{item.DeliveryNotes}</Notes>
            }
            const row = (
                <Row key={item.OrderId}>
                    {componentOrder.map(component => components[component])}
                </Row>
            );
            prev = item[primary];
            return row;
        })
        }
    </Container>
}
