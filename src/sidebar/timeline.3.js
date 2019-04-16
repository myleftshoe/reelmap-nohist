import React, { useState } from 'react'
import styled from '@emotion/styled';
import Duration from '../utils/duration';
import { Time, Primary, Row, Secondary } from './grouped-by-driver-sc';
import clamp from 'lodash.clamp';


const Container = styled.div`
    display: grid;
    grid-template-columns: auto 5fr;
    grid-gap: 2px;
    font-size: .7rem;
    /* align-items: center; */
`

const Hour = styled.div`
    background-color: #aaa1;
    grid-row: span ${props => props.span} / ${props => props.row};
    grid-column: 1;
    display:flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px;
    /* grid-row: span 6 / 1; */
    /* justify-content: center;
    vertical-align: middle; */
`

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Item = styled.div`
    grid-column:2;
    height: ${props => props.height}px;
    /* background-color:red; */
    /* align-content: center; */

`


export default function Timeline({ state, dispatch }) {

    const [multiplier, setMultiplier] = useState(0.5);

    let prevHour;
    let row = 0;
    let span = 0;
    function renderHour(hour) {
        if (!prevHour) prevHour = hour;
        let ret = null;
        if (hour > prevHour) {
            ret = <Hour row={row} span={span}>{prevHour}</Hour>
            console.log(prevHour, hour, row);
            span = 0;
        }
        row++;
        span++;
        prevHour = hour;
        return ret;
    }


    function handleWheel(e) {
        if (!e.shiftKey) return;
        const newValue = clamp((multiplier * 100 + e.deltaY / 10) / 100, 0.5, 5);
        console.log(newValue)
        setMultiplier(newValue);
    }


    const items = state.items;
    const driverItems = items.where('Driver', 'SAM1').sortBy('arrival').all();

    let hour;
    let prevCity;
    return (
        <Container onWheel={handleWheel}>
            {driverItems.map((item, index) => {
                const arrival = Duration(item.arrival);
                hour = arrival.hour;
                const nextItem = driverItems[index + 1] || {};
                const nextArrival = Duration(nextItem.arrival);
                const height = (nextItem.arrival - item.arrival) / 5;
                console.log(height)
                const ret = <>
                    <Item height={height * multiplier}>
                        <Row>
                            <Time>{Duration(item.arrival).format('{mm}')}</Time>
                            <Primary visible={item.City !== prevCity}>{item.City}</Primary>
                            <Secondary>{item.Street}</Secondary>
                        </Row>
                    </Item>
                    {renderHour(hour)}
                </>
                prevCity = item.City;
                return ret;
            })}
            {renderHour(++hour)}
        </Container>
    )
}
