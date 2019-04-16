import React, { useState } from 'react'
import styled from '@emotion/styled';
import range from '../utils/range';
import { colors, drivers } from '../common/constants';
import Badge from '../common/badge';
import clamp from 'lodash.clamp';


const Container = styled.div`
    padding: 0px 16px;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    padding: 12px 0;
    transition: flex-basis 2s ease;
`

const Times = styled(Row)`
    color: #fff7;
`

const Col = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: ${props => props.width}px;
    font-size: 0.7rem ;
`

export default function TimelineHoriz({ state, dispath }) {

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

        const ret = (
            <Col key={item.OrderId} width={width}>
                <Badge draggable onDragStart={() => console.log('dragstart')} color={colors[item.Driver]}>{item.Sequence}</Badge>
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
                {timelineRange.map(hour =>
                    <Col key={hour} width={multiplier}>
                        {hour}
                    </Col>
                )}
            </Times>
            {drivers.map(driver =>
                <Row key={driver}>
                    {items.where('Driver', driver).sortBy('arrival').map(renderRow)}
                </Row>
            )}
        </Container>
    )
}
