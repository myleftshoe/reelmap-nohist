import React from 'react'
import Duration from '../utils/duration';
import { Container, Row, Number, Time, Primary, Secondary, Notes } from './grouped-by-driver-sc';


export default function GroupedByDriver({ items, sortBy }) {

    let primary = sortBy;
    if (['OrderId', 'Sequence'].includes(primary))
        primary = 'City'

    let prev;

    return <Container>
        {items.map((item, index) => {
            const row = (
                <Row key={item.OrderId}>
                    <Number>{item.Sequence}</Number>
                    <Time>{Duration(item.arrival).format()}</Time>
                    <Primary id={item[primary]} type={primary} draggable title={item.PostalCode} visible={item[primary] !== prev}>{item[primary]}</Primary>
                    <Secondary id={item.OrderId} type='item' draggable>{item.Street}</Secondary>
                    <Number>{'#' + item.OrderId}</Number>
                    <Notes>{item.DeliveryNotes}</Notes>
                </Row>
            );
            prev = item[primary];
            return row;
        })
        }
    </Container>
}
