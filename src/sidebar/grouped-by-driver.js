import React from 'react'
import styled from '@emotion/styled';
import Duration from '../utils/duration';


const padding = 'padding: 0px 6px;'

const Container = styled.div`
    user-select: none;
`

const Row = styled.div`
    display: flex;
    padding: 4px 0px;
    font-size: 0.7rem;
    color: #fff7;
    :hover {background-color: #fff3};
`

const Primary = styled.div`
    ${padding};
    flex: 0 0 100px;
    text-align: right;
    visibility: ${props => !props.visible && 'hidden'};
`

const Secondary = styled.div`
    ${padding};
    flex: 0 0 200px;
    margin-left: 12px;
`

const Number = styled.div`
    ${padding};
    flex: 0 0 4ch;
    text-align:right;
`

const Time = styled.div`
    ${padding};
    flex: 0 0 6ch;
    text-align:right;
`


const Notes = styled.div`
    ${padding};
    flex: 1 0 420px;
`

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
