import React from 'react'
import styled from '@emotion/styled';
import range from '../utils/range';

const Container = styled.div`
    display: flex;
    flex-direction: row;
`

const Hour = styled.div`
    background-color: #fff3;
    justify-self:center;
    align-self:center;
`

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Item = styled.div``

export default function Timeline({ state, dispatch }) {

    const items = state.items;
    const driverItems = items.where('Driver', 'SAM1').all();

    const timelineStart = Math.trunc(items.min('arrival') / 3600)
    const timelineEnd = Math.trunc(items.max('arrival') / 3600) + 1;
    const timelineRange = [...range(timelineStart, timelineEnd)]
    return (
        <div>
            {timelineRange.map(hour =>
                <Container>
                    <Hour key={hour}>{hour}</Hour>
                    <ItemContainer>
                        {driverItems.filter(item => Math.trunc(item.arrival / 3600) === hour).map(item =>
                            <Item>{item.arrival}</Item>)
                        }
                    </ItemContainer>
                </Container>
            )}
        </div>
    )
}
