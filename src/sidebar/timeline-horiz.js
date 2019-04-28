import React, { useState } from 'react'
import styled from '@emotion/styled';
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import range from '../utils/range';
import Badge from '../common/badge';
import clamp from 'lodash.clamp';
import Duration from '../utils/duration';


const Container = styled.div`
    padding: 0px 16px;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    padding: 12px 0;
    transition: flex-basis 2s ease;
    border-left: 1px solid #fff3;
`

const Times = styled(Row)`
    display:flex;
    color: #fff7;
`

const Line = styled.div`
    display:flex;
    color: #fff7;
    border-top: 1px solid #fff3;
    align-items:center;

`
const Driver = styled.div`
    flex: 0 0 100px;
`


const Col = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: ${props => props.width}px;
    font-size: 0.5rem ;

`

export default function TimelineHoriz({ state, dispath }) {

    const drivers = useStore(driverStore);

    const [multiplier, setMultiplier] = useState(600)
    const items = state.items;

    const timelineStart = Math.trunc(items.min('arrival') / 3600)
    const timelineEnd = Math.trunc(items.max('arrival') / 3600) + 1;
    const timelineRange = [...range(timelineStart, timelineEnd)]

    function handleWheel(e) {
        const newValue = clamp(multiplier + e.deltaY / 4, 0, 2000);
        setMultiplier(newValue);
    }

    function renderRow(item, index, items) {

        const time = item.arrival / 3600;
        const nextItem = items[index + 1];
        const nextTime = nextItem ? nextItem.arrival / 3600 : timelineEnd;

        let diff = nextTime - time;
        const width = Math.trunc((diff - Math.floor(diff).toFixed(2)) * multiplier) || 0;

        const { color } = drivers.get(item.Driver);

        const ret = (
            <Col key={item.OrderId} width={width}>
                <Badge draggable onDragStart={() => console.log('dragstart')} color={color}>{item.Sequence}</Badge>
                {Duration(item.arrival).format('{mm}')}
            </Col>
        );

        return ret;
    }

    return (
        <Container
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onWheel={handleWheel}
        >
            <Times>
                <div />
                {timelineRange.map(hour =>
                    <Col key={hour} width={multiplier}>
                        {hour}
                    </Col>
                )}
            </Times>
            {drivers.map(({ id: driver }) => <Line>
                <Driver>{driver}</Driver>
                <Row key={driver}>
                    {items.where('Driver', driver).sortBy('arrival').map(renderRow)}
                </Row>
            </Line>
            )}
        </Container>
    )
}
