import React from 'react'
import Duration from '../utils/duration';
import { Container, Row, Number, Time, Primary, Secondary, Notes } from './grouped-by-driver-sc';
import { SearchHighlight } from '../group/group.sc';
import { PoseGroup } from 'react-pose';


export default function GroupedByDriver({ items, sortBy, searchFilter }) {

    console.log(sortBy)
    const views = {
        City: ['city', 'street', 'sequence', 'arrival', 'orderId', 'notes'],
        Sequence: ['arrival', 'sequence','city', 'street', 'orderId', 'notes'],
        OrderId: ['orderId', 'city', 'street', 'sequence', 'arrival', 'notes'],
    }

    function handleDragStart(e) {

        const target = e.currentTarget;
        const { x, y, width, height } = target.firstChild.getBoundingClientRect();

        const paddingTop = target.computedStyleMap().get('padding-top').value;
        const paddingBottom = target.computedStyleMap().get('padding-bottom').value;
        const paddingLeft = target.computedStyleMap().get('padding-top').value;
        const paddingRight = target.computedStyleMap().get('padding-bottom').value;

        const posX = e.clientX - x + paddingLeft + paddingRight;
        const posY = e.clientY - y + paddingTop + paddingBottom;

        const crt = target.cloneNode(target);
        crt.style.color = 'white';
        crt.style.backgroundColor = 'orange';
        // crt.style.backgroundColor = "#1d2f3d";
        crt.style.border = '2px solid white';
        crt.style.textAlign = 'center';
        crt.style.width = `${width}px`;
        crt.style.height = `${height}px`;
        crt.style.position = 'absolute';
        crt.style.top = '0';
        crt.style.left = '0';
        crt.style.zIndex = '-1';

        target.parentNode.appendChild(crt);
        e.dataTransfer.setDragImage(crt, posX, posY);

        setTimeout(() => crt.parentNode.removeChild(crt), 0);

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
                            <SearchHighlight search={searchFilter}>
                                {item.City}
                            </SearchHighlight>
                        </Primary>
                    ),
                    street: (
                        <Secondary key='secondary' id={item.OrderId} type='item' draggable onDragStart={handleDragStart}>
                            <SearchHighlight search={searchFilter}>
                                {item.Street}
                            </SearchHighlight>
                        </Secondary>
                    ),
                    orderId: (
                        <Number key='orderid'>
                            <SearchHighlight search={searchFilter}>
                                {'#' + item.OrderId}
                            </SearchHighlight>
                        </Number>
                    ),
                    notes: (
                        <Notes key='notes'>
                            <SearchHighlight search={searchFilter}>
                                {item.DeliveryNotes}
                            </SearchHighlight>
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
