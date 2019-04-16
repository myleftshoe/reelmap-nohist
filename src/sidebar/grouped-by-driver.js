import React from 'react'
import styled from '@emotion/styled';


const padding = 'padding: 0px 6px;'

const Row = styled.div`
    display: flex;
    padding: 4px 12px;
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
    flex: 0 0 40px;
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

    return items.map((item, index) => {
        const row = (
            <Row key={item.OrderId}>
                <Primary id={item[primary]} type={primary} draggable title={item.PostalCode} visible={item[primary] !== prev}>{item[primary]}</Primary>
                <Secondary id={item.OrderId} type='item' draggable>{item.Street}</Secondary>
                <Number>{item.Sequence}</Number>
                <Number>{'#' + item.OrderId}</Number>
                <Notes>{item.DeliveryNotes}</Notes>
            </Row>
        );
        prev = item[primary];
        return row;
    })
}
